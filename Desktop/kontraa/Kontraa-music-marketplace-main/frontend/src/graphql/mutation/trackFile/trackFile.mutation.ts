import { gql } from "@apollo/client";

export const UPLOAD_TRACK_FILE = gql`
  mutation uploadTrackFile($file: Upload!, $fileId: String, $name: String) {
    uploadTrackFile(file: $file, fileId: $fileId, name: $name) {
      id
      size
      exclusivePrice
      fileUrl
      fileType
      fileName
    }
  }
`;

export const DELETE_TRACK_FILE = gql`
  mutation deleteTrackFile($id: Int!) {
    deleteTrackFile(id: $id)
  }
`;
