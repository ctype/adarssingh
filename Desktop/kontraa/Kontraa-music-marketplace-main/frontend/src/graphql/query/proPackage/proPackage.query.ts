import { gql } from "@apollo/client";

export const FETCH_SUBSCRIPTION_FEATURES = gql`
  query FetchSubscriptionFeatures {
    subscriptionFeatures {
      id
      name
      helperText
    }
  }
`;

export const FETCH_SUBSCRIPTION_PERMISSIONS = gql`
  query FetchSubcriptionPermissions {
    permissions {
      id
      permissionName
      type
      entity
    }
  }
`;

export const FETCH_SUBSCRIPTION_PACKAGES = gql`
  query FetchSubscriptionPackages {
    subscriptionPackages {
      id
      name
      features {
        id
        name
      }
      packageFeatureValues {
        id
        label
        value
        reductionAmount
        timePeriod
        featureId {
          id
        }
      }
      accesses {
        id
      }
      priceMonthly
      priceAnnually
      isPreferred
      activeStatus
    }
  }
`;

export const FETCH_SUBSCRIPTION_ACCESSES = gql`
  query FetchSubscriptionAccess {
    subscriptionAccess {
      id
      name
    }
  }
`;
