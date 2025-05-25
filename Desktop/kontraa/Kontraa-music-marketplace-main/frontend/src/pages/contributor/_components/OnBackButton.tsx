import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "@/app/store";
import { Button } from "@/components/ui/button";
import { deleteAudio } from "@/features/audio/audioSlice";
import CustomDialog from "@/components/global/CustomDialog";
import { deletePreset } from "@/features/preset/presetSlice";
import { deleteSoundBank } from "@/features/soundBank/soundBankSlice";
import {
  TEMP_AUDIO_FILE_MP3_ID,
  TEMP_AUDIO_FILE_WAV_ID,
  TEMP_AUDIO_FILE_ZIP_ID,
  TEMP_TRACK_ID,
} from "../utils/options";

export default function OnBackButton({
  hasBeenEdited,
  setHasBeenEdited,
  type,
}: {
  hasBeenEdited: boolean;
  setHasBeenEdited: React.Dispatch<React.SetStateAction<boolean>>;
  type: "audio" | "sound bank" | "preset";
}) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleCancel = () => {
    localStorage.removeItem(TEMP_TRACK_ID);
    localStorage.removeItem(TEMP_AUDIO_FILE_MP3_ID);
    localStorage.removeItem(TEMP_AUDIO_FILE_WAV_ID);
    localStorage.removeItem(TEMP_AUDIO_FILE_ZIP_ID);
    setHasBeenEdited(false);
    navigate(-1);
  };

  const handleDelete = async () => {
    const audioId = localStorage.getItem(TEMP_TRACK_ID);
    if (audioId) {
      if (type === "audio") {
        await dispatch(deleteAudio(Number(audioId))).finally(() => {
          handleCancel();
        });
      }
      if (type === "sound bank") {
        await dispatch(deleteSoundBank(Number(audioId))).finally(() => {
          handleCancel();
        });
      }
      if (type === "preset") {
        await dispatch(deletePreset(Number(audioId))).finally(() => {
          handleCancel();
        });
      }
    }
  };

  return (
    <>
      {hasBeenEdited ? (
        <CustomDialog
          title="Save and Exit or Delete"
          bodyText={`Delete the ${type} or save the ${type} as draft and exit?`}
          cancelText="Save as Draft"
          confirmText="Delete"
          handleCancel={handleCancel}
          handleConfirm={handleDelete}
        >
          <Button variant="plain" color="white">
            <ArrowLeft />
          </Button>
        </CustomDialog>
      ) : (
        <Button variant="plain" color="white" onClick={handleCancel}>
          <ArrowLeft />
        </Button>
      )}
    </>
  );
}
