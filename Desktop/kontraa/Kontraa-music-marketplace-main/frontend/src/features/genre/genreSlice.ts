import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { FETCH_GENRES } from "@/graphql/query/genre/genre.query";
import { apolloClientMutate, apolloClientQuery } from "@/apollo/apolloHelper";
import { CREATE_GENRE, DELETE_GENRE, UPDATE_GENRE } from "@/graphql/mutation/genre/genre.mutation";

const initialState: IBaseSliceInitialState & {
  genres: Genre[];
  isUploading: boolean;
} = {
  genres: [],
  error: null,
  isPending: false,
  isUploading: false,
}

export const fetchGenres = createAsyncThunk(
  "genre/fetchGenres",
  async () => {
    return await apolloClientQuery(FETCH_GENRES, {});
  }
);

export const createGenre = createAsyncThunk(
  "genre/createGenre",
  async ({ name, genreArtwork }: { name: string, genreArtwork: File }) => {
    return await apolloClientMutate(CREATE_GENRE, { data: { name, genreArtwork } }, {
      "apollo-require-preflight": "true",
    }, { suppressGlobalError: true });
  }
);

export const updateGenre = createAsyncThunk(
  "genre/updateGenre",
  async ({ id, data }: { id: number, data: { name?: string, genreArtwork?: File } }) => {
    return await apolloClientMutate(UPDATE_GENRE, { id, data }, {
      "apollo-require-preflight": "true",
    }, { suppressGlobalError: true });
  }
);

export const deleteGenre = createAsyncThunk(
  "genre/deleteGenre",
  async (id: number) => {
    return await apolloClientMutate(DELETE_GENRE, { id });
  }
);

const GenreSlice = createSlice({
  name: "genres",
  initialState,
  reducers: {
    setGenres(state, action) {
      state.genres = action.payload;
    },
    resetGenreBaseState(state) {
      state.error = null;
      state.isPending = false;
      state.isUploading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGenres.pending, (state) => {
        state.isPending = true;
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.isPending = false;
        state.genres = action.payload.genres;
      })
      // .addCase(fetchGenres.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(createGenre.pending, (state) => {
        state.isUploading = true;
      })
      .addCase(createGenre.fulfilled, (state, action) => {
        state.isUploading = false;
        if (action.payload.errors) {
          state.error = action.payload.errors;
          return;
        }
        state.genres.push(action.payload.createGenre);
      })
      // .addCase(createGenre.rejected, (state, action) => {
      //   state.isUploading = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(updateGenre.pending, (state) => {
        state.isUploading = true;
      })
      .addCase(updateGenre.fulfilled, (state, action) => {
        state.isUploading = false;
        if (action.payload.errors) {
          state.error = action.payload.errors;
          return;
        }
        const index = state.genres.findIndex(
          (category) => category.id === action.payload.updateGenre.id
        );
        state.genres[index] = action.payload.updateGenre;
      })
      // .addCase(updateGenre.rejected, (state, action) => {
      //   state.isUploading = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(deleteGenre.pending, (state) => {
        state.isPending = true;
      })
      .addCase(deleteGenre.fulfilled, (state, action) => {
        state.isPending = false;
        state.genres = state.genres.filter(
          (category) => category.id !== action.payload.deleteGenre
        );
      })
    // .addCase(deleteGenre.rejected, (state, action) => {
    //   state.isPending = false;
    //   state.error = action.error.message || null;
    // });
  }
});

export const { setGenres, resetGenreBaseState } = GenreSlice.actions;
export default GenreSlice.reducer;
