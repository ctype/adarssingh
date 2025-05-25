import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { MY_PREFERENCES, PROFILE } from "@/graphql/query/user/user.query";
import { apolloClientMutate, apolloClientQuery } from "@/apollo/apolloHelper";
import { CONTRIBUTOR_REGISTRATION, CREATE_UPDATE_PREFERENCES, SUBSCRIBE_TO_PACKAGE, UPDATE_PROFILE } from "@/graphql/mutation/system_user/systemuser.mutation";
import { OVERVIEW_CONTRIBUTOR, OVERVIEW_USER } from "@/graphql/query/dashboard/dashboard.query";

const initialState: IBaseSliceInitialState & {
  user: BaseUser | null;
  myProfile: BaseUser | null;
  myPreferences: Preference[];
  overview: Overview[];
} = {
  user: null,
  myProfile: null,
  myPreferences: [],
  overview: [],
  isPending: false,
  error: null,
}

export const fetchContributorOverview = createAsyncThunk(
  "admin/fetchContributorOverview",
  async () => {
    return await apolloClientQuery(OVERVIEW_CONTRIBUTOR, {});
  }
);

export const fetchUserOverview = createAsyncThunk(
  "admin/fetchUserOverview",
  async () => {
    return await apolloClientQuery(OVERVIEW_USER, {});
  }
);

export const contributorRegistration = createAsyncThunk(
  "systemUser/contributorRegistration",
  async (data: ExtraContributorFields) => {
    return await apolloClientMutate(CONTRIBUTOR_REGISTRATION, { data }, {}, { suppressGlobalError: true });
  }
);

export const profileData = createAsyncThunk(
  "systemUser/profileData",
  async () => {
    return await apolloClientQuery(PROFILE, {});
  }
);

export const updateProfileData = createAsyncThunk(
  "systemUser/updateProfileData",
  async (data: Partial<BaseUser>) => {
    return await apolloClientMutate(UPDATE_PROFILE, { data }, {
      "apollo-require-preflight": "true",
    }, { suppressGlobalError: true });
  }
);

export const subscribeToPackage = createAsyncThunk(
  "systemUser/subscribeToPackage",
  async (id: number) => {
    return await apolloClientMutate(SUBSCRIBE_TO_PACKAGE, { packageId: id }, {}, { suppressGlobalError: true });
  }
);

// Preferences
export const fetchMyPreferences = createAsyncThunk(
  "systemUser/fetchMyPreferences",
  async () => {
    return await apolloClientQuery(MY_PREFERENCES, {});
  }
);

export const createUpdatePreference = createAsyncThunk(
  "systemUser/createUpdatePreference",
  async ({ data }: { data: Partial<Preference>[] }) => {
    return await apolloClientMutate(CREATE_UPDATE_PREFERENCES, { data }, {}, { suppressGlobalError: true })
  }
);

const SystemUserSlice = createSlice({
  name: "systemUser",
  initialState,
  reducers: {
    setSystemUser(state, action) {
      state.user = action.payload;
    },
    setMyProfile(state, action) {
      state.myProfile = action.payload;
    }
  },
  extraReducers: (builder) => {
    return builder.addCase(contributorRegistration.pending, (state) => {
      state.isPending = true;
    }).addCase(contributorRegistration.fulfilled, (state, action) => {
      state.isPending = false;
      state.user = action.payload.contributorRegistration;
    })
      // .addCase(contributorRegistration.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(profileData.fulfilled, (state, action) => {
        state.isPending = false;
        if (action.payload.me) {
          state.myProfile = action.payload.me;
        } else {
          state.myProfile = null;
          // state.error = "Unauthorized";
        }
      })
      // .addCase(profileData.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(updateProfileData.pending, (state) => {
        state.isPending = true;
      }).addCase(updateProfileData.fulfilled, (state, action) => {
        state.isPending = false;
        if (action.payload.updateProfile) {
          state.myProfile = action.payload.updateProfile;
        } else {
          state.myProfile = null;
          // state.error = "Unauthorized";
        }
      })
      // .addCase(updateProfileData.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      // Subscribe to package
      .addCase(subscribeToPackage.pending, (state) => {
        state.isPending = true;
      }).addCase(subscribeToPackage.fulfilled, (state, action) => {
        state.isPending = false;
        if (action.payload.subscribeToPackage) {
          state.myProfile = action.payload.subscribeToPackage;
        } else {
          state.myProfile = null;
          // state.error = "Unauthorized";
        }
      })
      // .addCase(subscribeToPackage.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      // Preferences
      .addCase(fetchMyPreferences.pending, (state) => {
        state.isPending = true;
      }).addCase(fetchMyPreferences.fulfilled, (state, action) => {
        state.isPending = false;
        state.myPreferences = action.payload.myPreferences;
      })
      // .addCase(fetchMyPreferences.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(createUpdatePreference.pending, (state) => {
        state.isPending = true;
      }).addCase(createUpdatePreference.fulfilled, (state, action) => {
        state.isPending = false;
        const preferences: Preference[] = action.payload.addUpdatePreference;
        const updatedPreferencesIds: number[] = [];
        state.myPreferences = state.myPreferences.map((p) => {
          const changedPreference = preferences.find((pref) => pref.id === p.id);
          if (changedPreference) {
            updatedPreferencesIds.push(p.id);
            return changedPreference;
          }
          return p;
        });
        const newPreferences = preferences.filter((pref) => !updatedPreferencesIds.includes(pref.id))
        state.myPreferences = [...state.myPreferences, ...newPreferences];
      })
      // .addCase(createUpdatePreference.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      // overview
      .addCase(fetchContributorOverview.pending, (state) => {
        state.isPending = true;
      }).addCase(fetchContributorOverview.fulfilled, (state, action) => {
        state.isPending = false;
        state.overview = action.payload.contributorOverview;
      })
      // .addCase(fetchContributorOverview.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(fetchUserOverview.pending, (state) => {
        state.isPending = true;
      }).addCase(fetchUserOverview.fulfilled, (state, action) => {
        state.isPending = false;
        state.overview = action.payload.userOverview;
      })
    // .addCase(fetchUserOverview.rejected, (state, action) => {
    //   state.isPending = false;
    //   state.error = action.error.message || null;
    // });
  }
})

export const { setSystemUser, setMyProfile } = SystemUserSlice.actions;
export default SystemUserSlice.reducer;
