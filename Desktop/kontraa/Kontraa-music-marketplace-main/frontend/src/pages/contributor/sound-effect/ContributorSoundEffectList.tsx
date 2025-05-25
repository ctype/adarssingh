import { useEffect } from "react";
import { GridItem } from "@chakra-ui/react";

import GridViewWrapper from "@/wrappers/GridViewWrapper";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { fetchMySoundEffects } from "@/features/sound_effect/soundEffectSlice";
import SoundEffectStudioCard from "./_components/SoundEffectStudioCard";

export default function ContributorPresetList() {
  const dispatch = useAppDispatch();
  const { mySoundEffects, isPending } = useAppSelector(
    (state) => state.soundEffects
  );

  useEffect(() => {
    if (mySoundEffects.length <= 0) {
      dispatch(fetchMySoundEffects(1)).unwrap();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GridViewWrapper
      title="Sound Effect"
      subtitle="Share your best works"
      isLoading={isPending && mySoundEffects.length <= 0}
      isEmpty={mySoundEffects.length <= 0 && !isPending}
    >
      {mySoundEffects.map((soundEffect) => (
        <GridItem key={soundEffect.id}>
          <SoundEffectStudioCard soundEffect={soundEffect} />
        </GridItem>
      ))}
    </GridViewWrapper>
  );
}
