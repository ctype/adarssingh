import { gql } from "@apollo/client";

export const CREATE_PRESET = gql`
  mutation CreatePreset($data: PresetFieldInput!) {
    createPreset(data: $data) {
      id
      title
      artworkFile
      trackStreamFile
      description
      mp3Files
      status
      visibility
      isDraft
      tags
      numberOfFiles
      fileIds {
        id
        fileName
        size
      }
      genreMix {
        id
        name
      }
      presetType {
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

export const UPDATE_PRESET = gql`
  mutation UpdatePreset($id: Int!, $data: PresetUpdateFieldInput!) {
    updatePreset(id: $id, data: $data) {
      id
      title
      artworkFile
      trackStreamFile
      description
      mp3Files
      status
      visibility
      isDraft
      numberOfFiles
      tags
      fileIds {
        id
        fileName
        size
      }
      genreMix {
        id
        name
      }
      presetType {
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

export const DELETE_PRESET = gql`
  mutation DeletePreset($id: Int!) {
    deletePreset(id: $id)
  }
`;
