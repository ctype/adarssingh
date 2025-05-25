import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { apolloClientMutate, apolloClientQuery } from "@/apollo/apolloHelper";
import { FETCH_GENRE_MIXES } from "@/graphql/query/genreMix/genreMix.query";
import { CREATE_GENRE_MIX, DELETE_GENRE_MIX, UPDATE_GENRE_MIX } from "@/graphql/mutation/genreMix/genreMix.mutation";

const initialState: IBaseSliceInitialState & {
  genreMixes: GenreMix[];
} = {
  genreMixes: [],
  error: null,
  isPending: false,
}

export const fetchGenreMixes = createAsyncThunk(
  "genreMix/fetchGenreMixes",
  async () => {
    return await apolloClientQuery(FETCH_GENRE_MIXES, {});
  }
);

export const createGenreMix = createAsyncThunk(
  "genreMix/createGenreMix",
  async (name: string) => {
    return await apolloClientMutate(CREATE_GENRE_MIX, { name }, {}, { suppressGlobalError: true });
  }
);

export const updateGenreMix = createAsyncThunk(
  "genreMix/updateGenreMix",
  async ({ id, name }: { id: number, name: string }) => {
    return await apolloClientMutate(UPDATE_GENRE_MIX, { id, name }, {}, { suppressGlobalError: true });
  }
);

export const deleteGenreMix = createAsyncThunk(
  "genreMix/deleteGenreMix",
  async (id: number) => {
    return await apolloClientMutate(DELETE_GENRE_MIX, { id });
  }
);

const GenreMixSlice = createSlice({
  name: "genreMixes",
  initialState,
  reducers: {
    setGenreMixes(state, action) {
      state.genreMixes = action.payload;
    },
    resetGenreMixBaseState(state) {
      state.error = null;
      state.isPending = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGenreMixes.pending, (state) => {
        state.isPending = true;
      })
      .addCase(fetchGenreMixes.fulfilled, (state, action) => {
        state.isPending = false;
        state.genreMixes = action.payload.genreMixes;
      })
      // .addCase(fetchGenreMixes.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(createGenreMix.fulfilled, (state, action) => {
        state.isPending = false;
        if (action.payload.errors) {
          state.error = action.payload.errors;
          return;
        }
        state.genreMixes.push(action.payload.createGenreMix);
      })
      // .addCase(createGenreMix.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(updateGenreMix.fulfilled, (state, action) => {
        state.isPending = false;
        if (action.payload.errors) {
          state.error = action.payload.errors;
          return;
        }
        const index = state.genreMixes.findIndex(
          (category) => category.id === action.payload.updateGenreMix.id
        );
        state.genreMixes[index] = action.payload.updateGenreMix;
      })
      // .addCase(updateGenreMix.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(deleteGenreMix.pending, (state) => {
        state.isPending = true;
      })
      .addCase(deleteGenreMix.fulfilled, (state, action) => {
        state.isPending = false;
        state.genreMixes = state.genreMixes.filter(
          (category) => category.id !== action.payload.deleteGenreMix
        );
      })
    // .addCase(deleteGenreMix.rejected, (state, action) => {
    //   state.isPending = false;
    //   state.error = action.error.message || null;
    // });
  }
});

export const { setGenreMixes, resetGenreMixBaseState } = GenreMixSlice.actions;
export default GenreMixSlice.reducer;
