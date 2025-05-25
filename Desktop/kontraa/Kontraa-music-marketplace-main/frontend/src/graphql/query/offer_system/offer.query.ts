import { gql } from "@apollo/client";

export const FETCH_OFFERS = gql`
  query FetchOffers($type: String!) {
    offers(type: $type) {
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
