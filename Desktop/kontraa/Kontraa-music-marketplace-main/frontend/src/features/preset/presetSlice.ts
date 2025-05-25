import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { apolloClientMutate, apolloClientQuery } from "@/apollo/apolloHelper";
import { FETCH_PRESETS, FETCH_MY_PRESETS } from "@/graphql/query/preset/preset.query";
import { CREATE_PRESET, DELETE_PRESET, UPDATE_PRESET } from "@/graphql/mutation/preset/preset.mutation";

const initialState: IBaseSliceInitialState & {
  presets: Preset[];
  myPresets: Preset[];
} = {
  presets: [],
  myPresets: [],
  error: null,
  isPending: false,
}

export const fetchPresets = createAsyncThunk(
  "presets/fetchPreset",
  async ({ filter }: { filter: IPresetFilterOptions }) => {
    return await apolloClientQuery(FETCH_PRESETS, { filter });
  }
);

export const fetchMyPresets = createAsyncThunk(
  "presets/fetchMyPresets",
  async (sortBy: number) => {
    return await apolloClientQuery(FETCH_MY_PRESETS, { sortBy });
  }
);

export const createPreset = createAsyncThunk(
  "presets/createPreset",
  async (data: PresetCreateUpdateFields) => {
    const modifiedData = {
      ...data,
      status: 1,       // Auto-approve
       // Optional: mark as draft
    };

    return await apolloClientMutate(
      CREATE_PRESET,
      { data: modifiedData },
      { "apollo-require-preflight": "true" },
      { suppressGlobalError: true }
    );
  }
);

export const updatePreset = createAsyncThunk(
  "presets/updatePreset",
  async ({
    id,
    data,
  }: {
    id: number;
    data: Partial<PresetCreateUpdateFields>;
  }) => {
    const modifiedData = {
      ...data,
      status: 1,       // Auto-approve on update
         // Optional: keep as draft
    };

    return await apolloClientMutate(
      UPDATE_PRESET,
      { id, data: modifiedData },
      { "apollo-require-preflight": "true" },
      { suppressGlobalError: true }
    );
  }
);


export const deletePreset = createAsyncThunk(
  "presets/deletePreset",
  async (id: number) => {
    return await apolloClientMutate(DELETE_PRESET, { id });
  }
);

const PresetSlice = createSlice({
  name: "presets",
  initialState,
  reducers: {
    setPresets: (state, action) => {
      state.presets = action.payload;
    },
    setMyPresets: (state, action) => {
      state.myPresets = action.payload;
    },
    setPresetsVoteCount(state, action) {
      const like = action.payload.data.like;

      if (!action.payload.data.isLiked) {
        state.presets = state.presets.map((preset) => {
          if (preset.id === like.entityId) {
            return {
              ...preset,
              upVoteCount: preset.upVoteCount - 1
            }
          }
          return preset;
        })
      } else {
        state.presets = state.presets.map((preset) => {
          if (preset.id === like.entityId) {
            return {
              ...preset,
              upVoteCount: preset.upVoteCount + 1
            }
          }
          return preset;
        })
      }
    },
  },
  extraReducers: (builder) => {
    return builder
      .addCase(fetchPresets.pending, (state) => {
        state.isPending = true;
      })
      .addCase(fetchPresets.fulfilled, (state, action) => {
        state.isPending = false;
        state.presets = action.payload.presets.map((preset: Preset) => ({
          ...preset,
        }));
      })
      // .addCase(fetchPresets.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(fetchMyPresets.pending, (state) => {
        state.isPending = true;
      })
      .addCase(fetchMyPresets.fulfilled, (state, action) => {
        state.isPending = false;
        if (action.payload.error || !action.payload) {
          return;
        }
        state.myPresets = action.payload.myPresets.map((preset: Preset) => {
          return {
            ...preset,
            collaborators: JSON.parse(
              JSON.stringify(preset.collaborators),
              (key, value) => (key === "__typename" ? undefined : value)
            ),
          };
        });
      })
      // .addCase(fetchMyPresets.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(createPreset.fulfilled, (state, action) => {
        state.isPending = false;
        state.myPresets = [{ ...action.payload.createPreset }, ...state.myPresets];
        // TODO: Add new preset to presets if published
      })
      // .addCase(createPreset.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(updatePreset.fulfilled, (state, action) => {
        state.isPending = false;
        const index = state.presets.findIndex(
          (preset) => preset.id === action.payload.updatePreset.id
        );
        state.myPresets[index] = action.payload.updatePreset;
      })
      // .addCase(updatePreset.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(deletePreset.pending, (state) => {
        state.isPending = true;
      })
      .addCase(deletePreset.fulfilled, (state, action) => {
        state.isPending = false;
        state.myPresets = state.myPresets.filter(
          (preset) => preset.id !== action.payload.deletePreset
        );
        state.presets = state.presets.filter(
          (preset) => preset.id !== action.payload.deletePreset
        );
      })
    // .addCase(deletePreset.rejected, (state, action) => {
    //   state.isPending = false;
    //   state.error = action.error.message || null;
    // });
  }
});

export const { setMyPresets, setPresets, setPresetsVoteCount } = PresetSlice.actions;
export default PresetSlice.reducer;
