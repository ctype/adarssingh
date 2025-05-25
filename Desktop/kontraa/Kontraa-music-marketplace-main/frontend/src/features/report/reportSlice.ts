import { apolloClientMutate, apolloClientQuery } from "@/apollo/apolloHelper";
import { CREATE_REPORT, UPDATE_REPORT } from "@/graphql/mutation/report/report.mutation";
import { FETCH_MY_REPORTS, FETCH_REPORTS } from "@/graphql/query/report/report.query";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: IBaseSliceInitialState & {
  reports: ReportEntity[];
  myReports: ReportEntity[];
} = {
  reports: [],
  myReports: [],
  error: null,
  isPending: false,
}

export const fetchReports = createAsyncThunk(
  "report/fetchReports",
  async ({ status }: { status: string }) => {
    return await apolloClientQuery(FETCH_REPORTS, { status });
  }
)

export const fetchMyReports = createAsyncThunk(
  "report/fetchMyReports",
  async ({ status }: { status: string }) => {
    return await apolloClientQuery(FETCH_MY_REPORTS, { status });
  }
)

export const createReport = createAsyncThunk(
  "report/createReport",
  async ({ data }: { data: ReportFormFields }) => {
    return await apolloClientMutate(CREATE_REPORT, { data }, {}, { suppressGlobalError: true });
  }
)

export const updateReport = createAsyncThunk(
  "report/updateReport",
  async ({ data, id }: { data: ReportFormFields, id: number }) => {
    return await apolloClientMutate(UPDATE_REPORT, { data, id }, {}, { suppressGlobalError: true });
  }
)

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    return builder
      .addCase(fetchReports.pending, (state) => {
        state.isPending = true;
      }).addCase(fetchReports.fulfilled, (state, action) => {
        state.isPending = false;
        state.reports = action.payload.fetchReports;
      })
      // .addCase(fetchReports.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      // my reports
      .addCase(fetchMyReports.pending, (state) => {
        state.isPending = true;
      }).addCase(fetchMyReports.fulfilled, (state, action) => {
        state.isPending = false;
        state.myReports = action.payload.fetchMyReports;
      })
      // .addCase(fetchMyReports.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      // create reports
      .addCase(createReport.pending, (state) => {
        state.isPending = true;
      }).addCase(createReport.fulfilled, (state, action) => {
        state.isPending = false;
        state.reports.push(action.payload.createReport);
      })
      // .addCase(createReport.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      // update reports
      .addCase(updateReport.pending, (state) => {
        state.isPending = true;
      }).addCase(updateReport.fulfilled, (state, action) => {
        state.isPending = false;
        const updatedReport = action.payload.updateReport as ReportEntity;
        state.reports = state.reports.map((r) => {
          if (r.id === updatedReport.id) {
            return updatedReport;
          }
          return r;
        })
      })
    // .addCase(updateReport.rejected, (state, action) => {
    //   state.isPending = false;
    //   state.error = action.error.message || null;
    // });
  }
});

// export const {} = reportSlice.actions;
export default reportSlice.reducer;
