import { gql } from "@apollo/client";

export const CREATE_SUBGENRE = gql`
  mutation CreatesubGenre($data: SubGenreFieldInput!) {
    createSubGenre(data: $data) {
      id
      name
      genreId {
        id
        name
      }
    }
  }
`;

export const UPDATE_SUBGENRE = gql`
  mutation UpdatesubGenre($id: Int!, $data: SubGenreUpdateFieldInput!) {
    updateSubGenre(id: $id, data: $data) {
      id
      name
      genreId {
        id
        name
      }
    }
  }
`;

export const DELETE_SUBGENRE = gql`
  mutation DeletesubGenre($id: Int!) {
    deleteSubGenre(id: $id)
  }
`;
