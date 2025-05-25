import { useContext } from "react";
import { createListCollection, Grid, GridItem } from "@chakra-ui/react";

import CustomInput from "@/components/form/CustomInput";
import CustomSelect from "@/components/form/CustomSelect";
import { LicenseTemplateContext } from "../context/LicenseTemplateContext";

export default function LicenseTemplateBasicInfo({
  setCurrentStep,
}: {
  setCurrentStep: (value: number) => void;
}) {
  const { licenseTemplate, setLicenseTemplate } = useContext(
    LicenseTemplateContext
  );

  const handleNext = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const lt = Object.fromEntries(formData.entries());

    if (
      lt.licenseTemplateName &&
      lt.licenseTemplateShortDescription &&
      lt.licenseTemplateDefaultPrice &&
      lt.licenseTemplateMinOfferPrice &&
      lt.type
    ) {
      setLicenseTemplate((prev) => ({
        ...prev,
        licenseTemplateName: lt.licenseTemplateName as string,
        licenseTemplateShortDescription:
          lt.licenseTemplateShortDescription as string,
        licenseTemplateDefaultPrice: Number(lt.licenseTemplateDefaultPrice),
        licenseTemplateMinOfferPrice: Number(lt.licenseTemplateMinOfferPrice),
        type: lt.type as string,
      }));
      setCurrentStep(1);
    }
  };

  return (
    <form onSubmit={handleNext} id="license-template-basic-info-form">
      <Grid templateColumns={"repeat(2, 1fr)"} gapX={4} gapY={8}>
        <GridItem colSpan={2}>
          <CustomInput
            name="licenseTemplateName"
            label="Template name"
            defaultValue={licenseTemplate.licenseTemplateName}
            placeholder="Give the template a name"
            // error={errors["licenseTemplateName"]}
          />
        </GridItem>

        <GridItem colSpan={2}>
          <CustomInput
            name="licenseTemplateShortDescription"
            label="Short Description"
            defaultValue={licenseTemplate.licenseTemplateShortDescription}
            placeholder="Give the template a short description"
            // error={errors["licenseTemplateShortDescription"]}
          />
        </GridItem>

        <CustomInput
          name="licenseTemplateDefaultPrice"
          label="Default Price"
          defaultValue={licenseTemplate.licenseTemplateDefaultPrice?.toString()}
          placeholder="Add default price"
          type="number"
          // error={errors["licenseTemplateName"]}
        />

        <CustomInput
          name="licenseTemplateMinOfferPrice"
          label="Minimum Offer Price"
          defaultValue={licenseTemplate.licenseTemplateMinOfferPrice?.toString()}
          placeholder="Set Minimum Offer Price you are willing to accept"
          type="number"
          // error={errors["licenseTemplateName"]}
        />

        <GridItem colSpan={2}>
          <CustomSelect
            label="Type of license"
            name="type"
            // error={errors["type"]}
            options={createListCollection({
              items: [
                { label: "Track", value: "track" },
                { label: "Sound Bank", value: "sound-bank" },
                { label: "Preset", value: "preset" },
              ],
            })}
            placeholder="Select the type of license"
            defaultValue={licenseTemplate.type}
          />
        </GridItem>
      </Grid>
    </form>
  );
}
