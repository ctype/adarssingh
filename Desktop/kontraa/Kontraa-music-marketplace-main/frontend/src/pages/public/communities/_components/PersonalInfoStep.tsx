import { useContext } from "react";
import { createListCollection, Grid } from "@chakra-ui/react";

import CustomInput from "@/components/form/CustomInput";
// import CountrySelect from "@/components/global/CountrySelect";
import { ContributorFormContext } from "../context/ContributorFormContext";
import CustomSelect from "@/components/form/CustomSelect";
import { countriesData } from "@/constants/countries";

export default function PersonalInfoStep({
  goToNextStep,
}: {
  goToNextStep: () => void;
}) {
  const { setContributor } = useContext(ContributorFormContext);

  const handlePersonalInfoSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    setContributor((prev) => ({
      ...prev,
      ...data,
      mobileNumber: +data.mobileNumber,
    }));
    goToNextStep();
  };

  return (
    <form
      id="contributor-form-personal-info"
      onSubmit={handlePersonalInfoSubmit}
    >
      <Grid gap={4}>
        <CustomInput
          label="Professional Email"
          name="professionalEmail"
          type="email"
          placeholder="Leave empty if you want to use the email associated with your account"
          required={false}
        />
        <CustomInput
          label="Mobile number"
          name="mobileNumber"
          type="number"
          placeholder="Provide your mobile number"
        />

        <CustomInput
          name="artistStageName"
          label="Stage/Artist Name"
          placeholder="Leave empty to use username as stage name"
          required={false}
        />

        <CustomSelect
          name="country"
          label="Country"
          placeholder="Select your country"
          options={createListCollection({
            items: countriesData,
          })}
          defaultValue={undefined}
          required={true}
        />

        {/* <CountrySelect /> */}
      </Grid>
    </form>
  );
}
