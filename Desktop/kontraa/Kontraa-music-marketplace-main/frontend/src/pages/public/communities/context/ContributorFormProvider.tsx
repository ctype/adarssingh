import { PropsWithChildren, useState } from "react";

import { ContributorFormContext } from "./ContributorFormContext";
import { initialContributorData } from "../utils/contributorData";

export default function ContributorFormProvider({
  children,
}: PropsWithChildren) {
  const [contributorData, setContributorData] =
    useState<ExtraContributorFields>(initialContributorData);

  return (
    <ContributorFormContext.Provider
      value={{
        contributor: contributorData,
        setContributor: setContributorData,
      }}
    >
      {children}
    </ContributorFormContext.Provider>
  );
}
