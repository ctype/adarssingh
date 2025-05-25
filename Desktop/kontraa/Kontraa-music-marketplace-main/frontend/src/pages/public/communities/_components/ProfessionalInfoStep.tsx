import { useContext } from "react";
import {
  CheckboxGroup,
  createListCollection,
  Flex,
  Grid,
  HStack,
} from "@chakra-ui/react";

import { Field } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import CustomInput from "@/components/form/CustomInput";
import CustomSelect from "@/components/form/CustomSelect";
import { ContributorFormContext } from "../context/ContributorFormContext";

export default function ProfessionalInfoStep({
  goToNextStep,
}: {
  goToNextStep: () => void;
}) {
  const { setContributor } = useContext(ContributorFormContext);

  const handleProfessionalInfoSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    setContributor((prev) => ({
      ...prev,
      contentType: formData.getAll("contentType").join(","),
      genreType: formData.getAll("genreType").join(","),
      experienceLevel: formData.get("experienceLevel") as string,
      portfolioLink: formData.get("portfolioLink") as string,
    }));
    goToNextStep();
  };

  return (
    <form
      id="contributor-form-professional-info"
      onSubmit={handleProfessionalInfoSubmit}
    >
      <Grid gap={8}>
        <Flex direction="column" gap={2}>
          <Field
            label="What type of content do you create?"
            helperText="Select all that apply"
            required
          />
          <CheckboxGroup name="contentType">
            <HStack alignItems={"center"} gap={4}>
              <Checkbox value="track">Music (Track, Loops, etc)</Checkbox>
              <Checkbox value="preset">Presets</Checkbox>
              <Checkbox value="sound-effect">Sound Effects</Checkbox>
              <Checkbox value="sample-pack">Sample Packs</Checkbox>
              <Checkbox value="acapellas">Acapellas</Checkbox>
            </HStack>
          </CheckboxGroup>
        </Flex>

        <Flex direction={"column"} gap={2}>
          <Field
            label="What type of genre you create your content in?"
            helperText="Select all that apply"
            required
          />
          <CheckboxGroup name="genreType">
            <HStack alignItems={"center"} gap={4}>
              <Checkbox value="electronic">Electronic</Checkbox>
              <Checkbox value="hip-hop">Hip-Hop</Checkbox>
              <Checkbox value="rock">Rock</Checkbox>
              <Checkbox value="pop">Pop</Checkbox>
              <Checkbox value="ambient">Ambient</Checkbox>
              <Checkbox value="jazz">Jaaz</Checkbox>
              <Checkbox value="classical">Classical</Checkbox>
            </HStack>
          </CheckboxGroup>
        </Flex>

        <CustomSelect
          label="Select your Experience level"
          placeholder="Select your experience level"
          name="experienceLevel"
          options={createListCollection({
            items: [
              { label: "Beginner", value: "beginner" },
              { label: "Intermediate", value: "intermediate" },
              { label: "Advanced", value: "advanced" },
              { label: "Professional", value: "professional" },
            ],
          })}
        />

        <CustomInput
          name="portfolioLink"
          label="Website/portfolio link"
          placeholder="If any"
          required={false}
        />
      </Grid>
    </form>
  );
}
