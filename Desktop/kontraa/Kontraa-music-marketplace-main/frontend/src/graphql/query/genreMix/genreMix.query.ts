import { gql } from "@apollo/client";

export const FETCH_GENRE_MIXES = gql`
  query FetchGenreMixes {
    genreMixes {
      id
      name
    }
  }
`;
