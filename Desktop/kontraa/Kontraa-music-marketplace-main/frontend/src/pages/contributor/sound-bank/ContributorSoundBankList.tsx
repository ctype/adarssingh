import { useEffect } from "react";

import GridViewWrapper from "@/wrappers/GridViewWrapper";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { fetchMySoundBanks } from "@/features/soundBank/soundBankSlice";
import SoundBankPresetStudioCard from "./_components/SoundBankPresetStudioCard";

export default function ContributorPresetList() {
  const dispatch = useAppDispatch();
  const { mySoundBanks, isPending } = useAppSelector(
    (state) => state.soundBanks
  );

  useEffect(() => {
    if (mySoundBanks.length <= 0) {
      dispatch(fetchMySoundBanks(1)).unwrap();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GridViewWrapper
      title="Sound Bank"
      subtitle="Share your collections of best works"
      isEmpty={!isPending && mySoundBanks.length === 0}
      isLoading={isPending}
    >
      {mySoundBanks.map((soundBank) => (
        <SoundBankPresetStudioCard
          key={soundBank.id}
          id={soundBank.id}
          size={soundBank.fileIds?.find((f) => f.fileType === "mp3")?.size ?? 0}
          img={import.meta.env.VITE_AWS_BUCKET_LINK + soundBank.artworkFile}
          title={soundBank.title}
          status={soundBank.status}
          isDraft={soundBank.isDraft}
          type="sound-bank"
        />
      ))}
    </GridViewWrapper>
  );
}
