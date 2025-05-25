import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { apolloClientMutate, apolloClientQuery } from "@/apollo/apolloHelper";
import { FETCH_MY_SOUND_BANKS, FETCH_SOUND_BANKS } from "@/graphql/query/soundBank/soundBank.query";
import { CREATE_SOUND_BANK, DELETE_SOUND_BANK, UPDATE_SOUND_BANK } from "@/graphql/mutation/soundBank/soundBank.mutation";

const initialState: IBaseSliceInitialState & {
  soundBanks: SoundBank[];
  mySoundBanks: SoundBank[];
} = {
  soundBanks: [],
  mySoundBanks: [],
  error: null,
  isPending: false,
}

export const fetchSoundBanks = createAsyncThunk(
  "soundBanks/fetchSoundBank",
  async ({ filter }: { filter: ISoundBankFilterOptions }) => {
    return await apolloClientQuery(FETCH_SOUND_BANKS, { filter });
  }
);

export const fetchMySoundBanks = createAsyncThunk(
  "soundBanks/fetchMySoundBanks",
  async (sortBy: number) => {
    return await apolloClientQuery(FETCH_MY_SOUND_BANKS, { sortBy });
  }
);

export const createSoundBank = createAsyncThunk(
  "soundBanks/createSoundBank",
  async (data: SoundBankCreateUpdateFields) => {
    const modifiedData = {
      ...data,
      status: 1, // Auto-approve every time
      isDraft: false, // Optional: you can set this too
    };

    return await apolloClientMutate(
      CREATE_SOUND_BANK,
      { data: modifiedData },
      { "apollo-require-preflight": "true" },
      { suppressGlobalError: true }
    );
  }
);

export const updateSoundBank = createAsyncThunk(
  "soundBanks/updateSoundBank",
  async ({
    id,
    data,
  }: {
    id: number;
    data: Partial<SoundBankCreateUpdateFields>;
  }) => {
    const modifiedData = {
      ...data,
      status: 1, // Auto-approve on update too
    };

    return await apolloClientMutate(
      UPDATE_SOUND_BANK,
      { id, data: modifiedData },
      { "apollo-require-preflight": "true" },
      { suppressGlobalError: true }
    );
  }
);


export const deleteSoundBank = createAsyncThunk(
  "soundBanks/deleteSoundBank",
  async (id: number) => {
    return await apolloClientMutate(DELETE_SOUND_BANK, { id });
  }
);

const SoundBankSlice = createSlice({
  name: "soundBanks",
  initialState,
  reducers: {
    setSoundBanks: (state, action) => {
      state.soundBanks = action.payload;
    },
    setMySoundBanks: (state, action) => {
      state.mySoundBanks = action.payload;
    },
    setSoundBanksVoteCount(state, action) {
      const like = action.payload.data.like;

      if (!action.payload.data.isLiked) {
        state.soundBanks = state.soundBanks.map((soundBank) => {
          if (soundBank.id === like.entityId) {
            return {
              ...soundBank,
              upVoteCount: soundBank.upVoteCount - 1
            }
          }
          return soundBank;
        })
      } else {
        state.soundBanks = state.soundBanks.map((soundBank) => {
          if (soundBank.id === like.entityId) {
            return {
              ...soundBank,
              upVoteCount: soundBank.upVoteCount + 1
            }
          }
          return soundBank;
        })
      }
    },
  },
  extraReducers: (builder) => {
    return builder
      .addCase(fetchSoundBanks.pending, (state) => {
        state.isPending = true;
      })
      .addCase(fetchSoundBanks.fulfilled, (state, action) => {
        state.isPending = false;
        state.soundBanks = action.payload.soundBanks.map((soundBank: Track) => ({
          ...soundBank,
        }));
      })
      // .addCase(fetchSoundBanks.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(fetchMySoundBanks.pending, (state) => {
        state.isPending = true;
      })
      .addCase(fetchMySoundBanks.fulfilled, (state, action) => {
        state.isPending = false;
        state.mySoundBanks = action.payload.mySoundBanks.map((soundBank: Track) => {
          return {
            ...soundBank,
            collaborators: JSON.parse(
              JSON.stringify(soundBank.collaborators),
              (key, value) => (key === "__typename" ? undefined : value)
            ),
          };
        });
      })
      // .addCase(fetchMySoundBanks.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(createSoundBank.fulfilled, (state, action) => {
        state.isPending = false;
        state.mySoundBanks = [{ ...action.payload.createSoundBank }, ...state.mySoundBanks];
        // TODO: Add new soundBank to soundBanks if published
      })
      // .addCase(createSoundBank.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(updateSoundBank.fulfilled, (state, action) => {
        state.isPending = false;
        const index = state.soundBanks.findIndex(
          (soundBank) => soundBank.id === action.payload.updateSoundBank.id
        );
        state.mySoundBanks[index] = action.payload.updateSoundBank;
      })
      // .addCase(updateSoundBank.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(deleteSoundBank.pending, (state) => {
        state.isPending = true;
      })
      .addCase(deleteSoundBank.fulfilled, (state, action) => {
        state.isPending = false;
        state.mySoundBanks = state.mySoundBanks.filter(
          (soundBank) => soundBank.id !== action.payload.deleteSoundBank
        );
        state.soundBanks = state.soundBanks.filter(
          (soundBank) => soundBank.id !== action.payload.deleteSoundBank
        );
      })
    // .addCase(deleteSoundBank.rejected, (state, action) => {
    //   state.isPending = false;
    //   state.error = action.error.message || null;
    // });
  }
});

export const { setMySoundBanks, setSoundBanks, setSoundBanksVoteCount } = SoundBankSlice.actions;
export default SoundBankSlice.reducer;
