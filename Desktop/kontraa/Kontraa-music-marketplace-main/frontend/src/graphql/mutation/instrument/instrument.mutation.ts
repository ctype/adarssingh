import { gql } from "@apollo/client";

export const CREATE_INSTRUMENT = gql`
  mutation CreateInstrument($name: String!) {
    createInstrument(name: $name) {
      id
      name
    }
  }
`;

export const UPDATE_INSTRUMENT = gql`
  mutation UpdatemoodType($id: Int!, $name: String!) {
    updateInstrument(id: $id, name: $name) {
      id
      name
    }
  }
`;

export const DELETE_INSTRUMENT = gql`
  mutation DeleteInstrument($id: Int!) {
    deleteInstrument(id: $id)
  }
`;
