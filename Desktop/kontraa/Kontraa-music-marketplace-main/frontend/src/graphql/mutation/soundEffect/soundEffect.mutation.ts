import { gql } from "@apollo/client";

export const CREATE_SOUND_EFFECT = gql`
  mutation createSoundEffect($data: SoundEffectFieldInput!) {
    createSoundEffect(data: $data) {
      id
      soundEffectTitle
      size
      genreMix {
        id
        name
      }
      soundEffectMp3File
      soundEffectArtworkFile
      uploadedBy {
        id
        username
      }
      activeStatus
      approveStatus
    }
  }
`;

export const UPDATE_SOUND_EFFECT = gql`
  mutation updateSoundEffect($data: SoundEffectUpdateFieldInput!, $id: Int!) {
    updateSoundEffect(data: $data, id: $id) {
      id
      soundEffectTitle
      size
      genreMix {
        id
        name
      }
      soundEffectMp3File
      soundEffectArtworkFile
      uploadedBy {
        id
        username
      }
      activeStatus
      approveStatus
    }
  }
`;

export const DELETE_SOUND_EFFECT = gql`
  mutation deleteSoundEffect($id: Int!) {
    deleteSoundEffect(id: $id)
  }
`;
