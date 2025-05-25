import { gql } from "@apollo/client";

export const CREATE_GENRE_MIX = gql`
  mutation CreateGenreMix($name: String!) {
    createGenreMix(name: $name) {
      id
      name
    }
  }
`;

export const UPDATE_GENRE_MIX = gql`
  mutation UpdateGenreMix($id: Int!, $name: String!) {
    updateGenreMix(id: $id, name: $name) {
      id
      name
    }
  }
`;

export const DELETE_GENRE_MIX = gql`
  mutation DeleteGenreMix($id: Int!) {
    deleteGenreMix(id: $id)
  }
`;
