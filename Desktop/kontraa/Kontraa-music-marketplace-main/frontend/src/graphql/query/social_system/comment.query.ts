import { gql } from "@apollo/client";

export const FETCH_COMMENTS_BY_ID = gql`
  query fetchCommentsById($entityId: Int!, $entityName: String!) {
    commentsById(entityId: $entityId, entityName: $entityName) {
      id
      content
      entityId
      entityName
      parentId
      repliesCount
      upVoteCount
      user {
        id
        username
        profilePath
      }
    }
  }
`;

export const FETCH_REPLIES = gql`
  query fetchReplies($parentId: Int!) {
    replies(parentId: $parentId) {
      id
      content
      entityId
      entityName
      parentId
      repliesCount
      upVoteCount
      user {
        id
        username
        profilePath
      }

    }
  }
`;
