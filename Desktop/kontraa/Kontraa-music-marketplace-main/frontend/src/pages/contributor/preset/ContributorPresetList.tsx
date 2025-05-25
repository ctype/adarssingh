import { useEffect } from "react";

import GridViewWrapper from "@/wrappers/GridViewWrapper";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { fetchMyPresets } from "@/features/preset/presetSlice";
import SoundBankPresetStudioCard from "../sound-bank/_components/SoundBankPresetStudioCard";

export default function UserPresetList() {
  const dispatch = useAppDispatch();
  const { myPresets, isPending } = useAppSelector((state) => state.presets);

  useEffect(() => {
    if (myPresets.length <= 0) {
      dispatch(fetchMyPresets(1)).unwrap();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GridViewWrapper
      title="Preset"
      subtitle="Share your collection of best works"
      isEmpty={!isPending && myPresets.length === 0}
      isLoading={isPending}
    >
      {myPresets.map((preset) => (
        <SoundBankPresetStudioCard
          id={preset.id}
          key={preset.id}
          isDraft={preset.isDraft}
          title={preset.title}
          img={import.meta.env.VITE_AWS_BUCKET_LINK + preset.artworkFile}
          status={preset.status}
          size={preset.fileIds?.find((f) => f.fileType === "mp3")?.size ?? 0}
          type={"preset"}
        />
      ))}
    </GridViewWrapper>
  );
}
