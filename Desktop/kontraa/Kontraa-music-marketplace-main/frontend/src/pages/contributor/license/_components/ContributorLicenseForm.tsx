import { useSteps } from "@chakra-ui/react";
import { Group, Stack } from "@chakra-ui/react";

import { useAppSelector } from "@/app/store";
import { Button } from "@/components/ui/button";
import {
  StepsContent,
  StepsItem,
  StepsList,
  StepsRoot,
} from "@/components/ui/steps";
import LicenseContract from "./LicenseContract";
import LicenseBasicInfo from "./LicenseBasicInfo";

// interface IAdmdinLicenseFormProps extends IFormBaseProperties {
//   data?: License;
// }

const steps = [
  {
    index: 0,
    label: "Basic Info",
  },
  {
    index: 1,
    label: "Contract",
  },
];

export default function ContributorLicenseForm() {
  const { isPending } = useAppSelector((state) => state.licenses);
  const { value: currentStep, setStep: setCurrentStep } = useSteps({
    defaultStep: 0,
    count: 2,
  });
  const totalSteps = 1;

  return (
    <Stack gap="10" width="full" height={"70vh"} minH={"45vh"}>
      <StepsRoot
        defaultValue={1}
        count={totalSteps}
        step={currentStep}
        h={"inherit"}
      >
        <StepsList mb={4}>
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
          <StepsContent
            index={0}
            overflowY={"scroll"}
            h={"65vh"}
            minH={"30vh"}
            p={4}
          >
            <LicenseBasicInfo setCurrentStep={setCurrentStep} />
          </StepsContent>
          <StepsContent
            index={1}
            overflowY={"scroll"}
            h={"65vh"}
            minH={"30vh"}
            p={4}
          >
            <LicenseContract setCurrentStep={setCurrentStep} />
          </StepsContent>
        </>
        <Group alignSelf={"self-end"} gap={4}>
          <Button
            variant="outline"
            size="sm"
            color={"white"}
            bg={"gray.600"}
            border={"none"}
            disabled={currentStep <= 0 || isPending ? true : false}
            onClick={() => setCurrentStep(currentStep - 1)}
          >
            Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            bg={"blue.500"}
            color={"white"}
            border={"none"}
            disabled={currentStep > totalSteps || isPending ? true : false}
            type={"submit"}
            form={
              currentStep === 0
                ? "license-template-basic-info-form"
                : "license-template-contract-form"
            }
          >
            {isPending
              ? "Updating contract"
              : currentStep === totalSteps
                ? "Submit"
                : "Next"}
          </Button>
        </Group>
      </StepsRoot>
    </Stack>
  );
}
