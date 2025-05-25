import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { apolloClientMutate, apolloClientQuery } from "@/apollo/apolloHelper";
import { FETCH_LICENSE_TEMPLATES } from "@/graphql/query/license/license.query";
import { CREATE_LICENSE_TEMPLATE, DELETE_LICENSE_TEMPLATE, UPDATE_LICENSE_TEMPLATE } from "@/graphql/mutation/license/license.mutation";

const initialState: IBaseSliceInitialState & {
  licenseTemplates: LicenseTemplate[];
} = {
  licenseTemplates: [],
  error: null,
  isPending: false,
}

export const fetchLicenseTemplates = createAsyncThunk(
  "licenseTemplate/fetchLicenseTemplates",
  async (sortBy: number) => {
    return await apolloClientQuery(FETCH_LICENSE_TEMPLATES, { sortBy });
  }
);

export const createLicenseTemplate = createAsyncThunk(
  "licenseTemplate/createLicenseTemplate",
  async (data: LicenseTemplateCreateUpdateFields) => {
    return await apolloClientMutate(CREATE_LICENSE_TEMPLATE, { data }, {}, { suppressGlobalError: true });
  }
);

export const updateLicenseTemplate = createAsyncThunk(
  "licenseTemplate/updateLicenseTemplate",
  async ({ data, id }: { id: number, data: Partial<LicenseTemplateCreateUpdateFields> }) => {
    return await apolloClientMutate(UPDATE_LICENSE_TEMPLATE, { data, id }, {}, { suppressGlobalError: true });
  }
);

export const deleteLicenseTemplate = createAsyncThunk(
  "licenseTemplate/deleteLicenseTemplate",
  async (id: number) => {
    return await apolloClientMutate(DELETE_LICENSE_TEMPLATE, { id });
  }
);

const LicenseTemplateSlice = createSlice({
  name: "licenseTemplate",
  initialState,
  reducers: {
    setLicenseTemplate: (state, action) => {
      state.licenseTemplates = action.payload;
    }
  },
  extraReducers(builder) {
    return builder
      .addCase(fetchLicenseTemplates.pending, (state) => {
        state.isPending = true;
      })
      .addCase(fetchLicenseTemplates.fulfilled, (state, action) => {
        state.isPending = false;
        state.licenseTemplates = action.payload.licenseTemplates;
      })
      // .addCase(fetchLicenseTemplates.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(createLicenseTemplate.pending, (state) => {
        state.isPending = true;
      })
      .addCase(createLicenseTemplate.fulfilled, (state, action) => {
        state.isPending = false;
        state.licenseTemplates = [...state.licenseTemplates, action.payload.createLicenseTemplate];
      })
      // .addCase(createLicenseTemplate.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(updateLicenseTemplate.pending, (state) => {
        state.isPending = true;
      })
      .addCase(updateLicenseTemplate.fulfilled, (state, action) => {
        state.isPending = false;
        const updatedLicenseTemplates = state.licenseTemplates.map((lt) => {
          if (lt.id === action.payload.updateLicenseTemplate.id) {
            return action.payload.updateLicenseTemplate;
          }
          return lt;
        });
        state.licenseTemplates = updatedLicenseTemplates;
      })
      // .addCase(updateLicenseTemplate.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(deleteLicenseTemplate.pending, (state) => {
        state.isPending = true;
      })
      .addCase(deleteLicenseTemplate.fulfilled, (state, action) => {
        state.isPending = false;
        const updatedLicenseTemplates = state.licenseTemplates.filter((lt) => {
          return lt.id !== action.payload.deleteLicenseTemplate
        });
        state.licenseTemplates = updatedLicenseTemplates;
      })
    // .addCase(deleteLicenseTemplate.rejected, (state, action) => {
    //   state.isPending = false;
    //   state.error = action.error.message || null;
    // });
  },
});

export const { setLicenseTemplate } = LicenseTemplateSlice.actions;
export default LicenseTemplateSlice.reducer;
