import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import { useAppSelector } from "@/app/store";
import { SoundBankContext } from "./context/SoundBankContext";
import StepperFormWrapper from "@/wrappers/StepperFormWrapper";
import { CollaboratorContext } from "../context/CollaboratorContext";
import ContributorSoundBankForm from "./_components/ContributorSoundBankForm";

export default function ContributorSoundBankEdit() {
  const { id } = useParams();
  const [hasBeenEdited, setHasBeenEdited] = useState(false);

  const { setSoundBankData } = useContext(SoundBankContext);
  const { setCollaborators } = useContext(CollaboratorContext);
  const { mySoundBanks } = useAppSelector((state) => state.soundBanks);
  const { audioId } = useAppSelector((state) => state.collaborators);

  useEffect(() => {
    if (mySoundBanks.length > 0) {
      const soundBank = mySoundBanks.find(
        (soundbank) => soundbank.id === Number(id)
      );

      if (soundBank) {
        setSoundBankData({
          ...soundBank,
          genreMix: (soundBank.genreMix as GenreMix).id,
          numberOfFiles: soundBank.numberOfFiles,
        });

        if (audioId !== soundBank.id) {
          setCollaborators(soundBank.collaborators ?? []);
        }
        // TODO: fetch track by id
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StepperFormWrapper title="Sound Bank" isEdit>
      <ContributorSoundBankForm
        hasBeenEdited={hasBeenEdited}
        setHasBeenEdited={setHasBeenEdited}
      />
    </StepperFormWrapper>
  );
}
