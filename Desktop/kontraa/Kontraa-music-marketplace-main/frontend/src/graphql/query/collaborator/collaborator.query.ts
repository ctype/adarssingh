import { gql } from "@apollo/client";

export const FETCH_COLLABORATORS = gql`
  query FetchCollaborators($sortBy: Int!) {
    collaborators(sortBy: $sortBy) {
      id
      collaboratorName
      role
      profitShare
      publishingShare
      audioId
      presetId
      soundBankId
      linkedUserId
    }
  }
`;
