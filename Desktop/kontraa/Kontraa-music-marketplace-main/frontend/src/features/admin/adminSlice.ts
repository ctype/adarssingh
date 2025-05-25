// BELOW CODE AUTO ACCEPTS ALL USERS AS COLLABRATORS 
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { apolloClientMutate, apolloClientQuery } from "@/apollo/apolloHelper";
import { FETCH_CONTRIBUTORS, FETCH_USERS } from "@/graphql/query/admin/admin.query";
import { ACCEPT_REJECT_CONTRIBUTOR_REQUEST, ACCEPT_REJECT_TRACK_REQUEST, UPDATE_USER_ACTIVE_STATUS } from "@/graphql/mutation/admin/admin.mutation";
import { OVERVIEW_ADMIN } from "@/graphql/query/dashboard/dashboard.query";

const initialState: IBaseSliceInitialState & {
  users: User[];
  contributors: Contributor[];
  overview: Overview[];
} = {
  users: [],
  contributors: [],
  overview: [],
  error: null,
  isPending: false,
}

export const fetchOverview = createAsyncThunk(
  "admin/fetchOverview",
  async () => {
    return await apolloClientQuery(OVERVIEW_ADMIN, {});
  }
);

export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (sortBy: number) => {
    return await apolloClientQuery(FETCH_USERS, { sortBy });
  }
);

export const fetchContributors = createAsyncThunk(
  "admin/fetchContributors",
  async (sortBy: number) => {
    return await apolloClientQuery(FETCH_CONTRIBUTORS, { sortBy });
  }
);

export const updateUserActiveStatus = createAsyncThunk(
  "admin/updateUserActiveStatus",
  async ({ id, active }: { id: number, active: boolean }) => {
    return await apolloClientMutate(UPDATE_USER_ACTIVE_STATUS, { id, active }, {}, { suppressGlobalError: true });
  }
);

export const acceptRejectContributorRequest = createAsyncThunk(
  "admin/acceptRejectContributorRequest",
  async ({ id, status, rejectData }: { id: number, status: boolean, rejectData: string[] }) => {
    return await apolloClientMutate(ACCEPT_REJECT_CONTRIBUTOR_REQUEST, { id, status, rejectData }, {}, { suppressGlobalError: true });
  }
);

export const acceptRejectTrackRequest = createAsyncThunk(
  "admin/acceptRejectTrackRequest",
  async ({ id, status, rejectData, type }: { id: number, status: number, rejectData: string[], type: string }) => {
    return await apolloClientMutate(ACCEPT_REJECT_TRACK_REQUEST, { id, status, rejectData, type }, {}, { suppressGlobalError: true });
  }
);

// NEW thunk to automatically accept contributor application
export const applyAsContributor = createAsyncThunk(
  "admin/applyAsContributor",
  async ({ id }: { id: number }) => {
    // Automatically accept contributor request with status = true and empty rejectData
    return await apolloClientMutate(
      ACCEPT_REJECT_CONTRIBUTOR_REQUEST,
      { id, status: true, rejectData: [] },
      {},
      { suppressGlobalError: true }
    );
  }
);

const AdminSlice = createSlice({
  name: "admins",
  initialState,
  reducers: {
    setUsers(state, action) {
      state.users = action.payload;
    },
    setContributors(state, action) {
      state.contributors = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isPending = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isPending = false;
        state.users = action.payload.users;
      })
      .addCase(fetchContributors.pending, (state) => {
        state.isPending = true;
      })
      .addCase(fetchContributors.fulfilled, (state, action) => {
        state.isPending = false;
        state.contributors = action.payload.contributors;
      })
      .addCase(updateUserActiveStatus.fulfilled, (state, action) => {
        state.isPending = false;
        const index = state.users.findIndex(
          (category) => category.id === action.payload.updateUserActiveStatus.id
        );
        if (index !== -1) {
          state.users[index] = action.payload.updateUserActiveStatus;
        }
      })
      .addCase(acceptRejectContributorRequest.fulfilled, (state, action) => {
        state.isPending = false;
        if (action.payload.acceptRejectContributorRequest) {
          state.users = state.users.filter((c) => c.id !== action.payload.acceptRejectContributorRequest.id);
          state.contributors.push(action.payload.acceptRejectContributorRequest);
        }
      })
      .addCase(applyAsContributor.fulfilled, (state, action) => {
        state.isPending = false;
        if (action.payload.acceptRejectContributorRequest) {
          // Remove user from users and add to contributors automatically
          state.users = state.users.filter((c) => c.id !== action.payload.acceptRejectContributorRequest.id);
          state.contributors.push(action.payload.acceptRejectContributorRequest);
        }
      })
      .addCase(fetchOverview.pending, (state) => {
        state.isPending = true;
      })
      .addCase(fetchOverview.fulfilled, (state, action) => {
        state.isPending = false;
        state.overview = action.payload.adminOverview;
      })
  }
});

export const { setUsers, setContributors } = AdminSlice.actions;
export default AdminSlice.reducer;





//THE BELOW CODE IS THE EXISTING CODE FOR ACCEPT REJECT COLLABRATORS

// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// import { apolloClientMutate, apolloClientQuery } from "@/apollo/apolloHelper";
// import { FETCH_CONTRIBUTORS, FETCH_USERS } from "@/graphql/query/admin/admin.query";
// import { ACCEPT_REJECT_CONTRIBUTOR_REQUEST, ACCEPT_REJECT_TRACK_REQUEST, UPDATE_USER_ACTIVE_STATUS } from "@/graphql/mutation/admin/admin.mutation";
// import { OVERVIEW_ADMIN } from "@/graphql/query/dashboard/dashboard.query";

// const initialState: IBaseSliceInitialState & {
//   users: User[];
//   contributors: Contributor[];
//   overview: Overview[];
// } = {
//   users: [],
//   contributors: [],
//   overview: [],
//   error: null,
//   isPending: false,
// }

// export const fetchOverview = createAsyncThunk(
//   "admin/fetchOverview",
//   async () => {
//     return await apolloClientQuery(OVERVIEW_ADMIN, {});
//   }
// );

// export const fetchUsers = createAsyncThunk(
//   "admin/fetchUsers",
//   async (sortBy: number) => {
//     return await apolloClientQuery(FETCH_USERS, { sortBy });
//   }
// );

// export const fetchContributors = createAsyncThunk(
//   "admin/fetchContributors",
//   async (sortBy: number) => {
//     return await apolloClientQuery(FETCH_CONTRIBUTORS, { sortBy });
//   }
// );

// export const updateUserActiveStatus = createAsyncThunk(
//   "admin/updateUserActiveStatus",
//   async ({ id, active }: { id: number, active: boolean }) => {
//     return await apolloClientMutate(UPDATE_USER_ACTIVE_STATUS, { id, active }, {}, { suppressGlobalError: true });
//   }
// );

// export const acceptRejectContributorRequest = createAsyncThunk(
//   "admin/acceptRejectContributorRequest",
//   async ({ id, status, rejectData }: { id: number, status: boolean, rejectData: string[] }) => {
//     return await apolloClientMutate(ACCEPT_REJECT_CONTRIBUTOR_REQUEST, { id, status, rejectData }, {}, { suppressGlobalError: true });
//   }
// );

// export const acceptRejectTrackRequest = createAsyncThunk(
//   "admin/acceptRejectTrackRequest",
//   async ({ id, status, rejectData, type }: { id: number, status: number, rejectData: string[], type: string }) => {
//     return await apolloClientMutate(ACCEPT_REJECT_TRACK_REQUEST, { id, status, rejectData, type }, {}, { suppressGlobalError: true });
//   }
// );

// const AdminSlice = createSlice({
//   name: "admins",
//   initialState,
//   reducers: {
//     setUsers(state, action) {
//       state.users = action.payload;
//     },
//     setContributors(state, action) {
//       state.contributors = action.payload;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchUsers.pending, (state) => {
//         state.isPending = true;
//       })
//       .addCase(fetchUsers.fulfilled, (state, action) => {
//         state.isPending = false;
//         state.users = action.payload.users;
//       })
//       // .addCase(fetchUsers.rejected, (state, action) => {
//       //   state.isPending = false;
//       //   state.error = action.error.message || null;
//       // })
//       .addCase(fetchContributors.pending, (state) => {
//         state.isPending = true;
//       })
//       .addCase(fetchContributors.fulfilled, (state, action) => {
//         state.isPending = false;
//         state.contributors = action.payload.contributors;
//       })
//       // .addCase(fetchContributors.rejected, (state, action) => {
//       //   state.isPending = false;
//       //   state.error = action.error.message || null;
//       // })
//       .addCase(updateUserActiveStatus.fulfilled, (state, action) => {
//         state.isPending = false;
//         const index = state.users.findIndex(
//           (category) => category.id === action.payload.updateUserActiveStatus.id
//         );
//         state.users[index] = action.payload.updateUserActiveStatus;
//       })
//       // .addCase(updateUserActiveStatus.rejected, (state, action) => {
//       //   state.isPending = false;
//       //   state.error = action.error.message || null;
//       // })
//       .addCase(acceptRejectContributorRequest.fulfilled, (state, action) => {
//         state.isPending = false;
//         if (action.payload.acceptRejectContributorRequest) {
//           state.users = state.users.filter((c) => c.id !== action.payload.acceptRejectContributorRequest.id);
//           state.contributors.push(action.payload.acceptRejectContributorRequest);
//         }
//         //  else {
//         //   state.error = "Failed to accept/reject contributor request";
//         // }
//       })
//       // .addCase(acceptRejectContributorRequest.rejected, (state, action) => {
//       //   state.isPending = false;
//       //   state.error = action.error.message || null;
//       // })
//       // overview
//       .addCase(fetchOverview.pending, (state) => {
//         state.isPending = true;
//       }).addCase(fetchOverview.fulfilled, (state, action) => {
//         state.isPending = false;
//         state.overview = action.payload.adminOverview;
//       })
//     // .addCase(fetchOverview.rejected, (state, action) => {
//     //   state.isPending = false;
//     //   state.error = action.error.message || null;
//     // });
//   }
// });

// export const { setUsers, setContributors } = AdminSlice.actions;
// export default AdminSlice.reducer;
