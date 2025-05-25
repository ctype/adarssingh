import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      refreshToken
      user {
        id
        email
        firstName
        lastName
        username
        mobileNumber
        biography
        profilePath
        likes {
          id
          entityId
          entityName
        }
        role
        userProPackage {
          id
          name
          priceAnnually
          priceMonthly
        }
      }
      error {
        code
        message
      }
    }
  }
`;

export const REGISTER_USER = gql`
  mutation RegisterUser($data: UserAuthFieldInput!) {
    register(data: $data) {
      accessToken
      refreshToken
      user {
        id
        email
        firstName
        lastName
        username
        mobileNumber
        biography
        profilePath
        role
        likes {
          id
          entityId
          entityName
        }
        userProPackage {
          id
          name
          priceMonthly
          priceAnnually
        }
      }
      error {
        code
        message
        errors {
          field
          message
        }
      }
    }
  }
`;

export const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($newPassword: String!, $token: String!) {
    resetPassword(newPassword: $newPassword, token: $token)
  }
`;

export const VERIFY_EMAIL = gql`
  mutation VerifyEmial($email: String!, $token: String!) {
    verifyEmail(email: $email, token: $token)
  }
`;

export const RESEND_VERIFICATION_EMAIL = gql`
  mutation ResendVerificationEmail($email: String!) {
    resendVerificationEmail(email: $email)
  }
`;
