import { gql } from "@apollo/client";

export const FETCH_SOUND_BANKS = gql`
  query fetchSoundBanks($filter: SoundBankFilterField!) {
    soundBanks(filter: $filter) {
      id
      title
      artworkFile
      trackStreamFile
      description
      mp3Files
      status
      visibility
      tags
      numberOfFiles
      isDraft
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
      createdAt
      updatedAt
    }
  }
`;

export const FETCH_MY_SOUND_BANKS = gql`
  query fetchMySoundBanks($sortBy: Int!) {
    mySoundBanks(sortBy: $sortBy) {
      id
      title
      artworkFile
      trackStreamFile
      description
      mp3Files
      status
      visibility
      isDraft
      tags
      upVoteCount
      numberOfFiles
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
      uploadedBy {
        id
        username
      }
      exclusiveOneTimeBuyPrices
      collaborators {
        id
        collaboratorName
        role
        profitShare
        publishingShare
        linkedUserId
      }
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
