import { gql } from "@apollo/client";

export const CREATE_KEY = gql`
  mutation Createkey($name: String!) {
    createAudioKey(name: $name) {
      id
      name
    }
  }
`;

export const UPDATE_KEY = gql`
  mutation Updatekey($id: Int!, $name: String!) {
    updateAudioKey(id: $id, name: $name) {
      id
      name
    }
  }
`;

export const DELETE_KEY = gql`
  mutation Deletekey($id: Int!) {
    deleteAudioKey(id: $id)
  }
`;
