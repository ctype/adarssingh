import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import DetailPageWrapper from "./wrapper/DetailPageWrapper";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { fetchPresets } from "@/features/preset/presetSlice";
import MusicWaveCard from "@/components/music/MusicWaveCard";

export default function PresetDetailPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { presets } = useAppSelector((state) => state.presets);
  const [preset, setPreset] = useState<Preset | undefined>();

  useEffect(() => {
    if (presets.length <= 0) {
      dispatch(fetchPresets({ filter: {} }))
        .unwrap()
        .then((d) => {
          setPreset(
            d.presets.find((preset: Preset) => preset.id === Number(id))
          );
        });
    } else {
      setPreset(presets.find((preset) => preset.id === Number(id)));
    }
  }, [id, dispatch, presets]);

  return (
    <DetailPageWrapper
      entityName="Preset"
      entityId={preset?.id || 0}
      description={preset?.description || ""}
      relatedTracks={presets}
    >
      <MusicWaveCard
        preset={false}
        showVolume
        waveId={`wave2`}
        track={preset!}
        trackType="Preset"
        audioUrl={import.meta.env.VITE_AWS_BUCKET_LINK + preset?.mp3Files[0]}
        trackInfo={{
          year: preset?.createdAt
            ? new Date(preset.createdAt).getFullYear()
            : "2024",
          "genre mix": (preset?.genreMix as GenreMix)?.name,
          "preset type": (preset?.presetType as PresetType)?.name,
        }}
      />
    </DetailPageWrapper>
  );
}
