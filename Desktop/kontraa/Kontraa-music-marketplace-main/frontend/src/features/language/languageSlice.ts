import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { apolloClientMutate, apolloClientQuery } from "@/apollo/apolloHelper";
import { FETCH_LANGUAGES } from "@/graphql/query/language/language.query";
import { CREATE_LANGUAGE, DELETE_LANGUAGE, UPDATE_LANGUAGE } from "@/graphql/mutation/language/language.mutaion";

const initialState: IBaseSliceInitialState & {
  languages: Language[];
} = {
  languages: [],
  error: null,
  isPending: false,
}

export const fetchLanguages = createAsyncThunk(
  "language/fetchLanguages",
  async () => {
    return await apolloClientQuery(FETCH_LANGUAGES, {});
  }
);

export const createLanguage = createAsyncThunk(
  "language/createLanguage",
  async (name: string) => {
    return await apolloClientMutate(CREATE_LANGUAGE, { name }, {}, { suppressGlobalError: true });
  }
);

export const updateLanguage = createAsyncThunk(
  "language/updateLanguage",
  async ({ id, name }: { id: number, name: string }) => {
    return await apolloClientMutate(UPDATE_LANGUAGE, { id, name }, {}, { suppressGlobalError: true });
  }
);

export const deleteLanguage = createAsyncThunk(
  "language/deleteLanguage",
  async (id: number) => {
    return await apolloClientMutate(DELETE_LANGUAGE, { id });
  }
);

const LanguageSlice = createSlice({
  name: "languages",
  initialState,
  reducers: {
    setLanguages(state, action) {
      state.languages = action.payload;
    },
    resetLangBaseState(state) {
      state.error = null;
      state.isPending = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLanguages.pending, (state) => {
        state.isPending = true;
      })
      .addCase(fetchLanguages.fulfilled, (state, action) => {
        state.isPending = false;
        state.languages = action.payload.languages;
      })
      // .addCase(fetchLanguages.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(createLanguage.fulfilled, (state, action) => {
        state.isPending = false;
        if (action.payload.errors) {
          state.error = action.payload.errors;
          return;
        }
        state.languages.push(action.payload.createLanguage);
      })
      // .addCase(createLanguage.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(updateLanguage.fulfilled, (state, action) => {
        state.isPending = false;
        if (action.payload.errors) {
          state.error = action.payload.errors;
          return;
        }
        const index = state.languages.findIndex(
          (category) => category.id === action.payload.updateLanguage.id
        );
        state.languages[index] = action.payload.updateLanguage;
      })
      // .addCase(updateLanguage.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(deleteLanguage.pending, (state) => {
        state.isPending = true;
      })
      .addCase(deleteLanguage.fulfilled, (state, action) => {
        state.isPending = false;
        state.languages = state.languages.filter(
          (category) => category.id !== action.payload.deleteLanguage
        );
      })
    // .addCase(deleteLanguage.rejected, (state, action) => {
    //   state.isPending = false;
    //   state.error = action.error.message || null;
    // });
  }
});

export const { setLanguages, resetLangBaseState } = LanguageSlice.actions;
export default LanguageSlice.reducer;
