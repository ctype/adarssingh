import { gql } from "@apollo/client";

export const FETCH_AUDIOS = gql`
  query FetchAudios($filter: AudioFilterField!) {
    audios(filter: $filter) {
      id
      title
      artworkFile
      wavFile
      mp3File
      trackStreamFile
      description
      audioBpm
      duration
      hasExplicitContent
      audioRecordLabel
      audioPublisher
      audioForSale
      audioIsAiGenerated
      audioIsYoutube
      uploadedByRightHolder
      status
      upVoteCount
      genre {
        id
        name
      }
      moodType {
        id
        name
      }
      language {
        id
        name
      }
      instrumentId {
        id
        name
      }
      audioKey {
        id
        name
      }
      subGenre {
        id
        name
      }
      visibility
      isDraft
      releaseDate
      tags
      uploadedBy {
        id
        username
      }
      fileIds {
        id
        fileName
        fileUrl
        fileType
        size
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

export const FETCH_MY_AUDIOS = gql`
  query FetchMyAudios($sortBy: Int!) {
    myAudios(sortBy: $sortBy) {
      id
      title
      artworkFile
      wavFile
      mp3File
      trackStreamFile
      description
      audioBpm
      duration
      hasExplicitContent
      audioRecordLabel
      audioPublisher
      audioForSale
      audioIsAiGenerated
      audioIsYoutube
      uploadedByRightHolder
      upVoteCount
      status
      genre {
        id
      }
      moodType {
        id
      }
      language {
        id
      }
      instrumentId {
        id
      }
      audioKey {
        id
      }
      subGenre {
        id
      }
      visibility
      isDraft
      releaseDate
      tags
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
        audioId {
          id
        }
      }
      fileIds {
        id
        fileName
        fileUrl
        size
        fileType
      }
      exclusiveOneTimeBuyPrices
      licenses {
        id
        licenseName
      }
    }
  }
`;
