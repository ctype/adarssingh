import { createContext } from "react";

export const LicenseContext = createContext<{
  licenses: License[];
  setLicenses: React.Dispatch<React.SetStateAction<License[]>>;
}>({
  licenses: [],
  setLicenses: () => {},
});
