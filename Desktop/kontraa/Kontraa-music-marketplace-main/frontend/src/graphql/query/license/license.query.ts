import { gql } from "@apollo/client";

export const FETCH_LICENSE_TEMPLATES = gql`
  query fetchLicenseTemplates($sortBy: Int!) {
    licenseTemplates(sortBy: $sortBy) {
      id
      licenseTemplateName
      licenseTemplateShortDescription
      type
      licenseTemplateText
      licenseTemplateDefaultPrice
      licenseTemplateMinOfferPrice
      audioLicenseDuration
      audioLicenseDistribution
      audioLicenseStreams
      audioLicenseFreeDownloads
      musicVideoMonitizedAmount
      musicVideoNonMonitizedAmount
      musicVideoMonitizedStreamAmount
      musicVideoNonMonitizedStreamAmount
      radioBroadcastRights
      radioStationsAmount
      livePerformanceProfitRights
      livePerformanceNonProfitAmount
    }
  }
`;

export const FETCH_LICENSES = gql`
  query licenses($sortBy: Int!) {
    licenses(sortBy: $sortBy) {
      id
      licenseName
      licenseShortDescription
      type
      licenseText
      licenseDefaultPrice
      licenseMinOfferPrice
      audioLicenseDuration
      audioLicenseDistribution
      audioLicenseStreams
      audioLicenseFreeDownloads
      musicVideoMonitizedAmount
      musicVideoNonMonitizedAmount
      musicVideoMonitizedStreamAmount
      musicVideoNonMonitizedStreamAmount
      radioBroadcastRights
      radioStationsAmount
      livePerformanceProfitRights
      livePerformanceNonProfitAmount
      addToMusicByDefault
    }
  }
`;

export const FETCH_MY_LICENSES = gql`
  query myLicenses($type: String!) {
    myLicenses(type: $type) {
      id
      licenseName
      licenseShortDescription
      type
      licenseText
      licenseDefaultPrice
      licenseMinOfferPrice
      audioLicenseDuration
      audioLicenseDistribution
      audioLicenseStreams
      audioLicenseFreeDownloads
      musicVideoMonitizedAmount
      musicVideoNonMonitizedAmount
      musicVideoMonitizedStreamAmount
      musicVideoNonMonitizedStreamAmount
      radioBroadcastRights
      radioStationsAmount
      livePerformanceProfitRights
      livePerformanceNonProfitAmount
      addToMusicByDefault
    }
  }
`;
