import { useContext, useEffect, useState } from "react";

import { TrackContext } from "./context/TrackContext";
import { initialTrackFieldsData } from "./utils/trackOptions";
import StepperFormWrapper from "@/wrappers/StepperFormWrapper";
import { CollaboratorContext } from "../context/CollaboratorContext";
import ContributorTrackForm from "./_components/ContributorTrackForm";
import OnBackButton from "../_components/OnBackButton";

export default function ContributorTrackAdd() {
  const [hasBeenEdited, setHasBeenEdited] = useState(false);
  const { setTrackData } = useContext(TrackContext);
  const { collaborators, setCollaborators } = useContext(CollaboratorContext);

  useEffect(() => {
    setTrackData(initialTrackFieldsData);
    if (collaborators.length > 0) {
      setCollaborators([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StepperFormWrapper
      title="Track"
      backBtn={
        <OnBackButton
          hasBeenEdited={hasBeenEdited}
          setHasBeenEdited={setHasBeenEdited}
          type="audio"
        />
      }
    >
      <ContributorTrackForm
        hasBeenEdited={hasBeenEdited}
        setHasBeenEdited={setHasBeenEdited}
      />
    </StepperFormWrapper>
  );
}
