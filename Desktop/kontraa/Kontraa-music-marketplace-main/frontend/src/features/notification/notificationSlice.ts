import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { FETCH_MY_NOTIFICATIONS } from "@/graphql/query/notification/notification.query";
import { apolloClientMutate, apolloClientQuery } from "@/apollo/apolloHelper";
import { READ_NOTIFICATION } from "@/graphql/mutation/notification/notification.mutation";

const initialState: IBaseSliceInitialState & {
  notifications: NotificationEntity[];
} = {
  notifications: [],
  error: null,
  isPending: false,
}

export const fetchMyNotifications = createAsyncThunk(
  "notification/fetchMyNotifications",
  async ({ userId }: { userId: number }) => {
    return await apolloClientQuery(FETCH_MY_NOTIFICATIONS, { userId });
  }
);

export const readNotification = createAsyncThunk(
  "notification/readNotification",
  async ({ id }: { id: number }) => {
    return await apolloClientMutate(READ_NOTIFICATION, { id }, {}, { suppressGlobalError: true });
  }
);

const NotificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    clearNotifications(state) {
      state.notifications = [];
    },
    setNotifications(state, action) {
      state.notifications = action.payload;
    },
  },
  extraReducers: (builder) => {
    return builder.addCase(fetchMyNotifications.pending, (state) => {
      state.isPending = true;
    }).addCase(fetchMyNotifications.fulfilled, (state, action) => {
      state.isPending = false;
      state.notifications = action.payload.myNotifications;
    })
      // .addCase(fetchMyNotifications.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(readNotification.pending, (state) => {
        state.isPending = true;
      }).addCase(readNotification.fulfilled, (state, action) => {
        state.isPending = false;
        const filteredNotifications = state.notifications.map((c) => {
          if (c.id === action.payload.readNotification) {
            return { ...c, hasBeenRead: true }
          }
          return c;
        })
        state.notifications = filteredNotifications;
      })
    // .addCase(readNotification.rejected, (state, action) => {
    //   state.isPending = false;
    //   state.error = action.error.message || null;
    // });
  }
});

export const { setNotifications, clearNotifications } = NotificationSlice.actions;
export default NotificationSlice.reducer;
