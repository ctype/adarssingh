import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { apolloClientMutate, apolloClientQuery } from "@/apollo/apolloHelper";
import { FETCH_MY_SOUND_EFFECTS, FETCH_SOUND_EFFECTS } from "@/graphql/query/soundEffect/soundEffect.query";
import { CREATE_SOUND_EFFECT, DELETE_SOUND_EFFECT, UPDATE_SOUND_EFFECT } from "@/graphql/mutation/soundEffect/soundEffect.mutation";

const initialState: IBaseSliceInitialState & {
  soundEffects: SoundEffect[],
  mySoundEffects: SoundEffect[],
} = {
  soundEffects: [],
  mySoundEffects: [],
  error: null,
  isPending: false,
}

export const fetchSoundEffects = createAsyncThunk(
  "soundEffect/fetchSoundEffects",
  async ({ filter }: { filter: ISoundEffectFilterOptions }) => {
    return await apolloClientQuery(FETCH_SOUND_EFFECTS, { filter });
  }
);

export const fetchMySoundEffects = createAsyncThunk(
  "soundEffect/fetchMySoundEffects",
  async (sortBy: number) => {
    return await apolloClientQuery(FETCH_MY_SOUND_EFFECTS, { sortBy });
  }
);

export const createSoundEffect = createAsyncThunk(
  "soundEffect/createSoundEffect",
  async (data: SoundEffectCreateUpdateFields) => {
    return await apolloClientMutate(CREATE_SOUND_EFFECT, { data }, {
      "apollo-require-preflight": "true",
    }, { suppressGlobalError: true });
  }
);

export const updateSoundEffect = createAsyncThunk(
  "soundEffect/updateSoundEffect",
  async ({
    id,
    data,
  }: {
    id: number;
    data: Partial<SoundEffectCreateUpdateFields>;
  }) => {
    const toSendData = { ...data };
    if (!data.soundEffectTitle) {
      delete toSendData.soundEffectTitle;
    }
    if (!data.genreMix) {
      delete toSendData.genreMix;
    }
    if (!data.soundEffectArtworkFile) {
      delete toSendData.soundEffectArtworkFile;
    }
    if (!data.soundEffectMp3File) {
      delete toSendData.soundEffectMp3File;
    }

    return await apolloClientMutate(UPDATE_SOUND_EFFECT, { id, data: toSendData }, {
      "apollo-require-preflight": "true",
    }, { suppressGlobalError: true });
  }
);

export const deleteSoundEffect = createAsyncThunk(
  "soundEffect/deleteSoundEffect",
  async (id: number) => {
    return await apolloClientMutate(DELETE_SOUND_EFFECT, { id });
  }
);

const SoundEffectSlice = createSlice({
  name: "soundEffect",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    return builder.addCase(fetchSoundEffects.pending, (state) => {
      state.isPending = true;
    }).addCase(fetchSoundEffects.fulfilled, (state, action) => {
      state.isPending = false;
      state.soundEffects = action.payload.soundEffects;
    })
      // .addCase(fetchSoundEffects.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(fetchMySoundEffects.pending, (state) => {
        state.isPending = true;
      }).addCase(fetchMySoundEffects.fulfilled, (state, action) => {
        state.isPending = false;
        state.mySoundEffects = action.payload.mySoundEffects;
      })
      // .addCase(fetchMySoundEffects.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(createSoundEffect.pending, (state) => {
        state.isPending = true;
      }).addCase(createSoundEffect.fulfilled, (state, action) => {
        state.isPending = false;
        state.mySoundEffects = [...state.mySoundEffects, action.payload.createSoundEffect];
        // TODO: Add new audio to audios if published
      })
      // .addCase(createSoundEffect.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(updateSoundEffect.fulfilled, (state, action) => {
        state.isPending = false;
        const index = state.mySoundEffects.findIndex(
          (audio) => audio.id === action.payload.updateSoundEffect.id
        );
        state.mySoundEffects[index] = action.payload.updateSoundEffect;
      })
      // .addCase(updateSoundEffect.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(deleteSoundEffect.pending, (state) => {
        state.isPending = true;
      }).addCase(deleteSoundEffect.fulfilled, (state, action) => {
        state.isPending = false;
        state.mySoundEffects = state.mySoundEffects.filter(
          (soundEffect) => soundEffect.id !== action.payload.deleteSoundEffect
        );
        state.mySoundEffects = state.mySoundEffects.filter(
          (soundEffect) => soundEffect.id !== action.payload.deleteSoundEffect
        );
      })
    // .addCase(deleteSoundEffect.rejected, (state, action) => {
    //   state.isPending = false;
    //   state.error = action.error.message || null;
    // });
  }
});

// export const {} = SoundEffectSlice.actions;
export default SoundEffectSlice.reducer;
