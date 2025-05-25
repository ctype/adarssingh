import { useState } from "react";
import { initialLicenseData } from "../utils/licenseData";
import { ContributorLicenseContext } from "./ContributorLicenseContext";
import { Outlet } from "react-router-dom";

export function ContributorLicenseContextProvider() {
  const [license, setLicense] = useState(initialLicenseData);

  return (
    <ContributorLicenseContext.Provider value={{ license, setLicense }}>
      <Outlet />
    </ContributorLicenseContext.Provider>
  );
}
