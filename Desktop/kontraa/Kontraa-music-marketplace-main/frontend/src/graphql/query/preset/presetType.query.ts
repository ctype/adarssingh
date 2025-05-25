import { gql } from "@apollo/client";

export const FETCH_PRESET_TYPES = gql`
  query fetchPresetTypes {
    presetTypes {
      id
      name
    }
  }
`;
