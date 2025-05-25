import { gql } from "@apollo/client";

export const GET_USER_PROFILE = gql`
  query getUserProfile($username: String!) {
    getUserProfile(username: $username) {
      user {
        id
        username
        email
        firstName
        lastName
        country
        biography
        profilePath
        followersCount
        followingCount
      }
      audios {
        id
        title
        artworkFile
        exclusiveOneTimeBuyPrices
      }
      presets {
        id
        title
        artworkFile
        numberOfFiles
        exclusiveOneTimeBuyPrices
      }
      soundBanks {
        id
        title
        artworkFile
        numberOfFiles
        exclusiveOneTimeBuyPrices
      }
      soundEffects {
        id
        soundEffectTitle
        soundEffectArtworkFile
      }
    }
  }
`;


export const PROFILE = gql`
  query Profile {
    me {
      id
      email
      firstName
      lastName
      username
      mobileNumber
      biography
      profilePath
      likes {
        id
        entityId
        entityName
      }
    }
  }
`;

export const MY_PREFERENCES = gql`
  query MyPreferences {
    myPreferences {
      id
      value
      name
    }
  }
`;
