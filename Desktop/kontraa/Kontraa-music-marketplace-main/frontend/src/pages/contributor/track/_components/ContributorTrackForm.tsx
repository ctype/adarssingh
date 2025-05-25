import { useContext, useState } from "react";
import {
  StepsContent,
  StepsItem,
  StepsList,
  StepsRoot,
} from "@/components/ui/steps";
import { Stack, Group, useSteps } from "@chakra-ui/react";

import MetaDatas from "./MetaDatas";
// import Monetization from "../../_components/Monetization";
import Collaborators from "../../_components/Collaborators";
import { Button } from "@/components/ui/button";
import BasicMusicInfoAndfiles from "./BasicMusicInfoAndfiles";
import TempFinalStep from "@/components/music/TempFinalStep";
import { toaster } from "@/components/ui/toaster";
import { initialTrackFieldsData } from "../utils/trackOptions";
import { TrackContext } from "../context/TrackContext";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { setMyAudios } from "@/features/audio/audioSlice";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    index: 0,
    label: "Basic Music Info & Files ",
    formId: "baisc-music-info-form",
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

export default function ContributorTrackForm({
  hasBeenEdited,
  setHasBeenEdited,
}: {
  hasBeenEdited: boolean;
  setHasBeenEdited: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { value, count, goToNextStep, goToPrevStep } = useSteps({
    defaultStep: 0,
    count: 3,
  });
  const [uploadingTrack, setUploadingTrack] = useState(false);
  const { trackData, setTrackData } = useContext(TrackContext);
  const { myAudios } = useAppSelector((state) => state.audios);

  const handleSuccess = async (id: number) => {
    toaster.success({
      title: "Audio Submitted for review",
      description: "Your audio has been submitted.",
    });

    setUploadingTrack(false);

    setTrackData(initialTrackFieldsData);

    const audios = myAudios?.map((audio) => {
      if (audio.id === id) {
        return {
          ...audio,
          isDraft: false,
        };
      }
      return audio;
    });
    dispatch(setMyAudios(audios));
    navigate(-1);
  };

  return (
    <Stack gap="10" width="full" height={"78vh"} minH={"45vh"}>
      <StepsRoot defaultValue={1} count={count} step={value}>
        <StepsList>
          {steps?.map((step) => (
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
            <BasicMusicInfoAndfiles
              hasBeenEdited={hasBeenEdited}
              goToNextStep={goToNextStep}
            />
          </StepsContent>
          <StepsContent index={1} overflowY={"scroll"} h={"65vh"} minH={"30vh"}>
            <MetaDatas
              goToNextStep={goToNextStep}
              hasBeenEdited={hasBeenEdited}
              setHasBeenEdited={setHasBeenEdited}
              setUploadingTrack={setUploadingTrack}
            />
          </StepsContent>
          <StepsContent index={2} overflowY={"scroll"} h={"65vh"} minH={"30vh"}>
            <Collaborators goToNextStep={goToNextStep} typeOfTrack="audio" />
          </StepsContent>
          <StepsContent index={3} overflowY={"scroll"} h={"65vh"} minH={"30vh"}>
            <TempFinalStep
              trackData={trackData as Track}
              onSuccess={handleSuccess}
              hasBeenEdited={hasBeenEdited}
              setUploadingTrack={setUploadingTrack}
              typeOfTrack="track"
            />
          </StepsContent>
          {/* <StepsContent index={3} overflowY={"scroll"} h={"65vh"} minH={"30vh"}>
            <Monetization
              onSuccess={handleSuccess}
              hasBeenEdited={hasBeenEdited}
              trackData={trackData as Track}
              setUploadingTrack={setUploadingTrack}
              typeOfTrack="track"
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
              ? value === count
                ? "Reviewing.."
                : "Uploading your track.."
              : value === count
                ? // ? "Send for review"
                  "Submit"
                : "Next"}
          </Button>
        </Group>
      </StepsRoot>
    </Stack>
  );
}
