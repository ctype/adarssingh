import StepperFormWrapper from "@/wrappers/StepperFormWrapper";
import AdminLicenseTemplateForm from "./_components/AdminLicenseTemplateForm";

export default function AdminLicenseTemplateAdd() {
  return (
    <StepperFormWrapper title="License Template">
      <AdminLicenseTemplateForm />
    </StepperFormWrapper>
  );
}
