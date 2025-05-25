import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { apolloClientMutate, apolloClientQuery } from "@/apollo/apolloHelper";
import {
  CREATE_LICENSE,
  DELETE_LICENSE,
  SUBMIT_AUDIO,
  UPDATE_LICENSE,
  UPDATE_LICENSE_TO_MUSIC,
  UPDATE_MUSIC_TO_LICENSE,
} from "@/graphql/mutation/license/license.mutation";
import {
  FETCH_LICENSES,
  FETCH_MY_LICENSES,
} from "@/graphql/query/license/license.query";

const initialState: IBaseSliceInitialState & {
  licenses: License[];
  myLicenses: License[];
} = {
  licenses: [],
  myLicenses: [],
  error: null,
  isPending: false,
};

export const fetchLicenses = createAsyncThunk(
  "license/fetchLicenses",
  async (sortBy: number) => {
    return await apolloClientQuery(FETCH_LICENSES, { sortBy });
  }
);

export const fetchMyLicenses = createAsyncThunk(
  "license/fetchMyLicenses",
  async (type: string) => {
    return await apolloClientQuery(FETCH_MY_LICENSES, { type });
  }
);

export const createLicense = createAsyncThunk(
  "license/createLicense",
  async (data: LicenseCreateUpdateFields) => {
    return await apolloClientMutate(CREATE_LICENSE, { data }, {}, { suppressGlobalError: true });
  }
);

export const updateLicense = createAsyncThunk(
  "license/updateLicense",
  async ({
    data,
    id,
  }: {
    id: number;
    data: Partial<LicenseCreateUpdateFields>;
  }) => {
    return await apolloClientMutate(UPDATE_LICENSE, { data, id }, {}, { suppressGlobalError: true });
  }
);

export const deleteLicense = createAsyncThunk(
  "license/deleteLicense",
  async (id: number) => {
    return await apolloClientMutate(DELETE_LICENSE, { id });
  }
);

export const addLicenseToMusic = createAsyncThunk(
  "license/addLicenseToMusic",
  async ({
    licenseIds,
    toAddMusicIds,
    toRemoveMusicIds,
    type,
    toReview,
  }: {
    licenseIds: number[];
    toAddMusicIds: number[];
    toRemoveMusicIds: number[];
    type: string;
    toReview: boolean;
  }) => {
    return await apolloClientMutate(UPDATE_MUSIC_TO_LICENSE, {
      licenseIds,
      toAddMusicIds,
      toRemoveMusicIds,
      type,
      toReview,
    });
  }
);

export const addLicensesToMusic = createAsyncThunk(
  "license/addLicensesToMusic",
  async ({
    licenseIds,
    musicId,
    type,
    toReview,
    exclusivePrices,
  }: {
    licenseIds: number[];
    exclusivePrices: string[];
    musicId: number;
    type: string;
    toReview: boolean;
  }) => {
    return await apolloClientMutate(UPDATE_LICENSE_TO_MUSIC, {
      licenseIds,
      exclusivePrices,
      musicId,
      type,
      toReview,
    });
  }
);

export const submitAudio = createAsyncThunk(
  "license/submitAudio",
  async ({
    musicId,
    type,
    toReview,
  }: {
    musicId: number;
    type: string;
    toReview: boolean;
  }) => {
    // TODO update after payment integration to UPDATE_LICENSE_TO_MUSIC
    return await apolloClientMutate(SUBMIT_AUDIO, {
      musicId,
      type,
      toReview,
    });
  }
);

const LicenseSlice = createSlice({
  name: "license",
  initialState,
  reducers: {
    setLicense: (state, action) => {
      state.licenses = action.payload;
    },
  },
  extraReducers(builder) {
    return builder
      .addCase(fetchLicenses.pending, (state) => {
        state.isPending = true;
      })
      .addCase(fetchLicenses.fulfilled, (state, action) => {
        state.isPending = false;
        state.licenses = action.payload.licenses;
      })
      // .addCase(fetchLicenses.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(fetchMyLicenses.pending, (state) => {
        state.isPending = true;
      })
      .addCase(fetchMyLicenses.fulfilled, (state, action) => {
        state.isPending = false;
        state.myLicenses = action.payload.myLicenses;
      })
      // .addCase(fetchMyLicenses.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(createLicense.pending, (state) => {
        state.isPending = true;
      })
      .addCase(createLicense.fulfilled, (state, action) => {
        state.isPending = false;
        state.myLicenses.push(action.payload.createLicense);
      })
      // .addCase(createLicense.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(updateLicense.pending, (state) => {
        state.isPending = true;
      })
      .addCase(updateLicense.fulfilled, (state, action) => {
        state.isPending = false;
        const updatedLicenses = state.myLicenses.map((lt) => {
          if (lt.id === action.payload.updateLicense.id) {
            return action.payload.updateLicense;
          }
          return lt;
        });
        state.myLicenses = updatedLicenses;
      })
      // .addCase(updateLicense.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(deleteLicense.pending, (state) => {
        state.isPending = true;
      })
      .addCase(deleteLicense.fulfilled, (state, action) => {
        state.isPending = false;
        const updatedLicenses = state.myLicenses.filter((lt) => {
          return lt.id !== action.payload.deleteLicense;
        });
        state.myLicenses = updatedLicenses;
      })
      // .addCase(deleteLicense.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(addLicenseToMusic.pending, (state) => {
        state.isPending = true;
      })
      .addCase(addLicenseToMusic.fulfilled, (state) => {
        state.isPending = false;
        // const updatedLicenses = state.licenses.map((lt) => {
        //   if (lt.id === action.payload.updateLicenseToMusic.id) {
        //     return action.payload.updateLicenseToMusic;
        //   }
        //   return lt;
        // });
        // state.licenses = updatedLicenses;
      })
      .addCase(submitAudio.pending, (state) => {
        state.isPending = true;
      })
      .addCase(submitAudio.fulfilled, (state) => {
        state.isPending = false;
        // const updatedLicenses = state.licenses.map((lt) => {
        //   if (lt.id === action.payload.updateLicenseToMusic.id) {
        //     return action.payload.updateLicenseToMusic;
        //   }
        //   return lt;
        // });
        // state.licenses = updatedLicenses;
      })
    // .addCase(addLicenseToMusic.rejected, (state, action) => {
    //   state.isPending = false;
    //   state.error = action.error.message || null;
    // });
  },
});

export const { setLicense } = LicenseSlice.actions;
export default LicenseSlice.reducer;
