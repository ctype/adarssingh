import { gql } from "@apollo/client";

export const CREATE_AUDIO = gql`
  mutation CreateAudio($data: AudioFieldInput!) {
    createAudio(data: $data) {
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
        audioId {
          id
        }
        presetId {
          id
        }
        soundBankId {
          id
        }
        linkedUserId
      }
    }
  }
`;

export const UPDATE_AUDIO = gql`
  mutation UpdateAudio($id: Int!, $data: AudioUpdateFieldInput!) {
    updateAudio(id: $id, data: $data) {
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
      fileIds {
        id
        fileName
        fileUrl
        size
        fileType
      }
    }
  }
`;

export const DELETE_AUDIO = gql`
  mutation DeleteAudio($id: Int!) {
    deleteAudio(id: $id)
  }
`;
