import { ArrowLeft } from "lucide-react";
import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAppSelector } from "@/app/store";
import { Button } from "@/components/ui/button";
import { initialLicenseData } from "./utils/licenseData";
import StepperFormWrapper from "@/wrappers/StepperFormWrapper";
import ContributorLicenseForm from "./_components/ContributorLicenseForm";
import { ContributorLicenseContext } from "./context/ContributorLicenseContext";

export default function ContributorLicenseEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setLicense } = useContext(ContributorLicenseContext);
  const { myLicenses } = useAppSelector((state) => state.licenses);
  const currentLicenseTemplate = myLicenses.find((lt) => lt.id === Number(id));

  const handleEditBack = () => {
    setLicense(initialLicenseData);
    navigate(-1);
  };

  useEffect(() => {
    if (currentLicenseTemplate) {
      const toAddLicenseTemplate: LicenseCreateUpdateFields = {
        ...currentLicenseTemplate,
      };
      delete (toAddLicenseTemplate as Partial<LicenseTemplate>).id;
      delete toAddLicenseTemplate.__typename;
      setLicense(toAddLicenseTemplate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLicenseTemplate]);

  return (
    <StepperFormWrapper
      isEdit
      title="Licenses"
      backBtn={
        <Button variant="plain" color="white" onClick={handleEditBack}>
          <ArrowLeft />
        </Button>
      }
    >
      <ContributorLicenseForm />
    </StepperFormWrapper>
  );
}
