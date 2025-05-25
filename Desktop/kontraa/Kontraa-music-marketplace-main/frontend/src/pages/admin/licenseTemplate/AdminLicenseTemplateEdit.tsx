import StepperFormWrapper from "@/wrappers/StepperFormWrapper";
import AdminLicenseTemplateForm from "./_components/AdminLicenseTemplateForm";
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "@/app/store";
import { LicenseTemplateContext } from "./context/LicenseTemplateContext";

export default function AdminLicenseTemplateEdit() {
  const { id } = useParams();
  const { licenseTemplates } = useAppSelector(
    (state) => state.licenseTemplates
  );
  const { setLicenseTemplate } = useContext(LicenseTemplateContext);

  useEffect(() => {
    const currentLicenseTemplate = licenseTemplates.find(
      (lt) => lt.id === Number(id)
    );
    // console.log("currentLicenseTemplate", currentLicenseTemplate);

    if (currentLicenseTemplate) {
      const toAddLicenseTemplate: LicenseTemplateCreateUpdateFields = {
        ...currentLicenseTemplate,
      };
      delete (toAddLicenseTemplate as Partial<LicenseTemplate>).id;
      delete toAddLicenseTemplate.__typename;
      // console.log("toAddLicenseTemplate", toAddLicenseTemplate);

      setLicenseTemplate(toAddLicenseTemplate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StepperFormWrapper isEdit title="License Template">
      <AdminLicenseTemplateForm />
    </StepperFormWrapper>
  );
}
