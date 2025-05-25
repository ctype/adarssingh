import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { apolloClientMutate, apolloClientQuery } from "@/apollo/apolloHelper";
import { FETCH_MY_VIDEOS, FETCH_VIDEOS } from "@/graphql/query/video/video.query";
import { CREATE_VIDEO, DELETE_VIDEO, UPDATE_VIDEO } from "@/graphql/mutation/video/video.mutation";

const initialState: IBaseSliceInitialState & {
  videos: Video[],
  myVideos: Video[],
} = {
  videos: [],
  myVideos: [],
  error: null,
  isPending: false,
}

export const fetchVideos = createAsyncThunk(
  "videos/fetchVideos",
  async ({ order, sortBy, category }: { order: number, sortBy: string, category: number | null }) => {
    return await apolloClientQuery(FETCH_VIDEOS, { sortBy, category, order });
  }
);

export const fetchMyVideos = createAsyncThunk(
  "videos/fetchMyVideos",
  async (sortBy: number) => {
    return await apolloClientQuery(FETCH_MY_VIDEOS, { sortBy });
  }
);

export const createVideo = createAsyncThunk(
  "videos/createVideo",
  async (data: { videoTitle: string, photoVideoCategory: number, videoFile: Blob }) => {
    return await apolloClientMutate(CREATE_VIDEO, { data }, {
      "apollo-require-preflight": "true",
    }, { suppressGlobalError: true });
  }
);

export const updateVideo = createAsyncThunk(
  "videos/updateVideo",
  async (data: { videoTitle?: string, photoVideoCategory?: number, videoFile?: Blob, id: number }) => {
    // TODO: handle sending of update data more efficiently
    const toSendData: Partial<typeof data> = { ...data };
    if (!data.videoFile) {
      delete toSendData.videoFile;
    }
    if (!data.photoVideoCategory) {
      delete toSendData.photoVideoCategory;
    }
    if (!data.videoTitle) {
      delete toSendData.videoTitle;
    }
    const videoId = data.id;
    delete toSendData.id;

    return await apolloClientMutate(UPDATE_VIDEO, { data: toSendData, id: videoId }, {
      "apollo-require-preflight": "true",
    }, { suppressGlobalError: true });
  }
);

export const deleteVideo = createAsyncThunk(
  "vidoes/deleteVideo",
  async (id: number) => {
    return await apolloClientMutate(DELETE_VIDEO, { id });
  }
);

const VideoSlice = createSlice({
  name: "videos",
  initialState,
  reducers: {
    setVideos(state, action) {
      state.videos = action.payload;
    },
    setVideosVoteCount(state, action) {
      const like = action.payload.data.like;

      if (!action.payload.data.isLiked) {
        state.videos = state.videos.map((video) => {
          if (video.id === like.entityId) {
            return {
              ...video,
              upVoteCount: video.upVoteCount - 1
            }
          }
          return video;
        })
      } else {
        state.videos = state.videos.map((video) => {
          if (video.id === like.entityId) {
            return {
              ...video,
              upVoteCount: video.upVoteCount + 1
            }
          }
          return video;
        })
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchVideos.pending, (state) => {
        state.isPending = true;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.isPending = false;
        state.videos = action.payload.videos;
      })
      // .addCase(fetchVideos.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(fetchMyVideos.pending, (state) => {
        state.isPending = true;
      })
      .addCase(fetchMyVideos.fulfilled, (state, action) => {
        state.isPending = false;
        state.myVideos = action.payload.myVideos;
      })
      // .addCase(fetchMyVideos.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(createVideo.pending, (state) => {
        state.isPending = true;
      })
      .addCase(createVideo.fulfilled, (state, action) => {
        state.isPending = false;
        state.myVideos = [...state.myVideos, action.payload.createVideo];
        state.videos = [...state.videos, action.payload.createVideo];
      })
      // .addCase(createVideo.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(updateVideo.pending, (state) => {
        state.isPending = true;
      })
      .addCase(updateVideo.fulfilled, (state, action) => {
        state.isPending = false;
        state.myVideos = state.myVideos.map((video) => {
          if (video.id === action.payload.updateVideo.id) {
            return action.payload.updateVideo;
          }
          return video;
        });
        state.videos = state.videos.map((video) => {
          if (video.id === action.payload.updateVideo.id) {
            return action.payload.updateVideo;
          }
          return video;
        });
      })
      // .addCase(updateVideo.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(deleteVideo.pending, (state) => {
        state.isPending = true;
      })
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.isPending = false;
        state.myVideos = state.myVideos.filter((video) => video.id !== action.payload.deleteVideo);
        state.videos = state.videos.filter((video) => video.id !== action.payload.deleteVideo);
      })
    // .addCase(deleteVideo.rejected, (state, action) => {
    //   state.isPending = false;
    //   state.error = action.error.message || null;
    // });
  },
});

export const { setVideos, setVideosVoteCount } = VideoSlice.actions;
export default VideoSlice.reducer;
