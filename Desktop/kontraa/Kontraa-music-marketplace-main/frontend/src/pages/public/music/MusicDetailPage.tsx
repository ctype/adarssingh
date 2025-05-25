import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { fetchAudios } from "@/features/audio/audioSlice";
import DetailPageWrapper from "./wrapper/DetailPageWrapper";
import { useAppDispatch, useAppSelector } from "@/app/store";
import MusicWaveCard from "@/components/music/MusicWaveCard";

export default function MusicDetailPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { audios } = useAppSelector((state) => state.audios);
  const [track, setTrack] = useState<Track | undefined>();

  useEffect(() => {
    if (audios.length <= 0) {
      dispatch(fetchAudios({ filter: { isDraft: false, status: 1 } }))
        .unwrap()
        .then((d) => {
          setTrack(d.audios.find((audio: Track) => audio.id === Number(id)));
        });
    } else {
      setTrack(audios.find((audio) => audio.id === Number(id)));
    }
  }, [id, dispatch, audios]);

  return (
    <DetailPageWrapper
      entityName="Track"
      entityId={track?.id || 0}
      description={track?.description || ""}
      relatedTracks={audios}
    >
      <MusicWaveCard
        preset={false}
        showVolume={true}
        waveId={`wave2`}
        track={track!}
        trackType="Track"
        audioUrl={import.meta.env.VITE_AWS_BUCKET_LINK + track?.mp3File}
        trackInfo={{
          year: track?.createdAt
            ? new Date(track.createdAt).getFullYear()
            : "2024",
          genres: (track?.genre as Genre)?.name,
          bpm: track?.audioBpm?.toString() || "",
          mood: (track?.moodType as MoodType)?.name,
          key: (track?.audioKey as Key)?.name,
          lang: (track?.language as Language)?.name,
        }}
      />
    </DetailPageWrapper>
  );
}
