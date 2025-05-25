import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  StepsContent,
  StepsItem,
  StepsList,
  StepsRoot,
} from "@/components/ui/steps";
import { Stack, Group, useSteps } from "@chakra-ui/react";

import MetaData from "./MetaData";
import BasicData from "./BasicData";
import { Button } from "@/components/ui/button";
import { toaster } from "@/components/ui/toaster";
import { PresetContext } from "../context/PresetContext";
// import Monetization from "../../_components/Monetization";
import Collaborators from "../../_components/Collaborators";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { initialPresetFieldsData } from "../utils/presetOptions";
import { setMySoundBanks } from "@/features/soundBank/soundBankSlice";
import TempFinalStep from "@/components/music/TempFinalStep";

const steps = [
  {
    index: 0,
    label: "Basic Music Info & Files ",
    formId: "baisc-data-form",
  },
  {
    index: 1,
    label: "Metadata",
    formId: "metadata-form",
  },
  {
    index: 2,
    label: "Collaborators",
    formId: "collaborators-form",
  },
  // TODO: Change in next release
  {
    index: 3,
    label: "Review & Submit",
    formId: "pricing-form",
  },
];

export default function ContributorPresetForm({
  hasBeenEdited,
  setHasBeenEdited,
}: {
  hasBeenEdited: boolean;
  setHasBeenEdited: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { value, count, goToNextStep, goToPrevStep } = useSteps({
    defaultStep: 0,
    count: 3,
  });
  const [uploadingTrack, setUploadingTrack] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { myPresets } = useAppSelector((state) => state.presets);
  const { presetData, setPresetData } = useContext(PresetContext);

  const handleSuccess = async (id: number) => {
    toaster.success({
      title: "Preset Submitted for review",
      description: "Your preset has been submitted.",
    });

    setPresetData(initialPresetFieldsData);

    const presets = myPresets.map((preset) => {
      if (preset.id === id) {
        return {
          ...preset,
          isDraft: false,
        };
      }
      return preset;
    });
    (async () => dispatch(setMySoundBanks(presets)))().finally(() => {
      navigate(-1);
    });
  };

  return (
    <Stack gap="10" width="full" height={"78vh"} minH={"45vh"}>
      <StepsRoot defaultValue={1} count={count} step={value}>
        <StepsList>
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
          <StepsContent index={0} overflowY={"scroll"} h={"65vh"} minH={"30vh"}>
            <BasicData
              hasBeenEdited={hasBeenEdited}
              goToNextStep={goToNextStep}
            />
          </StepsContent>
          <StepsContent index={1} overflowY={"scroll"} h={"65vh"} minH={"30vh"}>
            <MetaData
              goToNextStep={goToNextStep}
              hasBeenEdited={hasBeenEdited}
              setHasBeenEdited={setHasBeenEdited}
              setUploadingPreset={setUploadingTrack}
            />
          </StepsContent>
          <StepsContent index={2} overflowY={"scroll"} h={"65vh"} minH={"30vh"}>
            <Collaborators goToNextStep={goToNextStep} typeOfTrack="preset" />
          </StepsContent>
          <StepsContent index={3} overflowY={"scroll"} h={"65vh"} minH={"30vh"}>
            <TempFinalStep
              hasBeenEdited={hasBeenEdited}
              typeOfTrack="preset"
              trackData={presetData as Preset}
              onSuccess={handleSuccess}
              setUploadingTrack={setUploadingTrack}
            />
          </StepsContent>
          {/* <StepsContent index={3} overflowY={"scroll"} h={"65vh"} minH={"30vh"}>
            <Monetization
              hasBeenEdited={hasBeenEdited}
              typeOfTrack="preset"
              trackData={presetData as Preset}
              onSuccess={handleSuccess}
              setUploadingTrack={setUploadingTrack}
            />
          </StepsContent> */}
        </>
        <Group alignSelf={"self-end"} gap={4}>
          <Button
            variant="outline"
            size="sm"
            color={"white"}
            bg={"gray.600"}
            border={"none"}
            disabled={value <= 0 || uploadingTrack ? true : false}
            onClick={goToPrevStep}
          >
            Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            bg={"#3268C1"}
            color={"white"}
            border={"none"}
            disabled={value > count || uploadingTrack}
            type={"submit"}
            form={steps[value].formId}
          >
            {uploadingTrack
              ? "Uploading your track.."
              : value === count
              ? "Send for review"
              : "Next"}
          </Button>
        </Group>
      </StepsRoot>
    </Stack>
  );
}
