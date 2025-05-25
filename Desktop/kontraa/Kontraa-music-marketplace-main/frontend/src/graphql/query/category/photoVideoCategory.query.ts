import { gql } from "@apollo/client";

export const FETCH_PHOTO_VIDEO_CATEGORIES = gql`
  query PhotoVideoCateogries {
    photoVideoCategories {
      id
      name
    }
  }
`;
