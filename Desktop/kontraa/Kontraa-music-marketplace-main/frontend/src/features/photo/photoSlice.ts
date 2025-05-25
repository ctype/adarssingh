import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { apolloClientMutate, apolloClientQuery } from "@/apollo/apolloHelper";
import { FETCH_MY_PHOTOS, FETCH_PHOTOS } from "@/graphql/query/photo/photo.query";
import { CREATE_PHOTO, DELETE_PHOTO, UPDATE_PHOTO } from "@/graphql/mutation/photo/photo.mutation";

const initialState: IBaseSliceInitialState & {
  photos: Photo[],
  myPhotos: Photo[],
} = {
  photos: [],
  myPhotos: [],
  error: null,
  isPending: false,
}

export const fetchPhotos = createAsyncThunk(
  "photos/fetchPhotos",
  async ({ order, sortBy, category }: { order: number, sortBy: string, category: number | null }) => {
    return await apolloClientQuery(FETCH_PHOTOS, { sortBy, category, order });
  }
);

export const fetchMyPhotos = createAsyncThunk(
  "photos/fetchMyPhotos",
  async (sortBy: number) => {
    return await apolloClientQuery(FETCH_MY_PHOTOS, { sortBy });
  }
);

export const createPhoto = createAsyncThunk(
  "photos/createPhoto",
  async (data: { photoTitle: string, photoVideoCategory: number, photoFile: Blob }) => {
    return await apolloClientMutate(CREATE_PHOTO, { data }, {
      "apollo-require-preflight": "true",
    }, { suppressGlobalError: true });
  }
);

export const updatePhoto = createAsyncThunk(
  "photos/updatePhoto",
  async (data: { photoTitle?: string, photoVideoCategory?: number, photoFile?: Blob, id: number }) => {
    // TODO: handle sending of update data more efficiently
    const toSendData: Partial<typeof data> = { ...data };
    if (!data.photoFile) {
      delete toSendData.photoFile;
    }
    if (!data.photoVideoCategory) {
      delete toSendData.photoVideoCategory;
    }
    if (!data.photoTitle) {
      delete toSendData.photoTitle;
    }
    const photoId = data.id;
    delete toSendData.id;

    return await apolloClientMutate(UPDATE_PHOTO, { data: toSendData, id: photoId }, {
      "apollo-require-preflight": "true",
    }, { suppressGlobalError: true });
  }
);

export const deletePhoto = createAsyncThunk(
  "vidoes/deletePhoto",
  async (id: number) => {
    return await apolloClientMutate(DELETE_PHOTO, { id });
  }
);

const PhotoSlice = createSlice({
  name: "photos",
  initialState,
  reducers: {
    setPhotos(state, action) {
      state.photos = action.payload;
    },
    setPhotosVoteCount(state, action) {
      const like = action.payload.data.like;

      if (!action.payload.data.isLiked) {
        state.photos = state.photos.map((photo) => {
          if (photo.id === like.entityId) {
            return {
              ...photo,
              upVoteCount: photo.upVoteCount - 1
            }
          }
          return photo;
        })
      } else {
        state.photos = state.photos.map((photo) => {
          if (photo.id === like.entityId) {
            return {
              ...photo,
              upVoteCount: photo.upVoteCount + 1
            }
          }
          return photo;
        })
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPhotos.pending, (state) => {
        state.isPending = true;
      })
      .addCase(fetchPhotos.fulfilled, (state, action) => {
        state.isPending = false;
        state.photos = action.payload.photos;
      })
      // .addCase(fetchPhotos.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(fetchMyPhotos.pending, (state) => {
        state.isPending = true;
      })
      .addCase(fetchMyPhotos.fulfilled, (state, action) => {
        state.isPending = false;
        state.myPhotos = action.payload.myPhotos;
      })
      // .addCase(fetchMyPhotos.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(createPhoto.pending, (state) => {
        state.isPending = true;
      })
      .addCase(createPhoto.fulfilled, (state, action) => {
        state.isPending = false;
        state.myPhotos = [action.payload.createPhoto, ...state.myPhotos];
        state.photos = [action.payload.createPhoto, ...state.photos];
      })
      // .addCase(createPhoto.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(updatePhoto.pending, (state) => {
        state.isPending = true;
      })
      .addCase(updatePhoto.fulfilled, (state, action) => {
        state.isPending = false;
        state.myPhotos = state.myPhotos.map((photo) => {
          if (photo.id === action.payload.updatePhoto.id) {
            return action.payload.updatePhoto;
          }
          return photo;
        });
        state.photos = state.photos.map((photo) => {
          if (photo.id === action.payload.updatePhoto.id) {
            return action.payload.updatePhoto;
          }
          return photo;
        });
      })
      // .addCase(updatePhoto.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(deletePhoto.pending, (state) => {
        state.isPending = true;
      })
      .addCase(deletePhoto.fulfilled, (state, action) => {
        state.isPending = false;
        state.myPhotos = state.myPhotos.filter((photo) => photo.id !== action.payload.deletePhoto);
        state.photos = state.photos.filter((photo) => photo.id !== action.payload.deletePhoto);
      })
    // .addCase(deletePhoto.rejected, (state, action) => {
    //   state.isPending = false;
    //   state.error = action.error.message || null;
    // });
  },
});

export const { setPhotos, setPhotosVoteCount } = PhotoSlice.actions;
export default PhotoSlice.reducer;
