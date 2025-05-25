import { gql } from "@apollo/client";

export const CREATE_GENRE = gql`
  mutation CreateGenre($data: GenreFieldInput!) {
    createGenre(data: $data) {
      id
      name
      genreArtwork
    }
  }
`;

export const UPDATE_GENRE = gql`
  mutation UpdateGenre($id: Int!, $data: GenreUpdateFieldInput!) {
    updateGenre(id: $id, data: $data) {
      id
      name
      genreArtwork
    }
  }
`;

export const DELETE_GENRE = gql`
  mutation DeleteGenre($id: Int!) {
    deleteGenre(id: $id)
  }
`;
