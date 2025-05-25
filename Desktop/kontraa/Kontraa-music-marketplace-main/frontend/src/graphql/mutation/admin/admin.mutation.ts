import { gql } from "@apollo/client";

export const UPDATE_USER_ACTIVE_STATUS = gql`
  mutation updateUserActiveStatus($id: Int!, $active: Boolean!) {
    updateUserActiveStatus(id: $id, active: $active) {
      id
      firstName
      lastName
      email
      professionalEmail
      mobileNumber
      biography
      username
      artistStageName
      country
      contentType
      genreType
      experienceLevel
      role
      portfolioLink
      createdAt
    }
  }
`;

export const ACCEPT_REJECT_CONTRIBUTOR_REQUEST = gql`
  mutation AcceptRejectContributorRequest($id: Int!, $status: Boolean!, $rejectData: [String!]!) {
    acceptRejectContributorRequest(id: $id, status: $status, rejectData: $rejectData) {
      id
      firstName
      lastName
      email
      professionalEmail
      mobileNumber
      biography
      username
      artistStageName
      country
      contentType
      genreType
      experienceLevel
      role
      portfolioLink
      createdAt
    }
  }
`;

export const ACCEPT_REJECT_TRACK_REQUEST = gql`
  mutation acceptRejectTrackRequest($id: Int!, $status: Int!, $rejectData: [String!]!, $type: String!) {
    acceptRejectTrackRequest(id: $id, status: $status, rejectData: $rejectData, type: $type)
  }
`;
