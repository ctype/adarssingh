import { gql } from "@apollo/client";

export const CONTRIBUTOR_REGISTRATION = gql`
  mutation ContributionRegistration($data: ContributorFieldInput!) {
    contributorRegistration(data: $data) {
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
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation updateProfile($data: UserUpdateFieldInput!) {
    updateProfile(data: $data) {
      id
      firstName
      lastName
      username
      email
      mobileNumber
      biography
      profilePath
    }
  }
`;

export const SUBSCRIBE_TO_PACKAGE = gql`
  mutation SubscribeToPackage($packageId: Int!) {
    subscribeToPackage(packageId: $packageId) {
      id
      email
      firstName
      lastName
      username
      mobileNumber
      biography
      profilePath
      # accesses {
      #   id
      #   type
      # }
      userProPackage {
        id
        name
      }
    }
  }
`;

export const CREATE_UPDATE_PREFERENCES = gql`
  mutation CreateUpdatePreferences($data: [UserPreferenceFieldInput!]!) {
    addUpdatePreference(data: $data) {
      id
      value
      name
    }
  }
`;
