import { useContext, useEffect, useState } from "react";

import { SoundBankContext } from "./context/SoundBankContext";
import StepperFormWrapper from "@/wrappers/StepperFormWrapper";
import { initialSoundBankFieldsData } from "./utils/soundBankOptions";
import { CollaboratorContext } from "../context/CollaboratorContext";
import ContributorSoundBankForm from "./_components/ContributorSoundBankForm";
import OnBackButton from "../_components/OnBackButton";

export default function ContributorSoundBankAdd() {
  const [hasBeenEdited, setHasBeenEdited] = useState(false);
  const { setSoundBankData } = useContext(SoundBankContext);
  const { collaborators, setCollaborators } = useContext(CollaboratorContext);

  useEffect(() => {
    setSoundBankData(initialSoundBankFieldsData);
    if (collaborators.length > 0) {
      setCollaborators([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StepperFormWrapper
      title="Sound Bank"
      backBtn={
        <OnBackButton
          hasBeenEdited={hasBeenEdited}
          setHasBeenEdited={setHasBeenEdited}
          type="sound bank"
        />
      }
    >
      <ContributorSoundBankForm
        hasBeenEdited={hasBeenEdited}
        setHasBeenEdited={setHasBeenEdited}
      />
    </StepperFormWrapper>
  );
}
