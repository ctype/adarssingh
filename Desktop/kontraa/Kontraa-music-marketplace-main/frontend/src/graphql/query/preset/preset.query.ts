import { gql } from "@apollo/client";

export const FETCH_PRESETS = gql`
  query fetchPresets($filter: PresetFilterField!) {
    presets(filter: $filter) {
      id
      title
      artworkFile
      trackStreamFile
      description
      mp3Files
      status
      visibility
      tags
      isDraft
      numberOfFiles
      upVoteCount
      fileIds {
        id
        fileName
        fileType
        size
      }
      genreMix {
        id
        name
      }
      presetType {
        id
        name
      }
      uploadedBy {
        id
        username
      }
      exclusiveOneTimeBuyPrices
      licenses {
        id
        licenseName
        type
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
      createdAt
      updatedAt
    }
  }
`;

export const FETCH_MY_PRESETS = gql`
  query fetchMyPresets($sortBy: Int!) {
    myPresets(sortBy: $sortBy) {
      id
      title
      artworkFile
      trackStreamFile
      description
      mp3Files
      status
      visibility
      isDraft
      numberOfFiles
      tags
      upVoteCount
      fileIds {
        id
        fileName
        fileType
        size
      }
      genreMix {
        id
        name
      }
      presetType {
        id
        name
      }
      uploadedBy {
        id
        username
      }
      collaborators {
        id
        collaboratorName
        role
        profitShare
        publishingShare
        linkedUserId
      }
      exclusiveOneTimeBuyPrices
      licenses {
        id
        licenseName
        type
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
  }
`;
