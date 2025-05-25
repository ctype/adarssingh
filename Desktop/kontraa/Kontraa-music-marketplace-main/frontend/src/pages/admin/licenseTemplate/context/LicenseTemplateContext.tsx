import { createContext } from "react";
import { initialLicenseTemplate } from "../utils/licenseTemplateData";

export const LicenseTemplateContext = createContext<{
  licenseTemplate: LicenseTemplateCreateUpdateFields;
  setLicenseTemplate: React.Dispatch<
    React.SetStateAction<LicenseTemplateCreateUpdateFields>
  >;
}>({
  licenseTemplate: initialLicenseTemplate,
  setLicenseTemplate: () => {},
});
