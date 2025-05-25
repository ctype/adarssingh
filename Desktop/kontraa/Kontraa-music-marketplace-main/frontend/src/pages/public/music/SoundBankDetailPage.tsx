import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/app/store";
import DetailPageWrapper from "./wrapper/DetailPageWrapper";
import { fetchSoundBanks } from "@/features/soundBank/soundBankSlice";
import MusicWaveCard from "@/components/music/MusicWaveCard";

export default function SoundBankDetailPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { soundBanks } = useAppSelector((state) => state.soundBanks);
  const [soundBank, setSoundBank] = useState<SoundBank | undefined>();

  useEffect(() => {
    if (soundBanks.length <= 0) {
      dispatch(fetchSoundBanks({ filter: {} }))
        .unwrap()
        .then((d) => {
          setSoundBank(
            d.soundBanks.find(
              (soundBank: SoundBank) => soundBank.id === Number(id)
            )
          );
        });
    } else {
      setSoundBank(soundBanks.find((soundBank) => soundBank.id === Number(id)));
    }
  }, [id, dispatch, soundBanks]);

  return (
    <DetailPageWrapper
      entityName="SoundBank"
      entityId={soundBank?.id || 0}
      description={soundBank?.description || ""}
      relatedTracks={soundBanks}
    >
      <MusicWaveCard
        preset={false}
        showVolume
        waveId={`wave2`}
        track={soundBank!}
        trackType="SoundBank"
        audioUrl={import.meta.env.VITE_AWS_BUCKET_LINK + soundBank?.mp3Files[0]}
        trackInfo={{
          year: soundBank?.createdAt
            ? new Date(soundBank.createdAt).getFullYear()
            : "2024",
          "genre mix": (soundBank?.genreMix as GenreMix)?.name,
        }}
      />
    </DetailPageWrapper>
  );
}

// export const SoundTab = () => {
//   return (
//     <Tabs.Root
//       rounded="1rem"
//       p={0}
//       size="lg"
//       my={6}
//       defaultValue={"1"}
//       variant={"enclosed"}
//     >
//       <Tabs.List backgroundColor={"gray.700"}>
//         <Tabs.Trigger
//           value="1"
//           _focus={{
//             backgroundColor: "gray.950",
//           }}
//           _selected={{
//             backgroundColor: "gray.950",
//           }}
//           _hover={{
//             backgroundColor: "gray.800",
//           }}
//           color={"white"}
//         >
//           License
//         </Tabs.Trigger>
//         <Tabs.Trigger
//           value="2"
//           _focus={{
//             backgroundColor: "gray.950",
//           }}
//           _selected={{
//             backgroundColor: "gray.950",
//           }}
//           _hover={{
//             backgroundColor: "gray.800",
//           }}
//           color={"white"}
//         >
//           Download Includes
//         </Tabs.Trigger>
//       </Tabs.List>

//       <Tabs.Content value="1">hi</Tabs.Content>
//       <Tabs.Content value="2">Bye</Tabs.Content>
//     </Tabs.Root>
//   );
// };
