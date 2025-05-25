import { apolloClientMutate, apolloClientQuery } from "@/apollo/apolloHelper";
import { DELETE_TRACK_FILE, UPLOAD_TRACK_FILE } from "@/graphql/mutation/trackFile/trackFile.mutation";
import { FETCH_TRACK_FILES } from "@/graphql/query/trackFile/trackFile.query";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: IBaseSliceInitialState & { trackFiles: TrackFile[], isAdding: boolean } = {
  trackFiles: [],
  error: null,
  isPending: false,
  isAdding: false,
}

export const uploadTrackFile = createAsyncThunk(
  "trackFile/uploadTrackFile",
  async ({ file, fileId, name }: { file: File, fileId: string | null, name: string | null }) => {
    return await apolloClientMutate(UPLOAD_TRACK_FILE, { file, fileId, name }, {
      "apollo-require-preflight": "true",
    }, { suppressGlobalError: true });
  }
);

export const fetchTrackFiles = createAsyncThunk(
  "trackFile/fetchTrackFiles",
  async () => {
    return await apolloClientQuery(FETCH_TRACK_FILES, {});
  }
);

export const deleteTrackFile = createAsyncThunk(
  "trackFile/deleteTrackFile",
  async ({ id }: { id: number }) => {
    return await apolloClientMutate(DELETE_TRACK_FILE, { id }, {}, { suppressGlobalError: true });
  }
);

const TrackFileSlice = createSlice({
  name: "trackFile",
  initialState,
  reducers: {
    setTrackFiles(state, action) {
      state.trackFiles = action.payload;
    }
  },
  extraReducers: (builder) => {
    return builder.addCase(uploadTrackFile.pending, (state) => {
      state.isAdding = true;
    }).addCase(uploadTrackFile.fulfilled, (state, action) => {
      state.isAdding = false;
      state.trackFiles = [action.payload.uploadTrackFile, ...state.trackFiles];
    })
      // .addCase(uploadTrackFile.rejected, (state, action) => {
      //   state.isAdding = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(fetchTrackFiles.pending, (state) => {
        state.isPending = true;
      }).addCase(fetchTrackFiles.fulfilled, (state, action) => {
        state.isPending = false;
        state.trackFiles = action.payload.trackFiles;
      })
      // .addCase(fetchTrackFiles.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(deleteTrackFile.pending, (state) => {
        state.isPending = true;
      }).addCase(deleteTrackFile.fulfilled, (state, action) => {
        state.isPending = false;
        state.trackFiles = state.trackFiles.filter((tf) => tf.id !== action.payload.deleteTrackFile);
      })
    // .addCase(deleteTrackFile.rejected, (state, action) => {
    //   state.isPending = false;
    //   state.error = action.error.message || null;
    // });
  }
});

export const { setTrackFiles } = TrackFileSlice.actions;
export default TrackFileSlice.reducer;
