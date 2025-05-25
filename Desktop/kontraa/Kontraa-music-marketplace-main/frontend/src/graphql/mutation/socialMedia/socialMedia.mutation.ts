import { gql } from "@apollo/client";

export const CREATE_UPDATE_SOCIAL_ACCOUNT_TYPE = gql`
  mutation CreateUpdateSocialAccountType($socialAccountTypeName: String!, $svgIndex: Int!) {
    addUpdateSocialAccountType(socialAccountTypeName: $socialAccountTypeName, svgIndex: $svgIndex) {
      id
      socialAccountTypeName
      svgIndex
    }
  }
`;

export const DELETE_SOCIAL_ACCOUNT_TYPE = gql`
  mutation DeleteSocialAccountType($id: Int!) {
    removeSocialAccountType(id: $id)
  }
`;

// SOCIAL ACCOUNTS

export const CREATE_UPDATE_SOCIAL_ACCOUNT = gql`
  mutation CreateUpdateSocialAccount($data: [SocialAccountField!]!) {
    addUpdateSocialAccount(data: $data) {
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

export const DELETE_SOCIAL_ACCOUNT = gql`
  mutation DeleteSocialAccount($id: Int!) {
    removeSocialAccount(id: $id)
  }
`;
