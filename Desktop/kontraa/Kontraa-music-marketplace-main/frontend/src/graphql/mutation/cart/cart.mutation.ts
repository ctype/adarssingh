import { gql } from "@apollo/client";


export const ADD_TO_CART = gql`
  mutation addToCart($fileId: Int!, $licenseId: Int!) {
    addToCart(fileId: $fileId, licenseId: $licenseId) {
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

export const REMOVE_FROM_CART = gql`
  mutation removeFromCart($id: Int!) {
    removeFromCart(id: $id)
  }
`;
