import { useWavesurfer } from "@wavesurfer/react";
import React, { useCallback, useEffect, useState } from "react";

interface useMusicProps {
  audioUrl: string;
  waveHeight: number;
  containerRef: React.RefObject<HTMLDivElement>;
}
export const useMusic = (props: useMusicProps) => {
  const { audioUrl, waveHeight, containerRef } = props;
  const { isPlaying, wavesurfer, isReady } = useWavesurfer({
    container: containerRef,
    url: audioUrl,
    height: waveHeight,
    waveColor: "#73747c",
    progressColor: "white",
    cursorWidth: 0,
    cursorColor: "green",
    dragToSeek: true,
    barGap: 1,
    barWidth: 2,
    barHeight: 0.5,
  });

  const [playTime, setPlayTime] = useState<string>("00:00");
  // const [processTime, setProcessTime] = useState<number>(0);

  useEffect(() => {
    if (isReady && wavesurfer) {
      const playTimeInSecond = wavesurfer?.getDuration();
      const minutes = Math.floor(playTimeInSecond / 60);
      const remainingSeconds = Math.floor(playTimeInSecond % 60);

      const formattedMinutes = String(minutes).padStart(2, "0");
      const formattedSeconds = String(remainingSeconds).padStart(2, "0");

      setPlayTime(`${formattedMinutes}:${formattedSeconds}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  const handleVolumeChange = useCallback(
    (changeVol: number) => {
      if (wavesurfer) {
        wavesurfer.setVolume(changeVol);
      }
    },
    [wavesurfer]
  );

  const handlePlay = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (wavesurfer) {
        wavesurfer.playPause();
      }
    },
    [wavesurfer]
  );

  return {
    isPlaying,
    playTime,
    handlePlay,
    handleVolumeChange,
  };
};
