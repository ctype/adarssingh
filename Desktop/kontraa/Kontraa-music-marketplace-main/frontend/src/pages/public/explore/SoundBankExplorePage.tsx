import { useEffect, useState } from "react";
import { Box, Grid, GridItem } from "@chakra-ui/react";

import MaxWidthWrapper from "@/wrappers/MaxWidthWrapper";
import HeroSection from "@/components/landing/HeroSection";
import TagSelectionSection from "@/components/music/TagSelectionSection";

import { useAppDispatch, useAppSelector } from "@/app/store";
import { fetchSoundBanks } from "@/features/soundBank/soundBankSlice";
import MusicCardSkeleton from "@/components/loader/MusicCardSkeleton";
import SoundBankPresetExploreCard from "./_components/SoundBankPresetExploreCard";
import NoDataComponent from "@/components/global/NoDataComponent";
import { useSearchParams } from "react-router-dom";

export default function SoundBankExplorePage() {
  const [query] = useSearchParams();
  const searchTerm = query.get("search");
  const dispatch = useAppDispatch();
  const { soundBanks, isPending } = useAppSelector((state) => state.soundBanks);
  const [filter, setFilter] = useState<IBaseFilterOptions>({
    sortBy: "createdAt",
    order: 1,
    limit: 40,
    offset: 0,
    search: null,
  });

  useEffect(() => {
    dispatch(
      fetchSoundBanks({
        filter: { ...filter, search: searchTerm, isDraft: false, status: 1 },
      })
    ).unwrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, searchTerm]);

  return (
    <Box>
      <HeroSection title="Treasures Of Soundbank" landingHero={false} />
      <MaxWidthWrapper>
        <Box py={10} minH="100vh">
          <TagSelectionSection
            tags={[]}
            title="Explore sound banks"
            selectedTag={0}
            defaultSort={filter.sortBy ?? "latest"}
            onSortChange={(sort) =>
              setFilter((prev) => ({
                ...prev,
                sortBy: sort === "latest" ? "createdAt" : "soundEffectTitle",
                order: sort === "alphaReverse" ? -1 : 1,
              }))
            }
          />
          <Grid
            gap={4}
            templateColumns={{
              base: "repeat(2, 1fr)",
              smToMd: "repeat(2, 1fr)",
              mdToLg: "repeat(3, 1fr)",
              lgToXl: "repeat(4, 1fr)",
              xlTo2xl: "repeat(5, 1fr)",
              "2xl": "repeat(6, 1fr)",
            }}
            placeItems="center"
            padding={0}
            margin={0}
            my={10}
          >
            {isPending ? (
              <>
                {Array.from({ length: 21 }).map((_, i) => (
                  <MusicCardSkeleton key={i} />
                ))}
              </>
            ) : soundBanks.length <= 0 ? (
              <GridItem colSpan={7}>
                <NoDataComponent noFoundText="No Sound banks found" />
              </GridItem>
            ) : (
              <>
                {soundBanks.map((item) => (
                  <SoundBankPresetExploreCard
                    audioUrl={
                      import.meta.env.VITE_AWS_BUCKET_LINK + item.mp3Files?.[0]
                    }
                    key={item.id}
                    sound={item}
                    type={"sound-banks"}
                  />
                ))}
              </>
            )}
          </Grid>
        </Box>
      </MaxWidthWrapper>
    </Box>
  );
}
