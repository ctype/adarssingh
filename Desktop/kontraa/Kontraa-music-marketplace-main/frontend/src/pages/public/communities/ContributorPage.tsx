import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Group, Image, Stack, useSteps } from "@chakra-ui/react";

import { Button } from "@/components/ui/button";
import {
  StepsContent,
  StepsItem,
  StepsList,
  StepsRoot,
} from "@/components/ui/steps";
import PersonalInfoStep from "./_components/PersonalInfoStep";
import ProfessionalInfoStep from "./_components/ProfessionalInfoStep";
import ApplicationStep from "./_components/ApplicationStep";
import AgreementStep from "./_components/AgreementStep";
import { useAppSelector } from "@/app/store";
import { FormDialog } from "@/components/form/FormDialog";
import ContributorFormProvider from "./context/ContributorFormProvider";

const steps = [
  {
    index: 0,
    label: "Basic Informatio",
    formId: "contributor-form-personal-info",
  },
  {
    index: 1,
    label: "Professional Information",
    formId: "contributor-form-professional-info",
  },
  {
    index: 2,
    label: "Application",
    formId: "contributor-form-application-info",
  },
  {
    index: 3,
    label: "Agreement & Submission",
    formId: "contributor-form-agreement-info",
  },
];

export default function ContributorPage() {
  const navigate = useNavigate();
  const { count, goToNextStep, goToPrevStep, value } = useSteps({
    defaultStep: 0,
    count: 3,
  });
  const { user, isPending } = useAppSelector((state) => state.auth);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    if (!user && !isPending) {
      setIsPopupOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ContributorFormProvider>
      <Box backgroundColor={"black"}>
        <Box h={"250px"}>
          <Image
            src="/images/contributer-banner.jpg"
            objectFit="cover"
            h={"full"}
            w={"full"}
          />
        </Box>

        <Box p={8} w={"80%"} mx={"auto"}>
          <h4 style={{ textAlign: "center", marginBlock: "2rem" }}>
            Expand your reach. Make an impact. Share your sound and inspire
            creators globally.
          </h4>

          <Stack gap="10" mt={4}>
            <StepsRoot
              defaultValue={1}
              count={count}
              step={value}
              h={"inherit"}
            >
              <StepsList w={"inherit"} mb={4}>
                {steps.map((step) => (
                  <StepsItem
                    index={step.index}
                    title={step.label}
                    key={step.index}
                    titleColor={"white"}
                  />
                ))}
              </StepsList>
              <>
                <StepsContent index={0} p={4}>
                  <PersonalInfoStep goToNextStep={goToNextStep} />
                </StepsContent>
                <StepsContent index={1} p={4}>
                  <ProfessionalInfoStep goToNextStep={goToNextStep} />
                </StepsContent>
                <StepsContent index={2} p={4}>
                  <ApplicationStep goToNextStep={goToNextStep} />
                </StepsContent>
                <StepsContent index={3} p={4}>
                  <AgreementStep />
                </StepsContent>
              </>
              <Group alignSelf={"self-end"} gap={4}>
                <Button
                  variant="outline"
                  size="sm"
                  color={"white"}
                  bg={"gray.600"}
                  border={"none"}
                  disabled={value <= 0}
                  // || isPending ? true : false
                  onClick={goToPrevStep}
                >
                  Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  bg={"blue.500"}
                  color={"white"}
                  border={"none"}
                  disabled={value > count}
                  // || isPending ? true : false
                  type={"submit"}
                  // onClick={goToNextStep}
                  form={steps[value].formId}
                >
                  {/* {isPending
                            ? "Updating contract" */}
                  {/* : */}
                  {value === count ? "Submit" : "Next"}
                </Button>
              </Group>
            </StepsRoot>
          </Stack>
        </Box>

        <FormDialog
          title="Please Login"
          open={isPopupOpen}
          setOpen={setIsPopupOpen}
          handleOk={() => navigate("/auth/login")}
          handleSubmit={() => {}}
          handleCancel={() => navigate(-1)}
          hideCross
          escapeEnabled={false}
          isNotForm
          yesText="Login"
        >
          <p>
            You need to login or create an account to start contributor process.
          </p>
        </FormDialog>
      </Box>
    </ContributorFormProvider>
  );
}
