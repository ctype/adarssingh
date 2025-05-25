import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { FETCH_SUBGENRES } from "@/graphql/query/subGenre/subGenre.query";
import { apolloClientMutate, apolloClientQuery } from "@/apollo/apolloHelper";
import { CREATE_SUBGENRE, DELETE_SUBGENRE, UPDATE_SUBGENRE } from "@/graphql/mutation/subGenre/subGenremutation";

const initialState: IBaseSliceInitialState & {
  subGenres: SubGenre[];
  isUploading: boolean;
} = {
  subGenres: [],
  error: null,
  isPending: false,
  isUploading: false,
}

export const fetchSubGenres = createAsyncThunk(
  "subGenre/fetchSubGenres",
  async () => {
    return await apolloClientQuery(FETCH_SUBGENRES, {});
  }
);

export const createSubGenre = createAsyncThunk(
  "subGenre/createSubGenre",
  async ({ name, genreId }: { name: string, genreId?: number }) => {
    const response = await apolloClientMutate(CREATE_SUBGENRE, { data: { name, genreId } }, {}, { suppressGlobalError: true });
    return response;
  }
);

export const updateSubGenre = createAsyncThunk(
  "subGenre/updateSubGenre",
  async ({ id, name, genreId }: { id: number, name?: string, genreId?: number }) => {
    return await apolloClientMutate(UPDATE_SUBGENRE, { id, data: { name, genreId } }, {}, { suppressGlobalError: true });
  }
);

export const deleteSubGenre = createAsyncThunk(
  "subgenre/deleteSubGenre",
  async (id: number) => {
    return await apolloClientMutate(DELETE_SUBGENRE, { id });
  }
);

const SubGenreSlice = createSlice({
  name: "subGenres",
  initialState,
  reducers: {
    setSubGenres(state, action) {
      state.subGenres = action.payload;
    },
    resetSubGenreBaseState(state) {
      state.error = null;
      state.isPending = false;
      state.isUploading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubGenres.pending, (state) => {
        state.isPending = true;
      })
      .addCase(fetchSubGenres.fulfilled, (state, action) => {
        state.isPending = false;
        state.subGenres = action.payload.subGenres;
      })
      // .addCase(fetchSubGenres.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error as GraphqlErrorObj || null;
      // })
      .addCase(createSubGenre.pending, (state) => {
        state.isUploading = true;
        state.error = null;
      })
      .addCase(createSubGenre.fulfilled, (state, action) => {
        state.isUploading = false;
        if (action.payload.errors) {
          state.error = action.payload.errors;
          return;
        }
        state.subGenres.push(action.payload.createSubGenre);
      })
      // .addCase(createSubGenre.rejected, (state, action) => {
      //   state.isUploading = false;
      //   state.error = action.error as GraphqlErrorObj || null;
      // })
      .addCase(updateSubGenre.pending, (state) => {
        state.isUploading = true;
      })
      .addCase(updateSubGenre.fulfilled, (state, action) => {
        state.isUploading = false;
        if (action.payload.errors) {
          state.error = action.payload.errors;
          return;
        }
        const index = state.subGenres.findIndex(
          (category) => category.id === action.payload.updateSubGenre.id
        );
        state.subGenres[index] = action.payload.updateSubGenre;
      })
      // .addCase(updateSubGenre.rejected, (state, action) => {
      //   state.isUploading = false;
      //   state.error = action.error as GraphqlErrorObj || null;
      // })
      .addCase(deleteSubGenre.pending, (state) => {
        state.isPending = true;
      })
      .addCase(deleteSubGenre.fulfilled, (state, action) => {
        state.isPending = false;
        state.subGenres = state.subGenres.filter(
          (category) => category.id !== action.payload.deleteSubGenre
        );
      })
    // .addCase(deleteSubGenre.rejected, (state, action) => {
    //   state.isPending = false;
    //   state.error = action.error as GraphqlErrorObj || null;
    // });
  }
});

export const { setSubGenres, resetSubGenreBaseState } = SubGenreSlice.actions;
export default SubGenreSlice.reducer;
