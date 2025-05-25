import { useContext, useEffect, useState } from "react";

import { PresetContext } from "./context/PresetContext";
import StepperFormWrapper from "@/wrappers/StepperFormWrapper";
import { initialPresetFieldsData } from "./utils/presetOptions";
import { CollaboratorContext } from "../context/CollaboratorContext";
import ContributorPresetForm from "./_components/ContributorPresetForm";
import OnBackButton from "../_components/OnBackButton";

export default function ContributorPresetAdd() {
  const [hasBeenEdited, setHasBeenEdited] = useState(false);
  const { setPresetData } = useContext(PresetContext);
  const { collaborators, setCollaborators } = useContext(CollaboratorContext);

  useEffect(() => {
    setPresetData(initialPresetFieldsData);
    if (collaborators.length > 0) {
      setCollaborators([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StepperFormWrapper
      title="Preset"
      backBtn={
        <OnBackButton
          hasBeenEdited={hasBeenEdited}
          setHasBeenEdited={setHasBeenEdited}
          type="preset"
        />
      }
    >
      <ContributorPresetForm
        hasBeenEdited={hasBeenEdited}
        setHasBeenEdited={setHasBeenEdited}
      />
    </StepperFormWrapper>
  );
}
