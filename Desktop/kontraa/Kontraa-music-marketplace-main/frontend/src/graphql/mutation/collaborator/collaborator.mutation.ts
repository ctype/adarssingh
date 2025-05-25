import { gql } from "@apollo/client";

export const COLLABORATORS_OPERATION = gql`
  mutation CollaboratorsOperation($data: [CollaboratorFieldInput!]!, $type: String!) {
    collaboratorOperation(data: $data, type: $type) {
      id
      collaboratorName
      role
      profitShare
      publishingShare
      audioId {
        id
      }
      presetId {
        id
      }
      soundBankId {
        id
      }
      linkedUserId
    }
  }
`;
