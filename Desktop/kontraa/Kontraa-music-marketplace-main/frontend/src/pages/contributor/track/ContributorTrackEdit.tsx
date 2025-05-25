import { ArrowLeft } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAppSelector } from "@/app/store";
import { Button } from "@/components/ui/button";
import { TrackContext } from "./context/TrackContext";
import {
  TEMP_AUDIO_FILE_MP3_ID,
  TEMP_AUDIO_FILE_WAV_ID,
  TEMP_AUDIO_FILE_ZIP_ID,
  TEMP_TRACK_ID,
} from "../utils/options";
import StepperFormWrapper from "@/wrappers/StepperFormWrapper";
import { CollaboratorContext } from "../context/CollaboratorContext";
import ContributorTrackForm from "./_components/ContributorTrackForm";
import { initialTrackFieldsData } from "./utils/trackOptions";

export default function ContributorTrackEdit() {
  const { id } = useParams();
  const [hasBeenEdited, setHasBeenEdited] = useState(false);

  const { setTrackData } = useContext(TrackContext);
  const { setCollaborators } = useContext(CollaboratorContext);
  const { myAudios } = useAppSelector((state) => state.audios);
  const { audioId } = useAppSelector((state) => state.collaborators);

  useEffect(() => {
    if (myAudios.length > 0) {
      if (setTrackData) {
        const track = myAudios.find((audio) => audio.id === Number(id));
        // console.log(track);

        if (track) {
          setTrackData({
            ...track,
            genre: (track.genre as Genre).id,
            subGenre: (track.subGenre as SubGenre)?.id,
            moodType: (track.moodType as MoodType).id,
            audioKey: (track.audioKey as Key).id,
            instrumentId: (track.instrumentId as Instrument).id,
            language: (track.language as Language).id,
          });

          if (audioId !== track.id) {
            setCollaborators(track.collaborators ?? []);
          }
        }
        // TODO: fetch track by id
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StepperFormWrapper isEdit title="Track" backBtn={<AudioBackButton />}>
      <ContributorTrackForm
        hasBeenEdited={hasBeenEdited}
        setHasBeenEdited={setHasBeenEdited}
      />
    </StepperFormWrapper>
  );
}

const AudioBackButton = () => {
  const navigate = useNavigate();
  const { setTrackData } = useContext(TrackContext);

  const handleEditBack = async () => {
    setTrackData(initialTrackFieldsData);
    localStorage.removeItem(TEMP_TRACK_ID);
    localStorage.removeItem(TEMP_AUDIO_FILE_MP3_ID);
    localStorage.removeItem(TEMP_AUDIO_FILE_WAV_ID);
    localStorage.removeItem(TEMP_AUDIO_FILE_ZIP_ID);
    navigate(-1);
  };

  return (
    // <CustomDialog
    //   title="Save and Exit or Delete"
    //   bodyText="Delete the audio or save the audio as draft and exit?"
    //   cancelText="Save as Draft"
    //   confirmText="Delete Audio"
    //   handleCancel={() => navigate(-1)}
    //   handleConfirm={handleDelete}
    // >
    <Button variant="plain" color="white" onClick={handleEditBack}>
      <ArrowLeft />
    </Button>
  );
};
