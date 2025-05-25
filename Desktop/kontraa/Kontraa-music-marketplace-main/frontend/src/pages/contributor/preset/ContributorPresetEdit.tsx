import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import { useAppSelector } from "@/app/store";
import { PresetContext } from "./context/PresetContext";
import StepperFormWrapper from "@/wrappers/StepperFormWrapper";
import { CollaboratorContext } from "../context/CollaboratorContext";
import ContributorPresetForm from "./_components/ContributorPresetForm";

export default function ContributorPresetEdit() {
  const { id } = useParams();
  const [hasBeenEdited, setHasBeenEdited] = useState(false);

  const { setPresetData } = useContext(PresetContext);
  const { setCollaborators } = useContext(CollaboratorContext);
  const { myPresets } = useAppSelector((state) => state.presets);
  const { audioId } = useAppSelector((state) => state.collaborators);

  useEffect(() => {
    if (myPresets.length > 0) {
      const presetData = myPresets.find((preset) => preset.id === Number(id));
      // console.log(presetData);

      if (presetData) {
        setPresetData({
          ...presetData,
          genreMix: (presetData.genreMix as GenreMix).id,
          presetType: (presetData.presetType as PresetType).id,
        });

        if (audioId !== presetData.id) {
          setCollaborators(presetData.collaborators ?? []);
        }
        // TODO: fetch track by id
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StepperFormWrapper title="Preset" isEdit>
      <ContributorPresetForm
        hasBeenEdited={hasBeenEdited}
        setHasBeenEdited={setHasBeenEdited}
      />
    </StepperFormWrapper>
  );
}
