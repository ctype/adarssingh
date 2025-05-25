import { gql } from "@apollo/client";

export const FETCH_GENRES = gql`
  query FetchGenres {
    genres {
      id
      name
      genreArtwork
    }
  }
`;
