import { gql } from "@apollo/client";

export const IS_FOLLOWING = gql`
  mutation IsFollowing($followId: Int!) {
    isFollowing(followId: $followId)
  }
`;

export const FOLLOW_CONTRIBUTOR = gql`
  mutation FollowContributor($toFollowUserId: Int!) {
    followContributor(toFollowUserId: $toFollowUserId)
  }
`;

export const UNFOLLOW_CONTRIBUTOR = gql`
  mutation UnfollowContributor($toUnfollowUserId: Int!) {
    unfollowContributor(toUnfollowUserId: $toUnfollowUserId)
  }
`;
