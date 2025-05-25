import { apolloClientMutate, apolloClientQuery } from "@/apollo/apolloHelper";
import { CREATE_UPDATE_SOCIAL_ACCOUNT, CREATE_UPDATE_SOCIAL_ACCOUNT_TYPE, DELETE_SOCIAL_ACCOUNT, DELETE_SOCIAL_ACCOUNT_TYPE } from "@/graphql/mutation/socialMedia/socialMedia.mutation";
import { SOCIAL_ACCOUNT_TYPES, SOCIAL_ACCOUNTS } from "@/graphql/query/socialMedia/socialMedia.query";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: IBaseSliceInitialState & {
  socialAccountTypes: SocialAccountType[];
  socialAccounts: UserSocialAccount[];
} = {
  socialAccountTypes: [],
  socialAccounts: [],
  error: null,
  isPending: false,
}

export const fetchSocialAccountTypes = createAsyncThunk(
  "socialMedia/fetchSocialAccountTypes",
  async () => {
    return apolloClientQuery(SOCIAL_ACCOUNT_TYPES, {});
  }
);

export const createUpdateSocialAccountType = createAsyncThunk(
  "socialMedia/createUpdateSocialAccountType",
  async ({ socialAccountTypeName, svgIndex }: { socialAccountTypeName: string, svgIndex: number }) => {
    return apolloClientMutate(CREATE_UPDATE_SOCIAL_ACCOUNT_TYPE, { socialAccountTypeName, svgIndex }, {}, { suppressGlobalError: true });
  }
);

export const removeSocialAccountType = createAsyncThunk(
  "socialMedia/removeSocialAccountType",
  async ({ id }: { id: number }) => {
    return apolloClientMutate(DELETE_SOCIAL_ACCOUNT_TYPE, { id }, {}, { suppressGlobalError: true });
  }
);

// ==========================================================
// Social Accounts
export const fetchSocialAccounts = createAsyncThunk(
  "socialMedia/fetchSocialAccounts",
  async ({ userId }: { userId: number }) => {
    return apolloClientQuery(SOCIAL_ACCOUNTS, { userId });
  }
);

export const createUpdateSocialAccount = createAsyncThunk(
  "socialMedia/createUpdateSocialAccount",
  async ({ data }: { data: { link: string, id: number }[] }) => {
    return apolloClientMutate(CREATE_UPDATE_SOCIAL_ACCOUNT, { data }, {}, { suppressGlobalError: true });
  }
);

export const removeSocialAccount = createAsyncThunk(
  "socialMedia/removeSocialAccount",
  async ({ id }: { id: number }) => {
    return apolloClientMutate(DELETE_SOCIAL_ACCOUNT, { id }, {}, { suppressGlobalError: true });
  }
);

const SocialMediaSlice = createSlice({
  name: "socialMedia",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    return builder
      // fetching social account types
      .addCase(fetchSocialAccountTypes.pending, (state) => {
        state.isPending = true;
      }).addCase(fetchSocialAccountTypes.fulfilled, (state, action) => {
        state.isPending = false;
        state.socialAccountTypes = action.payload.socialAccountTypes;
      })
      // .addCase(fetchSocialAccountTypes.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      // fetching social accounts
      .addCase(fetchSocialAccounts.pending, (state) => {
        state.isPending = true;
      }).addCase(fetchSocialAccounts.fulfilled, (state, action) => {
        state.isPending = false;
        state.socialAccounts = action.payload.socialAccounts;
      })
      // .addCase(fetchSocialAccounts.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      // Add update social Account
      .addCase(createUpdateSocialAccount.pending, (state) => {
        state.isPending = true;
      }).addCase(createUpdateSocialAccount.fulfilled, (state, action) => {
        state.isPending = false;
        const sAccounts: UserSocialAccount[] = action.payload.addUpdateSocialAccount;
        const updatedSocialAccountsIds: number[] = [];
        state.socialAccounts = state.socialAccounts.map((sa) => {
          const changedSA = sAccounts.find((s) => s.id === sa.id);
          if (changedSA) {
            updatedSocialAccountsIds.push(sa.id);
            return changedSA;
          }
          return sa;
        });
        const newSocialAccounts = sAccounts.filter((sA) => !updatedSocialAccountsIds.includes(sA.id))
        state.socialAccounts = [...state.socialAccounts, ...newSocialAccounts];
      })
      // .addCase(createUpdateSocialAccount.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      // Removing social Account
      .addCase(removeSocialAccount.pending, (state) => {
        state.isPending = true;
      }).addCase(removeSocialAccount.fulfilled, (state, action) => {
        state.isPending = false;
        state.socialAccounts = state.socialAccounts.filter((sa) => sa.id !== action.payload.removeSocialAccount);
      })
    // .addCase(removeSocialAccount.rejected, (state, action) => {
    //   state.isPending = false;
    //   state.error = action.error.message || null;
    // })
  }
});


export default SocialMediaSlice.reducer;
