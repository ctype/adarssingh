import { gql } from "@apollo/client";

export const CREATE_PRESET_TYPE = gql`
  mutation CreatePresetType($name: String!) {
    createPresetType(name: $name) {
      id
      name
    }
  }
`;

export const UPDATE_PRESET_TYPE = gql`
  mutation UpdatePresetType($id: Int!, $name: String!) {
    updatePresetType(id: $id, name: $name) {
      id
      name
    }
  }
`;

export const DELETE_PRESET_TYPE = gql`
  mutation DeletePresetType($id: Int!) {
    deletePresetType(id: $id)
  }
`;
