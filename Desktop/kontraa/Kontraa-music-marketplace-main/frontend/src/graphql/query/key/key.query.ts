import { gql } from "@apollo/client";

export const FETCH_KEYS = gql`
  query FetchKeys {
    audioKeys {
      id
      name
    }
  }
`;
