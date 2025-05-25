import { gql } from "@apollo/client";

export const CREATE_PHOTO = gql`
  mutation createPhoto($data: PhotoFieldInput!) {
    createPhoto(data: $data) {
      id
      photoTitle
      photoFile
      photoVideoCategory {
        id
        name
      }
    }
  }
`;

export const UPDATE_PHOTO = gql`
  mutation updatePhoto($data: PhotoUpdateFieldInput!, $id: Int!) {
    updatePhoto(data: $data, id: $id) {
      id
      photoTitle
      photoFile
      photoVideoCategory {
        id
        name
      }
    }
  }
`;

export const DELETE_PHOTO = gql`
  mutation deletePhoto($id: Int!) {
    deletePhoto(id: $id)
  }
`;
