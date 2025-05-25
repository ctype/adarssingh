import { ArrowLeft } from "lucide-react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, createListCollection } from "@chakra-ui/react";

import { Button } from "@/components/ui/button";
import { initialLicenseData } from "./utils/licenseData";
import CustomSelect from "@/components/form/CustomSelect";
import { useAppDispatch, useAppSelector } from "@/app/store";
import StepperFormWrapper from "@/wrappers/StepperFormWrapper";
import ContributorLicenseForm from "./_components/ContributorLicenseForm";
import { fetchLicenseTemplates } from "@/features/license/licenseTemplateSlice";
import { ContributorLicenseContext } from "./context/ContributorLicenseContext";

export default function ContributorLicenseAdd() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { licenseTemplates } = useAppSelector(
    (state) => state.licenseTemplates
  );
  const { setLicense } = useContext(ContributorLicenseContext);

  const handleBack = () => {
    setLicense(initialLicenseData);
    navigate(-1);
  };

  useEffect(() => {
    dispatch(fetchLicenseTemplates(1)).unwrap();
    setLicense({ ...initialLicenseData });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StepperFormWrapper
      title="Licenses"
      backBtn={
        <Button variant="plain" color="white" onClick={handleBack}>
          <ArrowLeft />
        </Button>
      }
    >
      <Box mb={4}>
        <CustomSelect
          label="Select a license template"
          name="licenseTemplate"
          placeholder="Select a license template, or start from scratch"
          options={createListCollection({
            items: licenseTemplates.map((template) => ({
              label: template.licenseTemplateName,
              value: template.id,
            })),
          })}
          onChange={(value) => {
            const selectedTemplate = licenseTemplates.find(
              (lt) => lt.id === Number(value)
            );
            if (selectedTemplate) {
              const toAddTemplate: Partial<LicenseTemplate> = {
                ...selectedTemplate,
              };
              delete toAddTemplate.id;
              delete toAddTemplate.__typename;

              const data = {
                ...toAddTemplate,
                licenseName: toAddTemplate.licenseTemplateName || "",
                licenseShortDescription:
                  toAddTemplate.licenseTemplateShortDescription || "",
                licenseText: toAddTemplate.licenseTemplateText || "",
                licenseDefaultPrice:
                  toAddTemplate.licenseTemplateDefaultPrice || null,
                licenseMinOfferPrice:
                  toAddTemplate.licenseTemplateMinOfferPrice || null,
                type: toAddTemplate?.type || "track",
                radioBroadcastRights:
                  toAddTemplate?.radioBroadcastRights || false,
                livePerformanceProfitRights:
                  toAddTemplate?.livePerformanceProfitRights || false,
              };
              delete data.licenseTemplateName;
              delete data.licenseTemplateShortDescription;
              delete data.licenseTemplateText;
              delete data.licenseTemplateDefaultPrice;
              delete data.licenseTemplateMinOfferPrice;

              setLicense(data as LicenseCreateUpdateFields);
            }
          }}
        />
      </Box>
      <ContributorLicenseForm />
    </StepperFormWrapper>
  );
}
