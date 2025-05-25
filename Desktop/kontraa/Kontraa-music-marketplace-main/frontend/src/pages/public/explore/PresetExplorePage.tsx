import { useEffect, useState } from "react";
import { Box, Grid, GridItem } from "@chakra-ui/react";

import MaxWidthWrapper from "@/wrappers/MaxWidthWrapper";
import HeroSection from "@/components/landing/HeroSection";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { fetchPresets } from "@/features/preset/presetSlice";
import NoDataComponent from "@/components/global/NoDataComponent";
import MusicCardSkeleton from "@/components/loader/MusicCardSkeleton";
import TagSelectionSection from "@/components/music/TagSelectionSection";
import SoundBankPresetExploreCard from "./_components/SoundBankPresetExploreCard";
import { useSearchParams } from "react-router-dom";

export default function PresetExplorePage() {
  const [query] = useSearchParams();
  const searchTerm = query.get("search");
  const dispatch = useAppDispatch();
  const { presets, isPending } = useAppSelector((state) => state.presets);
  const [filter, setFilter] = useState<IBaseFilterOptions>({
    sortBy: "createdAt",
    order: 1,
    limit: 40,
    offset: 0,
    search: null,
  });

  useEffect(() => {
    dispatch(
      fetchPresets({
        filter: { ...filter, search: searchTerm, isDraft: false, status: 1 },
      })
    ).unwrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, searchTerm]);

  return (
    <Box>
      <HeroSection landingHero={false} title="Preset For All Types" />
      <MaxWidthWrapper>
        <Box py={10} minH="100vh">
          <TagSelectionSection
            tags={[]}
            selectedTag={0}
            title="Explore Presets"
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
            gap={2}
            padding={0}
            margin={0}
            my={"auto"}
            templateColumns={{
              base: "repeat(2, 1fr)",
              smToMd: "repeat(2, 1fr)",
              mdToLg: "repeat(3, 1fr)",
              lgToXl: "repeat(4, 1fr)",
              xlTo2xl: "repeat(5, 1fr)",
              "2xl": "repeat(6, 1fr)",
            }}
            placeItems={"center"}
          >
            {isPending ? (
              <>
                {Array.from({ length: 21 }).map((_, i) => (
                  <MusicCardSkeleton key={i} />
                ))}
              </>
            ) : presets.length <= 0 ? (
              <GridItem colSpan={7}>
                <NoDataComponent noFoundText="No Presets found" />
              </GridItem>
            ) : (
              <>
                {presets.map((item) => (
                  <SoundBankPresetExploreCard
                    audioUrl={
                      import.meta.env.VITE_AWS_BUCKET_LINK + item.mp3Files?.[0]
                    }
                    key={item.id}
                    sound={item}
                    type={"presets"}
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
