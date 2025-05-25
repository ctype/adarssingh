import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { FETCH_MOODTYPES } from "@/graphql/query/moodType/moodType.query";
import { apolloClientMutate, apolloClientQuery } from "@/apollo/apolloHelper";
import { CREATE_MOODTYPE, DELETE_MOODTYPE, UPDATE_MOODTYPE } from "@/graphql/mutation/moodType/moodType.mutation";

const initialState: IBaseSliceInitialState & {
  moodTypes: MoodType[];
} = {
  moodTypes: [],
  error: null,
  isPending: false,
}

export const fetchMoodTypes = createAsyncThunk(
  "moodType/fetchMoodTypes",
  async () => {
    return await apolloClientQuery(FETCH_MOODTYPES, {});
  }
);

export const createMoodType = createAsyncThunk(
  "moodType/createMoodType",
  async (name: string) => {
    return await apolloClientMutate(CREATE_MOODTYPE, { name }, {}, { suppressGlobalError: true });
  }
);

export const updateMoodType = createAsyncThunk(
  "moodType/updateMoodType",
  async ({ id, name }: { id: number, name: string }) => {
    return await apolloClientMutate(UPDATE_MOODTYPE, { id, name }, {}, { suppressGlobalError: true });
  }
);

export const deleteMoodType = createAsyncThunk(
  "moodType/deleteMoodType",
  async (id: number) => {
    return await apolloClientMutate(DELETE_MOODTYPE, { id });
  }
);

const MoodTypeSlice = createSlice({
  name: "moodTypes",
  initialState,
  reducers: {
    setMoodTypes(state, action) {
      state.moodTypes = action.payload;
    },
    resetMoodTyopeBaseState(state) {
      state.error = null;
      state.isPending = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMoodTypes.pending, (state) => {
        state.isPending = true;
      })
      .addCase(fetchMoodTypes.fulfilled, (state, action) => {
        state.isPending = false;
        state.moodTypes = action.payload.moodTypes;
      })
      // .addCase(fetchMoodTypes.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(createMoodType.fulfilled, (state, action) => {
        state.isPending = false;
        if (action.payload.errors) {
          state.error = action.payload.errors;
          return;
        }
        state.moodTypes.push(action.payload.createMoodType);
      })
      // .addCase(createMoodType.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(updateMoodType.fulfilled, (state, action) => {
        state.isPending = false;
        if (action.payload.errors) {
          state.error = action.payload.errors;
          return;
        }
        const index = state.moodTypes.findIndex(
          (category) => category.id === action.payload.updateMoodType.id
        );
        state.moodTypes[index] = action.payload.updateMoodType;
      })
      // .addCase(updateMoodType.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(deleteMoodType.pending, (state) => {
        state.isPending = true;
      })
      .addCase(deleteMoodType.fulfilled, (state, action) => {
        state.isPending = false;
        state.moodTypes = state.moodTypes.filter(
          (category) => category.id !== action.payload.deleteMoodType
        );
      })
    // .addCase(deleteMoodType.rejected, (state, action) => {
    //   state.isPending = false;
    //   state.error = action.error.message || null;
    // });
  }
});

export const { setMoodTypes, resetMoodTyopeBaseState } = MoodTypeSlice.actions;
export default MoodTypeSlice.reducer;
