import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { FETCH_KEYS } from "@/graphql/query/key/key.query";
import { apolloClientMutate, apolloClientQuery } from "@/apollo/apolloHelper";
import { CREATE_KEY, DELETE_KEY, UPDATE_KEY } from "@/graphql/mutation/key/key.mutation";

const initialState: IBaseSliceInitialState & {
  keys: Key[];
} = {
  keys: [],
  error: null,
  isPending: false,
}

export const fetchKeys = createAsyncThunk(
  "key/fetchKeys",
  async () => {
    return await apolloClientQuery(FETCH_KEYS, {});
  }
);

export const createKeys = createAsyncThunk(
  "key/createKeys",
  async (name: string) => {
    return await apolloClientMutate(CREATE_KEY, { name }, {}, { suppressGlobalError: true });
  }
);

export const updateKey = createAsyncThunk(
  "key/updateKey",
  async ({ id, name }: { id: number, name: string }) => {
    return await apolloClientMutate(UPDATE_KEY, { id, name }, {}, { suppressGlobalError: true });
  }
);

export const deleteKey = createAsyncThunk(
  "key/deleteKey",
  async (id: number) => {
    return await apolloClientMutate(DELETE_KEY, { id });
  }
);

const keyslice = createSlice({
  name: "keys",
  initialState,
  reducers: {
    setkeys(state, action) {
      state.keys = action.payload;
    },
    resetKeyBaseState(state) {
      state.error = null;
      state.isPending = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchKeys.pending, (state) => {
        state.isPending = true;
      })
      .addCase(fetchKeys.fulfilled, (state, action) => {
        state.isPending = false;
        state.keys = action.payload.audioKeys;
      })
      // .addCase(fetchKeys.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(createKeys.fulfilled, (state, action) => {
        state.isPending = false;
        if (action.payload.errors) {
          state.error = action.payload.errors;
          return;
        }
        state.keys.push(action.payload.createAudioKey);
      })
      // .addCase(createKeys.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(updateKey.fulfilled, (state, action) => {
        state.isPending = false;
        if (action.payload.errors) {
          state.error = action.payload.errors;
          return;
        }
        const index = state.keys.findIndex(
          (category) => category.id === action.payload.updateAudioKey.id
        );
        state.keys[index] = action.payload.updateAudioKey;
      })
      // .addCase(updateKey.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(deleteKey.pending, (state) => {
        state.isPending = true;
      })
      .addCase(deleteKey.fulfilled, (state, action) => {
        state.isPending = false;
        state.keys = state.keys.filter(
          (category) => category.id !== action.payload.deleteAudioKey
        );
      })
    // .addCase(deleteKey.rejected, (state, action) => {
    //   state.isPending = false;
    //   state.error = action.error.message || null;
    // });
  }
});

export const { setkeys, resetKeyBaseState } = keyslice.actions;
export default keyslice.reducer;
