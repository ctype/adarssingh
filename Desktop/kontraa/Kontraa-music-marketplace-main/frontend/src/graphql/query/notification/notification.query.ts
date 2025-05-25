import { gql } from "@apollo/client";

export const FETCH_MY_NOTIFICATIONS = gql`
  query MyNotifications($userId: Int!) {
    myNotifications(userId: $userId) {
      id
      title
      summary
      userId
      redirectLink
      hasBeenRead
      type
      notificationImageUrl
    }
  }
`;
