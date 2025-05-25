import { useContext } from "react";
import {
  createListCollection,
  FieldLabel,
  Grid,
  GridItem,
  HStack,
  Text,
} from "@chakra-ui/react";

import { Field } from "@/components/ui/field";
import CustomInput from "@/components/form/CustomInput";
import CustomSelect from "@/components/form/CustomSelect";
import { Radio, RadioGroup } from "@/components/ui/radio";
import { ContributorLicenseContext } from "../context/ContributorLicenseContext";

export default function LicenseBasicInfo({
  setCurrentStep,
}: {
  setCurrentStep: (value: number) => void;
}) {
  const { license, setLicense } = useContext(ContributorLicenseContext);

  const handleNext = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const lt = Object.fromEntries(formData.entries());

    if (
      lt.licenseName &&
      lt.licenseShortDescription &&
      lt.licenseDefaultPrice &&
      lt.licenseMinOfferPrice &&
      lt.type
    ) {
      setLicense((prev) => ({
        ...prev,
        licenseName: lt.licenseName as string,
        licenseShortDescription: lt.licenseShortDescription as string,
        licenseDefaultPrice: Number(lt.licenseDefaultPrice),
        licenseMinOfferPrice: Number(lt.licenseMinOfferPrice),
        type: lt.type as string,
        addToMusicByDefault: lt.addToMusicByDefault === "Yes",
      }));
      setCurrentStep(1);
    }
  };

  return (
    <form onSubmit={handleNext} id="license-template-basic-info-form">
      <Grid templateColumns={"repeat(2, 1fr)"} gapX={4} gapY={8}>
        <GridItem colSpan={2}>
          <CustomInput
            name="licenseName"
            label=" name"
            defaultValue={license.licenseName}
            placeholder="Give the template a name"
            // error={errors["licenseName"]}
          />
        </GridItem>

        <GridItem colSpan={2}>
          <CustomInput
            name="licenseShortDescription"
            label="Short Description"
            defaultValue={license.licenseShortDescription}
            placeholder="Give the template a short description"
            // error={errors["licenseShortDescription"]}
          />
        </GridItem>

        <CustomInput
          name="licenseDefaultPrice"
          label="Default Price"
          defaultValue={license.licenseDefaultPrice?.toString()}
          placeholder="Add default price"
          type="number"
          // error={errors["licenseName"]}
        />

        <CustomInput
          name="licenseMinOfferPrice"
          label="Minimum Offer Price"
          defaultValue={license.licenseMinOfferPrice?.toString()}
          placeholder="Set Minimum Offer Price you are willing to accept"
          type="number"
          // error={errors["licenseName"]}
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
            defaultValue={license.type}
          />
        </GridItem>

        <GridItem colSpan={2}>
          <Field required>
            <FieldLabel>
              Add to tracks by default? <Text color={"red.400"}>*</Text>
            </FieldLabel>
            <RadioGroup name="addToMusicByDefault" defaultValue="Yes">
              <HStack gap={4}>
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
              </HStack>
            </RadioGroup>
          </Field>
        </GridItem>
      </Grid>
    </form>
  );
}
