import { gql } from "@apollo/client";

export const CREATE_MOODTYPE = gql`
  mutation CreatemoodType($name: String!) {
    createMoodType(name: $name) {
      id
      name
    }
  }
`;

export const UPDATE_MOODTYPE = gql`
  mutation UpdatemoodType($id: Int!, $name: String!) {
    updateMoodType(id: $id, name: $name) {
      id
      name
    }
  }
`;

export const DELETE_MOODTYPE = gql`
  mutation DeletemoodType($id: Int!) {
    deleteMoodType(id: $id)
  }
`;
