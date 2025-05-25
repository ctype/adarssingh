import { gql } from "@apollo/client";

export const ADD_COMMENT = gql`
  mutation AddComment($content: String!, $entityId: Int!, $entityName: String!) {
    comment(content: $content, entityId: $entityId, entityName: $entityName) {
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
      }
    }
  }
`;

export const UPDATE_COMMENT = gql`
  mutation UpdateComment($content: String!, $id: Int!) {
    comment(content: $content, id: $id) {
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
      }
    }
  }
`;

export const ADD_REPLY = gql`
  mutation AddReply($content: String!, $parentId: Int!) {
    reply(content: $content, parentId: $parentId) {
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
      }
    }
  }
`;
