import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { LOGOUT } from "@/graphql/query/auth/auth.query";
import { apolloClientMutate, apolloClientQuery } from "@/apollo/apolloHelper";
import { FORGOT_PASSWORD, LOGIN_USER, REGISTER_USER, RESEND_VERIFICATION_EMAIL, RESET_PASSWORD, VERIFY_EMAIL } from "@/graphql/mutation/auth/auth.mutation";

const initialState: IBaseSliceInitialState & {
  user: BaseUser | null;
} = {
  user: null,
  error: null,
  isPending: true,
};

export const loginWithEmail = createAsyncThunk(
  "auth/loginWithEmail",
  async ({ email, password }: { email: string; password: string }) => {
    return await apolloClientMutate(LOGIN_USER, { email, password });
  }
);

export const registerWithEmail = createAsyncThunk(
  "auth/registerWithEmail",
  async ({
    email,
    password,
    firstName,
    lastName,
    username,
  }: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    username: string;
  }) => {
    return await apolloClientMutate(REGISTER_USER, { data: { email, password, firstName, lastName, username } }, {}, { suppressGlobalError: true });
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async () => {
    return await apolloClientQuery(LOGOUT, {});
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string) => {
    return await apolloClientMutate(FORGOT_PASSWORD, { email }, {}, { suppressGlobalError: true });
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ newPassword, token }: { newPassword: string, token: string }) => {
    return await apolloClientMutate(RESET_PASSWORD, { newPassword, token }, {}, { suppressGlobalError: true });
  }
);

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async ({ email, token }: { email: string, token: string }) => {
    return await apolloClientMutate(VERIFY_EMAIL, { email, token }, {}, { suppressGlobalError: true });
  }
);

export const resendVerificationEmail = createAsyncThunk(
  "auth/resendVerificationEmail",
  async ({ email }: { email: string }) => {
    return await apolloClientMutate(RESEND_VERIFICATION_EMAIL, { email }, {}, { suppressGlobalError: true });
  }
);

export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setPending(state, action) {
      state.isPending = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.isPending = false;
        if (action.payload.login.error) {
          state.error = action.payload.login.error.message;
        } else {
          state.user = action.payload.login.user;
          state.error = null;
        }
      })
      // .addCase(loginWithEmail.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(registerWithEmail.fulfilled, (state, action) => {
        state.isPending = false;
        console.log(action.payload);

        if (action.payload.register.error) {
          state.error = action.payload.register.error.errors[0];
          return;
        }
        state.user = action.payload.register.user;
        state.error = null;
      })
      // .addCase(registerWithEmail.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(logout.pending, (state) => {
        state.isPending = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isPending = false;
        state.user = null;
      })
    // .addCase(logout.rejected, (state, action) => {
    //   state.isPending = false;
    //   state.error = action.error.message || null;
    // });
  },
});

export const { setUser, setPending } = AuthSlice.actions;
export default AuthSlice.reducer;
