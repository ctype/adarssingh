import { useEffect } from "react";
import { GridItem } from "@chakra-ui/react";

import GridViewWrapper from "@/wrappers/GridViewWrapper";
import { fetchMyAudios } from "@/features/audio/audioSlice";
import { useAppDispatch, useAppSelector } from "@/app/store";
import ContributorTrackCard from "./_components/ContributorTrackCard";

export default function ContributorTrackList() {
  const dispatch = useAppDispatch();
  const { myAudios, isPending } = useAppSelector((state) => state.audios);

  useEffect(() => {
    if (myAudios.length <= 0) {
      dispatch(fetchMyAudios(1));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GridViewWrapper
      title="Music"
      hasAdd
      subtitle="Share your best moments"
      isEmpty={myAudios.length === 0}
      isLoading={isPending}
    >
      {myAudios.map((track, key) => (
        <GridItem key={key}>
          <ContributorTrackCard key={key} track={track} />
        </GridItem>
      ))}
    </GridViewWrapper>
  );
}
