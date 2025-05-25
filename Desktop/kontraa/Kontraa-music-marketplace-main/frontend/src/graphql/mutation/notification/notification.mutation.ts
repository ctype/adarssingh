import { gql } from "@apollo/client";

export const READ_NOTIFICATION = gql`
  mutation ReadNotification($id: Int!) {
    readNotification(id: $id)
  }
`;

// export const CREATE_NOTIFICATION = gql`
//   mutation Createnotification($name: String!) {
//     createAudioNotification(name: $name) {
//       id
//       name
//     }
//   }
// `;

// export const UPDATE_NOTIFICATION = gql`
//   mutation Updatenotification($id: Int!, $name: String!) {
//     updateAudioNotification(id: $id, name: $name) {
//       id
//       name
//     }
//   }
// `;

// export const DELETE_NOTIFICATION = gql`
//   mutation Deletenotification($id: Int!) {
//     deleteAudioNotification(id: $id)
//   }
// `;
