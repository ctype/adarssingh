import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { apolloClientMutate } from "@/apollo/apolloHelper";
import { COLLABORATORS_OPERATION } from "@/graphql/mutation/collaborator/collaborator.mutation";

const initialState: IBaseSliceInitialState & {
  collaborators: Collaborator[];
  audioId: number | null;
} = {
  collaborators: [],
  audioId: null,
  error: null,
  isPending: false,
}

export const collaboratorOperation = createAsyncThunk(
  "collaborator/collaboratorOperation",
  async ({ data, type }: { data: CollaboratorCreateUpdateFields[], type: string }) => {
    return await apolloClientMutate(COLLABORATORS_OPERATION, { data, type }, {
      "apollo-require-preflight": "true",
    }, { suppressGlobalError: true });
  }
);

const CollaboratorSlice = createSlice({
  name: "collaborator",
  initialState,
  reducers: {
    setCollaborators(state, action) {
      state.collaborators = action.payload;
    },
    setAudioId(state, action) {
      state.audioId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(collaboratorOperation.pending, (state) => {
        state.isPending = true;
      })
      .addCase(collaboratorOperation.fulfilled, (state, action) => {
        state.isPending = false;
        state.collaborators.push(action.payload.createCollaborator);
      })
    // .addCase(collaboratorOperation.rejected, (state, action) => {
    //   state.isPending = false;
    //   state.error = action.error.message || null;
    // });
  }
});

export const { setCollaborators, setAudioId } = CollaboratorSlice.actions;
export default CollaboratorSlice.reducer;
