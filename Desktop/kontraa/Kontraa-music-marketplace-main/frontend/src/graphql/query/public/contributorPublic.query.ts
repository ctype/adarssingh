import { gql } from "@apollo/client";

export const TOP_CONTRIBUTORS = gql`
  query TopContributors {
    topContributors {
      username
      firstName
      lastName
      profilePath
      artistStageName
    }
  }
`;
