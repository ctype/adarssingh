import { gql } from "@apollo/client";

export const FETCH_SOUND_EFFECTS = gql`
  query fetchSoundEffects($filter: SoundEffectFilterField!) {
    soundEffects(filter: $filter) {
      id
      soundEffectTitle
      size
      genreMix {
        id
        name
      }
      soundEffectMp3File
      soundEffectArtworkFile
      uploadedBy {
        id
        username
      }
      activeStatus
      approveStatus
    }
  }
`;

export const FETCH_MY_SOUND_EFFECTS = gql`
  query mySoundEffects($sortBy: Int!) {
    mySoundEffects(sortBy: $sortBy) {
      id
      soundEffectTitle
      size
      genreMix {
        id
        name
      }
      soundEffectMp3File
      soundEffectArtworkFile
      uploadedBy {
        id
        username
      }
      activeStatus
      approveStatus
    }
  }
`;
