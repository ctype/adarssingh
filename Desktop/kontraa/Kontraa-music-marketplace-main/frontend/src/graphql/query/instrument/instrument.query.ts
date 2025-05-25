import { gql } from "@apollo/client";

export const FETCH_INSTRUMENT = gql`
  query FetchInstruments {
    instruments {
      id
      name
    }
  }
`;
