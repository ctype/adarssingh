import { gql } from "@apollo/client";

export const SOCIAL_ACCOUNT_TYPES = gql`
  query SocialAccountTypes {
    socialAccountTypes {
      id
      socialAccountTypeName
      svgIndex
    }
  }
`;

export const SOCIAL_ACCOUNTS = gql`
  query SocialAccounts($userId: Int!) {
    socialAccounts(userId: $userId) {
      id
      socialAccountLink
      userId
      socialAccountType {
        id
        socialAccountTypeName
        svgIndex
      }
    }
  }
`;
