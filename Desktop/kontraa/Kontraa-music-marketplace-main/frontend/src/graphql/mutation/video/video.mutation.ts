import { gql } from "@apollo/client";

export const CREATE_VIDEO = gql`
  mutation createVideo($data: VideoFieldInput!) {
    createVideo(data: $data) {
      id
      videoTitle
      videoFile
      photoVideoCategory {
        id
        name
      }
    }
  }
`;

export const UPDATE_VIDEO = gql`
  mutation updateVideo($data: VideoUpdateFieldInput!, $id: Int!) {
    updateVideo(data: $data, id: $id) {
      id
      videoTitle
      videoFile
      photoVideoCategory {
        id
        name
      }
    }
  }
`;

export const DELETE_VIDEO = gql`
  mutation deleteVideo($id: Int!) {
    deleteVideo(id: $id)
  }
`;
