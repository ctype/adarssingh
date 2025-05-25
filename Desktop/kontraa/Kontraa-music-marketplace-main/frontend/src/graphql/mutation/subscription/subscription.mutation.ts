import { gql } from "@apollo/client";

// PACKAGES
export const CREATE_SUBSCRIPTION_PACKAGE = gql`
  mutation createSubscriptionPackage($data: SubscriptionPackageField!) {
    createSubscriptionPackage(data: $data) {
      id
      name
      priceMonthly
      priceAnnually
      isPreferred
      features {
        id
        name
      }
      accesses {
        id
        name
      }
    }
  }
`;

export const UPDATE_SUBSCRIPTION_PACKAGE = gql`
  mutation UpdateSubscriptionPackage($data: SubscriptionPackageUpdateField!, $id: Int!) {
    updateSubscriptionPackage(data: $data, id: $id) {
      id
      name
      priceMonthly
      priceAnnually
      isPreferred
      features {
        id
        name
      }
      accesses {
        id
        name
      }
    }
  }
`;

export const DELETE_SUBSCRIPTION_PACKAGE = gql`
  mutation DeleteSubscriptionPackage($id: Int!) {
    deleteSubscriptionPackage(id: $id)
  }
`;

// FEATURES
export const CREATE_SUBSCRIPTION_FEATURE = gql`
  mutation createSubscriptionFeature($data: SubscriptionFeatureField!) {
    createSubscriptionFeature(data: $data) {
      id
      name
      helperText
    }
  }
`;

export const UPDATE_SUBSCRIPTION_FEATURE = gql`
  mutation UpdateSubscriptionFeature($data: SubscriptionFeatureUpdateField!, $id: Int!) {
    updateSubscriptionFeature(data: $data, id: $id) {
      id
      name
      helperText
    }
  }
`;

export const DELETE_SUBSCRIPTION_FEATURE = gql`
  mutation DeleteSubscriptionFeature($id: Int!) {
    deleteSubscriptionFeature(id: $id)
  }
`;

// PACKAGE FEATURE
export const ADD_FEATURE_TO_PACKAGE = gql`
  mutation AddFeatureToPackage($packageId: Int!, $featureId: Int!) {
    addFeatureToPackage(packageId: $packageId, featureId: $featureId) {
      id
      name
      features {
        id
        name
      }
    }
  }
`;

export const REMOVE_FEATURE_TO_PACKAGE = gql`
  mutation RemoveFeatureToPackage($packageId: Int!, $featureId: Int!) {
    removeFeatureToPackage(packageId: $packageId, featureId: $featureId) {
      id
      name
      features {
        id
        name
      }
    }
  }
`;


// PACKAGE FEATURE LABEL VALUE
export const CREATE_PACKAGE_FEATURE_LABEL_VALUE = gql`
  mutation createPackageFeatureLabelValue($data: SubscriptionPackageFeatureLabelValueField!) {
    createPackageFeatureLabelValue(data: $data) {
      id
      value
      label
      reductionAmount
      timePeriod
      packageId {
        id
      }
      featureId {
        id
      }
    }
  }
`;

export const UPDATE_PACKAGE_FEATURE_LABEL_VALUE = gql`
  mutation updatePackageFeatureLabelValue($data: SubscriptionPackageFeatureLabelValueUpdateField!, $id: Int!) {
    updatePackageFeatureLabelValue(data: $data, id: $id) {
      id
      value
      label
      reductionAmount
      timePeriod
      packageId {
        id
      }
      featureId {
        id
      }
    }
  }
`;
