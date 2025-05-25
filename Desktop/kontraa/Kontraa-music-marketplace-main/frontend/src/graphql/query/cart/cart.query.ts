import { gql } from "@apollo/client";

export const FETCH_MY_CARTS = gql`
  query fetchMyCarts($userId: Int!) {
    myCarts(userId: $userId) {
      id
      fileId
      title
      artWorkFilePath
      price
      description
      licenseId
    }
  }
`;
