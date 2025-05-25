import { gql } from "@apollo/client";

export const FETCH_USERS = gql`
  query FetchUsers($sortBy: Int!) {
    users(sortBy: $sortBy) {
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

export const FETCH_CONTRIBUTORS = gql`
  query FetchContributors($sortBy: Int!) {
    contributors(sortBy: $sortBy) {
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
