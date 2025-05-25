import { gql } from "@apollo/client";

export const FETCH_MOODTYPES = gql`
  query FetchMoodTypes {
    moodTypes {
      id
      name
    }
  }
`;
