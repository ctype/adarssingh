import { gql } from "@apollo/client";

export const OVERVIEW_ADMIN = gql`
  query OverviewAdmin {
    adminOverview {
      name
      description
      value
    }
  }
`;

export const OVERVIEW_CONTRIBUTOR = gql`
  query OverviewAdmin {
    contributorOverview {
      name
      description
      value
    }
  }
`;

export const OVERVIEW_USER = gql`
  query OverviewAdmin {
    userOverview {
      name
      description
      value
    }
  }
`;
