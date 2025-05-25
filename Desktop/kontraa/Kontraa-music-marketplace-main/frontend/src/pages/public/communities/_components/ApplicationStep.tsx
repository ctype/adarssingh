import { useContext } from "react";
import { Grid } from "@chakra-ui/react";

import CustomInput from "@/components/form/CustomInput";
import CustomTextArea from "@/components/form/CustomTextArea";
import { ContributorFormContext } from "../context/ContributorFormContext";

export default function ApplicationStep({
  goToNextStep,
}: {
  goToNextStep: () => void;
}) {
  const { setContributor } = useContext(ContributorFormContext);

  const handleApplicationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    setContributor((prev) => ({
      ...prev,
      biography: formData.get("biography") as string,
    }));
    goToNextStep();
  };

  return (
    <form
      id="contributor-form-application-info"
      onSubmit={handleApplicationSubmit}
    >
      <Grid gap={4}>
        <CustomTextArea
          label="Describe your work and style"
          name="biography"
          placeholder="Your work and style"
        />
        <CustomTextArea
          label="Why Kontraa"
          name="whyKontraa"
          placeholder="Your reason to join us"
        />

        <CustomInput
          name="previousContribution"
          label="Previous Contributions"
          placeholder="If any previous platform contributions"
          required={false}
        />

        {/* SOCIAL MEDIA LINKS */}
      </Grid>
    </form>
  );
}
