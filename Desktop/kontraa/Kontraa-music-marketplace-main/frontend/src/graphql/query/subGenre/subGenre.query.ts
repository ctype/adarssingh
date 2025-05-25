import { gql } from "@apollo/client";

export const FETCH_SUBGENRES = gql`
  query fetchSubGenres {
    subGenres {
      id
      name
      genreId {
        id
        name
      }
    }
  }
`;
