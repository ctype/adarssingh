import { gql } from "@apollo/client";

export const FETCH_TRACK_FILES = gql`
  query fetchTrackFiles {
    trackFiles {
      id
      size
      exclusivePrice
      fileUrl
      fileType
      fileName
      audioId {
        id
      }
      presetId {
        id
      }
      soundBankId {
        id
      }
    }
  }
`;
