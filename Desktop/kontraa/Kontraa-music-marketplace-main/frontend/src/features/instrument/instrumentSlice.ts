import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { apolloClientMutate, apolloClientQuery } from "@/apollo/apolloHelper";
import { FETCH_INSTRUMENT } from "@/graphql/query/instrument/instrument.query";
import { CREATE_INSTRUMENT, DELETE_INSTRUMENT, UPDATE_INSTRUMENT } from "@/graphql/mutation/instrument/instrument.mutation";

const initialState: IBaseSliceInitialState & {
  instruments: Instrument[];
} = {
  instruments: [],
  error: null,
  isPending: false,
}

export const fetchInstruments = createAsyncThunk(
  "instruments/fetchInstruments",
  async () => {
    return await apolloClientQuery(FETCH_INSTRUMENT, {});
  }
);

export const createInstrument = createAsyncThunk(
  "instruments/createInstrument",
  async (name: string) => {
    return await apolloClientMutate(CREATE_INSTRUMENT, { name }, {}, { suppressGlobalError: true });
  }
);

export const updateInstrument = createAsyncThunk(
  "instruments/updateInstrument",
  async ({ id, name }: { id: number, name: string }) => {
    return await apolloClientMutate(UPDATE_INSTRUMENT, { id, name }, {}, { suppressGlobalError: true });
  }
);

export const deleteInstrument = createAsyncThunk(
  "instruments/deleteInstrument",
  async (id: number) => {
    return await apolloClientMutate(DELETE_INSTRUMENT, { id });
  }
);

const InstrumentSlice = createSlice({
  name: "instruments",
  initialState,
  reducers: {
    setInstruments(state, action) {
      state.instruments = action.payload;
    },
    resetInstrumentBaseState(state) {
      state.error = null;
      state.isPending = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInstruments.pending, (state) => {
        state.isPending = true;
      })
      .addCase(fetchInstruments.fulfilled, (state, action) => {
        state.isPending = false;
        state.instruments = action.payload.instruments;
      })
      // .addCase(fetchInstruments.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(createInstrument.fulfilled, (state, action) => {
        state.isPending = false;
        if (action.payload.errors) {
          state.error = action.payload.errors;
          return;
        }
        state.instruments.push(action.payload.createInstrument);
      })
      // .addCase(createInstrument.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(updateInstrument.fulfilled, (state, action) => {
        state.isPending = false;
        if (action.payload.errors) {
          state.error = action.payload.errors;
          return;
        }
        const index = state.instruments.findIndex(
          (instrument) => instrument.id === action.payload.updateInstrument.id
        );
        state.instruments[index] = action.payload.updateInstrument;
      })
      // .addCase(updateInstrument.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(deleteInstrument.pending, (state) => {
        state.isPending = true;
      })
      .addCase(deleteInstrument.fulfilled, (state, action) => {
        state.isPending = false;
        state.instruments = state.instruments.filter(
          (instrument) => instrument.id !== action.payload.deleteInstrument
        );
      })
    // .addCase(deleteInstrument.rejected, (state, action) => {
    //   state.isPending = false;
    //   state.error = action.error.message || null;
    // });
  }
});

export const { setInstruments, resetInstrumentBaseState } = InstrumentSlice.actions;
export default InstrumentSlice.reducer;
