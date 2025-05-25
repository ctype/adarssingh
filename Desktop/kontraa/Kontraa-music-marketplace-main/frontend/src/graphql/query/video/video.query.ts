import { gql } from "@apollo/client";

export const FETCH_VIDEOS = gql`
  query fetchVideos($order: Int!, $category: Int, $sortBy: String!) {
    videos(sortBy: $sortBy, category: $category, order: $order) {
      id
      videoTitle
      videoFile
      upVoteCount
      photoVideoCategory {
        id
        name
      }
    }
  }
`;

export const FETCH_MY_VIDEOS = gql`
  query fetchMyVideos($sortBy: Int!) {
    myVideos(sortBy: $sortBy) {
      id
      videoTitle
      videoFile
      upVoteCount
      photoVideoCategory {
        id
        name
      }
    }
  }
`;
