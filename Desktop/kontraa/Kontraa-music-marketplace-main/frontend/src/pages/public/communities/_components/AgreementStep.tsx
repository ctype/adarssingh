import { useContext } from "react";
import { Grid } from "@chakra-ui/react";

import { useAppDispatch } from "@/app/store";
import { toaster } from "@/components/ui/toaster";
import { Checkbox } from "@/components/ui/checkbox";
import CustomInput from "@/components/form/CustomInput";
import CustomFileInput from "@/components/form/CustomFileInput";
import { ContributorFormContext } from "../context/ContributorFormContext";
import { contributorRegistration } from "@/features/system_user/systemUserSlice";
import { useNavigate } from "react-router-dom";

export default function AgreementStep() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { contributor } = useContext(ContributorFormContext);

  const handleAgreementSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      dispatch(
        contributorRegistration({
          ...contributor,
          agreeToTerms: formData.get("agreeToTerms") === "on",
        })
      )
        .unwrap()
        .then((d) => {
          if (d.contributorRegistration) {
            toaster.success({
              title: "Contributor Registration",
              removeDelay: 5000,
              description:
                "Your request has been submitted. Please check your email for further instructions.",
            });
            setTimeout(() => {
              navigate("/", { replace: true });
            }, 2000);
          }
        });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <form id="contributor-form-agreement-info" onSubmit={handleAgreementSubmit}>
      <Grid gap={4}>
        <CustomFileInput
          required={false}
          label="Upload your work sample (If applicable)"
          name="workSample"
          maxSize={70}
          accept={["audio-mp3", "audio-wav"]}
        />

        <CustomInput
          name="additonalNote"
          label="Additional Note"
          placeholder="If any"
          required={false}
        />

        <Checkbox name="agreeToTerms" required>
          By checking this box, you agree to Kontraa's Terms of Service and
          Privacy Policy
        </Checkbox>

        {/* CAPTCHA */}
      </Grid>
    </form>
  );
}
