import { gql } from "@apollo/client";

export const CREATE_PHOTO_VIDEO_CATEGORY = gql`
  mutation CreatePhotoVideoCategory($name: String!) {
    createPhotoVideoCategory(name: $name) {
      id
      name
    }
  }
`;

export const UPDATE_PHOTO_VIDEO_CATEGORY = gql`
  mutation UpdatePhotoVideoCategory($id: Int!, $name: String!) {
    updatePhotoVideoCategory(id: $id, name: $name) {
      id
      name
    }
  }
`;

export const DELETE_PHOTO_VIDEO_CATEGORY = gql`
  mutation DeletePhotoVideoCategory($id: Int!) {
    deletePhotoVideoCategory(id: $id)
  }
`;
