import React, { createContext } from "react";
import { initialContributorData } from "../utils/contributorData";

export const ContributorFormContext = createContext<{
  contributor: ExtraContributorFields;
  setContributor: React.Dispatch<React.SetStateAction<ExtraContributorFields>>;
}>({
  contributor: initialContributorData,
  setContributor: () => {},
});
