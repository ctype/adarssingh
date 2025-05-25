import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { apolloClientMutate, apolloClientQuery } from "@/apollo/apolloHelper";
import { FETCH_PRESET_TYPES } from "@/graphql/query/preset/presetType.query";
import { CREATE_PRESET_TYPE, DELETE_PRESET_TYPE, UPDATE_PRESET_TYPE } from "@/graphql/mutation/preset/presetType.mutation";

const initialState: IBaseSliceInitialState & {
  presetTypes: PresetType[];
} = {
  presetTypes: [],
  error: null,
  isPending: false,
}

export const fetchPresetTypes = createAsyncThunk(
  "presetType/fetchPresetTypes",
  async () => {
    return await apolloClientQuery(FETCH_PRESET_TYPES, {});
  }
);

export const createPresetType = createAsyncThunk(
  "presetType/createPresetType",
  async (name: string) => {
    return await apolloClientMutate(CREATE_PRESET_TYPE, { name }, {}, { suppressGlobalError: true });
  }
);

export const updatePresetType = createAsyncThunk(
  "presetType/updatePresetType",
  async ({ id, name }: { id: number, name: string }) => {
    return await apolloClientMutate(UPDATE_PRESET_TYPE, { id, name }, {}, { suppressGlobalError: true });
  }
);

export const deletePresetType = createAsyncThunk(
  "presetType/deletePresetType",
  async (id: number) => {
    return await apolloClientMutate(DELETE_PRESET_TYPE, { id });
  }
);

const PresetTypeSlice = createSlice({
  name: "presetTypes",
  initialState,
  reducers: {
    setPresetTypes(state, action) {
      state.presetTypes = action.payload;
    },
    resetPresetTypeBaseState(state) {
      state.error = null;
      state.isPending = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPresetTypes.pending, (state) => {
        state.isPending = true;
      })
      .addCase(fetchPresetTypes.fulfilled, (state, action) => {
        state.isPending = false;
        state.presetTypes = action.payload.presetTypes;
      })
      // .addCase(fetchPresetTypes.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(createPresetType.fulfilled, (state, action) => {
        state.isPending = false;
        if (action.payload.errors) {
          state.error = action.payload.errors;
          return;
        }
        state.presetTypes.push(action.payload.createPresetType);
      })
      // .addCase(createPresetType.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(updatePresetType.fulfilled, (state, action) => {
        state.isPending = false;
        if (action.payload.errors) {
          state.error = action.payload.errors;
          return;
        }
        const index = state.presetTypes.findIndex(
          (category) => category.id === action.payload.updatePresetType.id
        );
        state.presetTypes[index] = action.payload.updatePresetType;
      })
      // .addCase(updatePresetType.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(deletePresetType.pending, (state) => {
        state.isPending = true;
      })
      .addCase(deletePresetType.fulfilled, (state, action) => {
        state.isPending = false;
        state.presetTypes = state.presetTypes.filter(
          (category) => category.id !== action.payload.deletePresetType
        );
      })
    // .addCase(deletePresetType.rejected, (state, action) => {
    //   state.isPending = false;
    //   state.error = action.error.message || null;
    // });
  }
});

export const { setPresetTypes, resetPresetTypeBaseState } = PresetTypeSlice.actions;
export default PresetTypeSlice.reducer;
