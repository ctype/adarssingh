import { gql } from "@apollo/client";

export const CREATE_LICENSE_TEMPLATE = gql`
  mutation createLicenseTemplate($data: LicenseTemplateFieldInput!) {
    createLicenseTemplate(data: $data) {
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

export const UPDATE_LICENSE_TEMPLATE = gql`
  mutation updateLicenseTemplate($id: Int!, $data: LicenseTemplateUpdateFieldInput!) {
    updateLicenseTemplate(id: $id, data: $data) {
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

export const DELETE_LICENSE_TEMPLATE = gql`
  mutation deleteLicenseTemplate($id: Int!) {
    deleteLicenseTemplate(id: $id)
  }
`;

export const CREATE_LICENSE = gql`
  mutation createLicense($data: LicenseFieldInput!) {
    createLicense(data: $data) {
      id
      licenseName
      licenseShortDescription
      type
      licenseText
      addToMusicByDefault
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
    }
  }
`;

export const UPDATE_LICENSE = gql`
  mutation updateLicense($id: Int!, $data: LicenseUpdateFieldInput!) {
    updateLicense(id: $id, data: $data) {
      id
      licenseName
      licenseShortDescription
      type
      licenseText
      addToMusicByDefault
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
    }
  }
`;

export const DELETE_LICENSE = gql`
  mutation deleteLicense($id: Int!) {
    deleteLicense(id: $id)
  }
`;

export const UPDATE_MUSIC_TO_LICENSE = gql`
  mutation updateLicenseToMusic($licenseIds: [Int!]!, $toAddMusicIds: [Int!]!, $toRemoveMusicIds: [Int!]!, $type: String!, $toReview: Boolean!) {
    updateLicenseToMusic(licenseIds: $licenseIds, type: $type, toAddMusicIds: $toAddMusicIds, toRemoveMusicIds: $toRemoveMusicIds, toReview: $toReview)
  }
`;

export const UPDATE_LICENSE_TO_MUSIC = gql`
  mutation updateLicensesToMusic($licenseIds: [Int!]!, $musicId: Int!, $type: String!, $toReview: Boolean!, $exclusivePrices: [String!]!) {
    updateLicensesToMusic(licenseIds: $licenseIds, musicId: $musicId, type: $type, toReview: $toReview, exclusivePrices: $exclusivePrices)
  }
`;

export const SUBMIT_AUDIO = gql`
  mutation SubmitAudio($musicId: Int!, $type: String!, $toReview: Boolean!) {
    submitAudio(musicId: $musicId, type: $type, toReview: $toReview)
  }
`;
