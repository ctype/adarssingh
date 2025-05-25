import { gql } from "@apollo/client";

export const FETCH_REPORTS = gql`
  query FetchReports($status: String) {
    fetchReports(status: $status) {
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

export const FETCH_MY_REPORTS = gql`
  query FetchReports($status: String) {
    fetchMyReports(status: $status) {
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
