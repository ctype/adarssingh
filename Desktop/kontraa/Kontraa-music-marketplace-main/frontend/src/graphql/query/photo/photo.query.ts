import { gql } from "@apollo/client";

export const FETCH_PHOTOS = gql`
  query fetchPhotos($order: Int!, $category: Int, $sortBy: String!) {
    photos(sortBy: $sortBy, category: $category, order: $order) {
      id
      photoTitle
      photoFile
      upVoteCount
      photoVideoCategory {
        id
        name
      }
    }
  }
`;

export const FETCH_MY_PHOTOS = gql`
  query fetchMyPhotos($sortBy: Int!) {
    myPhotos(sortBy: $sortBy) {
      id
      photoTitle
      photoFile
      upVoteCount
      photoVideoCategory {
        id
        name
      }
    }
  }
`;
