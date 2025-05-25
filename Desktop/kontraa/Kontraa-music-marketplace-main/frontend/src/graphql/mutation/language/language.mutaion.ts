import { gql } from "@apollo/client";

export const CREATE_LANGUAGE = gql`
  mutation Createlanguage($name: String!) {
    createLanguage(name: $name) {
      id
      name
    }
  }
`;

export const UPDATE_LANGUAGE = gql`
  mutation Updatelanguage($id: Int!, $name: String!) {
    updateLanguage(id: $id, name: $name) {
      id
      name
    }
  }
`;

export const DELETE_LANGUAGE = gql`
  mutation Deletelanguage($id: Int!) {
    deleteLanguage(id: $id)
  }
`;
