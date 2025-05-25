import { useState } from "react";
import { initialLicenseTemplate } from "../utils/licenseTemplateData";
import { LicenseTemplateContext } from "./LicenseTemplateContext";
import { Outlet } from "react-router-dom";

export function LicenseTemplateProvider() {
  const [licenseTemplate, setLicenseTemplate] = useState(
    initialLicenseTemplate
  );

  return (
    <LicenseTemplateContext.Provider
      value={{ licenseTemplate, setLicenseTemplate }}
    >
      <Outlet />
    </LicenseTemplateContext.Provider>
  );
}
