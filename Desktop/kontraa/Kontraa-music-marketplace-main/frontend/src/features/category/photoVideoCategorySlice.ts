import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { apolloClientMutate, apolloClientQuery } from "@/apollo/apolloHelper";
import { FETCH_PHOTO_VIDEO_CATEGORIES } from "@/graphql/query/category/photoVideoCategory.query";
import { CREATE_PHOTO_VIDEO_CATEGORY, DELETE_PHOTO_VIDEO_CATEGORY, UPDATE_PHOTO_VIDEO_CATEGORY } from "@/graphql/mutation/category/category.mutation";

const initialState: IBaseSliceInitialState & {
  photoVideoCategories: PhotoVideoCategory[];
} = {
  photoVideoCategories: [],
  error: null,
  isPending: false,
}

export const fetchPhotoVideoCategories = createAsyncThunk(
  "photoVideoCategory/fetchCategory",
  async () => {
    return await apolloClientQuery(FETCH_PHOTO_VIDEO_CATEGORIES, {});
  }
);

export const createPhotoVideoCategory = createAsyncThunk(
  "photoVideoCategory/createCategory",
  async (name: string) => {
    return await apolloClientMutate(CREATE_PHOTO_VIDEO_CATEGORY, { name }, {}, { suppressGlobalError: true });
  }
);

export const updatePhotoVideoCategory = createAsyncThunk(
  "photoVideoCategory/updateCategory",
  async ({ id, name }: { id: number, name: string }) => {
    return await apolloClientMutate(UPDATE_PHOTO_VIDEO_CATEGORY, { id, name }, {}, { suppressGlobalError: true });
  }
);

export const deletePhotoVideoCategory = createAsyncThunk(
  "photoVideoCategory/deleteCategory",
  async (id: number) => {
    return await apolloClientMutate(DELETE_PHOTO_VIDEO_CATEGORY, { id });
  }
);

const PhotoVideoCategorySlice = createSlice({
  name: "photoVideoCategory",
  initialState,
  reducers: {
    setPhotoVideoCategories(state, action) {
      state.photoVideoCategories = action.payload;
    },
    resetPhotoVideoCategoryBaseState(state) {
      state.error = null;
      state.isPending = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPhotoVideoCategories.pending, (state) => {
        state.isPending = true;
      })
      .addCase(fetchPhotoVideoCategories.fulfilled, (state, action) => {
        state.isPending = false;
        state.photoVideoCategories = action.payload.photoVideoCategories;
      })
      // .addCase(fetchPhotoVideoCategories.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(createPhotoVideoCategory.fulfilled, (state, action) => {
        state.isPending = false;
        if (action.payload.errors) {
          state.error = action.payload.errors;
          return;
        }
        state.photoVideoCategories.push(action.payload.createPhotoVideoCategory);
      })
      // .addCase(createPhotoVideoCategory.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(updatePhotoVideoCategory.fulfilled, (state, action) => {
        state.isPending = false;
        if (action.payload.errors) {
          state.error = action.payload.errors;
          return;
        }
        const index = state.photoVideoCategories.findIndex(
          (category) => category.id === action.payload.updatePhotoVideoCategory.id
        );
        state.photoVideoCategories[index] = action.payload.updatePhotoVideoCategory;
      })
      // .addCase(updatePhotoVideoCategory.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(deletePhotoVideoCategory.pending, (state) => {
        state.isPending = true;
      })
      .addCase(deletePhotoVideoCategory.fulfilled, (state, action) => {
        state.isPending = false;
        state.photoVideoCategories = state.photoVideoCategories.filter(
          (category) => category.id !== action.payload.deletePhotoVideoCategory
        );
      })
    // .addCase(deletePhotoVideoCategory.rejected, (state, action) => {
    //   state.isPending = false;
    //   state.error = action.error.message || null;
    // });
  }
});

export const { setPhotoVideoCategories, resetPhotoVideoCategoryBaseState } = PhotoVideoCategorySlice.actions;
export default PhotoVideoCategorySlice.reducer;
