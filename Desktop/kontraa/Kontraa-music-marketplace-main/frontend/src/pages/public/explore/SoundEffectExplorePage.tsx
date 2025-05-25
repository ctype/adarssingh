import { Link as ChakraLink, Box, Flex, Image, Text } from "@chakra-ui/react";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Download, Pause, Play } from "lucide-react";

import { useMusic } from "@/hooks/userMusic";
import { Button } from "@/components/ui/button";
import MaxWidthWrapper from "@/wrappers/MaxWidthWrapper";
import HeroSection from "@/components/landing/HeroSection";
import TagSelectionSection from "@/components/music/TagSelectionSection";

import { useDownload } from "@/hooks/useDownload";
import { useAppDispatch, useAppSelector } from "@/app/store";
import NoDataComponent from "@/components/global/NoDataComponent";
import { fetchSoundEffects } from "@/features/sound_effect/soundEffectSlice";
import SoundEffectCardSkeleton from "@/components/loader/SoundEffectCardSkeleton";

interface IBaseFilterOptions {
  sortBy: string;
  order: number;
  limit: number;
  offset: number;
  search: string | null;
}

export default function SoundEffectExplorePage() {
  const [query] = useSearchParams();
  const searchTerm = query.get("search");
  const dispatch = useAppDispatch();

  // Use filter state but avoid infinite fetch by using effect dependencies carefully
  const [filter, setFilter] = useState<IBaseFilterOptions>({
    sortBy: "createdAt",
    order: 1,
    limit: 40,
    offset: 0,
    search: searchTerm,
  });

  const { soundEffects, isPending } = useAppSelector(
    (state) => state.soundEffects
  );

  // Update search in filter when searchTerm changes
  useEffect(() => {
    setFilter((prev) => ({ ...prev, search: searchTerm }));
  }, [searchTerm]);

  // Fetch sound effects when filter changes (but avoid infinite loops)
  useEffect(() => {
    dispatch(
      fetchSoundEffects({
        filter: { ...filter, status: 0 },
      })
    ).unwrap().catch(console.error);
  }, [dispatch, filter.sortBy, filter.order, filter.limit, filter.offset, filter.search]);

  return (
    <Box>
      <HeroSection title="Sound effect to your liking" landingHero={false} />
      <MaxWidthWrapper>
        <Box py={10} minH="100vh">
          <TagSelectionSection
            tags={[]}
            title="Explore sound effects"
            selectedTag={0}
            defaultSort={filter.sortBy === "createdAt" ? "latest" : "alpha"}
            onSortChange={(sort) =>
              setFilter((prev) => ({
                ...prev,
                sortBy: sort === "latest" ? "createdAt" : "soundEffectTitle",
                order: sort === "alphaReverse" ? -1 : 1,
              }))
            }
          />
          <Flex direction="column" gap={4} padding={0} margin={0} my={10}>
            {isPending ? (
              Array.from({ length: 8 }).map((_, i) => (
                <SoundEffectCardSkeleton key={i} />
              ))
            ) : soundEffects?.length === 0 ? (
              <NoDataComponent noFoundText="No Sound effects found" />
            ) : (
              soundEffects?.map((item) => (
                <SoundCard
                  key={item.id}
                  id={item.id}
                  musicImage={
                    import.meta.env.VITE_AWS_BUCKET_LINK +
                    item.soundEffectArtworkFile
                  }
                  audioUrl={
                    import.meta.env.VITE_AWS_BUCKET_LINK + item.soundEffectMp3File
                  }
                  soundName={item.soundEffectTitle}
                  artistName={item.uploadedBy?.username ?? "Unknown"}
                  audioKey={item.soundEffectMp3File}
                />
              ))
            )}
          </Flex>
        </Box>
      </MaxWidthWrapper>
    </Box>
  );
}

interface SoundCardProps {
  audioUrl: string;
  audioKey: string;
  musicImage: string;
  soundName: string;
  artistName?: string;
  time?: string;
  id: number;
}

export const SoundCard: React.FC<SoundCardProps> = ({
  audioUrl,
  audioKey,
  musicImage,
  soundName,
  artistName,
  id,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const waveHeight = 50;
  const { isPlaying, handlePlay } = useMusic({
    audioUrl,
    containerRef,
    waveHeight,
  });
  const { handleDownload } = useDownload();

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={4}
      justifyContent="space-between"
      py={2}
    >
      <Flex gap={2} alignItems="center">
        <Box position="relative">
          <Button
            p={2}
            rounded="full"
            backgroundColor="blackAlpha.700"
            _hover={{ backgroundColor: "gray" }}
            onClick={handlePlay}
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            zIndex="overlay"
            aria-label={isPlaying ? "Pause sound" : "Play sound"}
          >
            {isPlaying ? (
              <Pause size={18} fill="white" color="white" />
            ) : (
              <Play size={18} fill="white" color="white" />
            )}
          </Button>

          <Image
            minW="80px"
            maxW="100px"
            aspectRatio="square"
            rounded="md"
            src={musicImage}
            alt={`Artwork for sound effect: ${soundName}`}
            objectFit="cover"
            position="relative"
            cursor="pointer"
          />
        </Box>

        <Flex direction="column" gap={1} w="full" maxW={{ base: "100px", md: "100%" }}>
          <Text textTransform="uppercase" isTruncated>
            {soundName}
          </Text>

          <Flex alignItems="center" justifyContent="space-between">
            <Text textDecoration="underline" whiteSpace="nowrap">
              <ChakraLink
                as={RouterLink}
                to={`/profile/${artistName}`}
                color="gray.300"
                isTruncated
                maxW="100px"
              >
                {artistName}
              </ChakraLink>
            </Text>
          </Flex>
        </Flex>
      </Flex>

      <Flex alignItems="center" gap={2}>
        <Box
          display={{ base: "none", md: "block" }}
          id={`wave-${id}`}
          w="200px"
          ref={containerRef}
        />
        <Button
          variant="plain"
          _hover={{
            backgroundColor: "gray.600",
          }}
          color="white"
          onClick={() =>
            handleDownload(
              audioKey,
              `kontraa-${soundName}.mp3`,
              "mp3",
              "free",
              "SoundEffect",
              id
            )
          }
          aria-label={`Download ${soundName} sound effect`}
        >
          <Download size={18} color="white" />
          Download
        </Button>
      </Flex>
    </Box>
  );
};
