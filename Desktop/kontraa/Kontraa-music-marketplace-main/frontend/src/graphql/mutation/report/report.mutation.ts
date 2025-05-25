import { gql } from "@apollo/client";

export const CREATE_REPORT = gql`
  mutation CreateReport($data: ReportInputField!) {
    createReport(data: $data) {
      remark
      entityName
      entityId
      status
      user {
        id
        username
      }
      artistId
    }
  }
`;

export const UPDATE_REPORT = gql`
  mutation UpdateReport($data: ReportUpdateInputField!, $id: Int!) {
    updateReport(data: $data, id: $id) {
      remark
      entityName
      entityId
      status
      user {
        id
        username
      }
      artistId
    }
  }
`;
