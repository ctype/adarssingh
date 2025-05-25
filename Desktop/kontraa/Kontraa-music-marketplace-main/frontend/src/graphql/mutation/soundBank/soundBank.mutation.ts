import { gql } from "@apollo/client";

export const CREATE_SOUND_BANK = gql`
  mutation CreateSoundBank($data: SoundBankFieldInput!) {
    createSoundBank(data: $data) {
      id
      title
      artworkFile
      trackStreamFile
      description
      mp3Files
      status
      visibility
      tags
      numberOfFiles
      isDraft
      fileIds {
        id
        fileName
        size
      }
      genreMix {
        id
        name
      }
      uploadedBy {
        id
        username
      }
    }
  }
`;

export const UPDATE_SOUND_BANK = gql`
  mutation UpdateSoundBank($id: Int!, $data: SoundBankUpdateFieldInput!) {
    updateSoundBank(id: $id, data: $data) {
      id
      title
      artworkFile
      trackStreamFile
      description
      mp3Files
      status
      visibility
      tags
      numberOfFiles
      isDraft
      fileIds {
        id
        fileName
        size
      }
      genreMix {
        id
        name
      }
      uploadedBy {
        id
        username
      }
    }
  }
`;

export const DELETE_SOUND_BANK = gql`
  mutation DeleteSoundBank($id: Int!) {
    deleteSoundBank(id: $id)
  }
`;
