import { createContext } from "react";
import { initialLicenseData } from "../utils/licenseData";

export const ContributorLicenseContext = createContext<{
  license: LicenseCreateUpdateFields;
  setLicense: React.Dispatch<React.SetStateAction<LicenseCreateUpdateFields>>;
}>({
  license: initialLicenseData,
  setLicense: () => {},
});
