import { gql } from "@apollo/client";

export const CREATE_OFFER = gql`
  mutation CreateOffer($data: OfferInputField!) {
    createOffer(data: $data) {
      id
      name
      type
      timePeriod
      creditAmount
      couponCode
      usabilityPerUser
      discountAmount
      discountType
      subscriptionPackages {
        id
        name
      }
    }
  }
`;

export const UPDATE_OFFER = gql`
  mutation UpdateOffer($data: OfferInputUpdateField!, $id: Int!) {
    updateOffer(data: $data, id: $id) {
      id
      name
      type
      timePeriod
      creditAmount
      couponCode
      usabilityPerUser
      discountAmount
      discountType
      subscriptionPackages {
        id
        name
      }
    }
  }
`;

export const DELETE_OFFER = gql`
  mutation DeleteOffer($id: Int!) {
    deleteOffer(id: $id)
  }
`;
