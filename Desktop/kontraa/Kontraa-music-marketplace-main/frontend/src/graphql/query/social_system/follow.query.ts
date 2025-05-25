import { gql } from "@apollo/client";

export const MY_FOLLOWERS = gql`
  query MyFollowers {
    myFollowers {
      username
      firstName
      lastName
      profilePath
    }
  }
`;

export const MY_FOLLOWING = gql`
  query MyFollowing {
    myFollowings {
      username
      firstName
      lastName
      profilePath
    }
  }
`;
