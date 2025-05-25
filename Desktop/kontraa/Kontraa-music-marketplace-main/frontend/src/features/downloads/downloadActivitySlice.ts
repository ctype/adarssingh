import { apolloClientQuery } from "@/apollo/apolloHelper";
import { MY_DOWNLOADS } from "@/graphql/query/downloads/downloads.query";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: IBaseSliceInitialState & {
  downloads: UserDownload[];
} = {
  downloads: [],
  error: null,
  isPending: false,
}

export const fetchMyDownloads = createAsyncThunk(
  "DownloadActivity/fetchMyDownloads",
  async () => {
    return apolloClientQuery(MY_DOWNLOADS, {});
  }
)

const DownloadActivitySlice = createSlice({
  name: "DownloadActivity",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    return builder.addCase(fetchMyDownloads.pending, (state) => {
      state.isPending = true;
    }).addCase(fetchMyDownloads.fulfilled, (state, action) => {
      state.isPending = false;
      state.downloads = action.payload.myDownloads;
    })
    // .addCase(fetchMyDownloads.rejected, (state, action) => {
    //   state.isPending = false;
    //   state.error = action.error.message || null;
    // });
  }
});

export default DownloadActivitySlice.reducer;
