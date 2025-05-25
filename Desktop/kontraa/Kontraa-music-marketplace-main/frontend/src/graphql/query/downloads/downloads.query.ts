import { gql } from "@apollo/client";

export const MY_DOWNLOADS = gql`
  query FetchMyDownloads {
    myDownloads {
      id
      entityName
      entityId
      artistName
      artistId
      fileName
      fileKey
      fileType
      licenseId
      createdAt
    }
  }
`;
