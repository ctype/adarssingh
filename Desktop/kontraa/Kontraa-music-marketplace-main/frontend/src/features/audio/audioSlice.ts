import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  FETCH_AUDIOS,
  FETCH_MY_AUDIOS,
} from "@/graphql/query/audio/audio.query";
import {
  CREATE_AUDIO,
  DELETE_AUDIO,
  UPDATE_AUDIO,
} from "@/graphql/mutation/audio/audio.mutation";
import { apolloClientMutate, apolloClientQuery } from "@/apollo/apolloHelper";

const initialState: IBaseSliceInitialState & {
  audios: Track[];
  myAudios: Track[];
} = {
  audios: [],
  myAudios: [],
  error: null,
  isPending: false,
};

export const fetchAudios = createAsyncThunk(
  "audio/fetchAudio",
  async ({ filter }: { filter: IAudioFilterOptions }) => {
    return await apolloClientQuery(FETCH_AUDIOS, { filter });
  }
);

export const fetchMyAudios = createAsyncThunk(
  "audio/fetchMyAudios",
  async (sortBy: number) => {
    return await apolloClientQuery(FETCH_MY_AUDIOS, { sortBy });
  }
);

export const createAudio = createAsyncThunk(
  "audio/createAudio",
  async (data: TrackCreateUpdateFields) => {
    return await apolloClientMutate(CREATE_AUDIO, { data }, {
      "apollo-require-preflight": "true",
    }, { suppressGlobalError: true });
  }
);

export const updateAudio = createAsyncThunk(
  "audio/updateAudio",
  async ({
    id,
    data,
  }: {
    id: number;
    data: Partial<TrackCreateUpdateFields>;
  }) => {
    return await apolloClientMutate(UPDATE_AUDIO, { id, data }, {
      "apollo-require-preflight": "true",
    }, { suppressGlobalError: true });
  }
);

export const deleteAudio = createAsyncThunk(
  "audio/deleteAudio",
  async (id: number) => {
    return await apolloClientMutate(DELETE_AUDIO, { id });
  }
);

const AudioSlice = createSlice({
  name: "audio",
  initialState,
  reducers: {
    setAudios(state, action) {
      state.audios = action.payload;
    },
    setMyAudios(state, action) {
      state.myAudios = action.payload;
    },
    setAudiosVoteCount(state, action) {
      const like = action.payload.data.like;

      if (!action.payload.data.isLiked) {
        state.audios = state.audios.map((a) => {
          if (a.id === like.entityId) {
            return {
              ...a,
              upVoteCount: a.upVoteCount - 1
            }
          }
          return a;
        })
      } else {
        state.audios = state.audios.map((a) => {
          if (a.id === like.entityId) {
            return {
              ...a,
              upVoteCount: a.upVoteCount + 1
            }
          }
          return a;
        })
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAudios.pending, (state) => {
        state.isPending = true;
      })
      .addCase(fetchAudios.fulfilled, (state, action) => {
        state.isPending = false;
        if (!action.payload) {
          return;
        }
        state.audios = action.payload.audios.map((audio: Track) => ({
          ...audio,
          releaseDate: new Date(audio.releaseDate!).toISOString(),
        }));
      })
      // .addCase(fetchAudios.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(fetchMyAudios.pending, (state) => {
        state.isPending = true;
      })
      .addCase(fetchMyAudios.fulfilled, (state, action) => {
        state.isPending = false;
        state.myAudios = action.payload.myAudios.map((audio: Track) => {
          return {
            ...audio,
            releaseDate: new Date(audio.releaseDate!).toISOString(),
            collaborators: JSON.parse(
              JSON.stringify(audio.collaborators),
              (key, value) => (key === "__typename" ? undefined : value)
            ),
          };
        });
      })
      // .addCase(fetchMyAudios.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(createAudio.fulfilled, (state, action) => {
        state.isPending = false;
        state.myAudios.unshift({ ...action.payload.createAudio, releaseDate: new Date(action.payload.createAudio.releaseDate!).toISOString() });
      })
      // .addCase(createAudio.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(updateAudio.fulfilled, (state, action) => {
        state.isPending = false;
        const index = state.myAudios.findIndex(
          (audio) => audio.id === action.payload.updateAudio.id
        );
        state.myAudios[index] = action.payload.updateAudio;
      })
      // .addCase(updateAudio.rejected, (state, action) => {
      //   state.isPending = false;
      //   state.error = action.error.message || null;
      // })
      .addCase(deleteAudio.pending, (state) => {
        state.isPending = true;
      })
      .addCase(deleteAudio.fulfilled, (state, action) => {
        state.isPending = false;
        state.myAudios = state.myAudios.filter(
          (audio) => audio.id !== action.payload.deleteAudio
        );
        state.audios = state.audios.filter(
          (audio) => audio.id !== action.payload.deleteAudio
        );
      })
    // .addCase(deleteAudio.rejected, (state, action) => {
    //   state.isPending = false;
    //   state.error = action.error.message || null;
    // });
  },
});

export const { setMyAudios, setAudios, setAudiosVoteCount } = AudioSlice.actions;
export default AudioSlice.reducer;
