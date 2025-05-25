import { gql } from "@apollo/client";

export const FETCH_LANGUAGES = gql`
  query FetchLanguages {
    languages {
      id
      name
    }
  }
`;
