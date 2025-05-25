import ReactPlayer from "react-player";
import { useEffect, useState } from "react";
import { Download, Heart, Video } from "lucide-react";
import { Box, Flex, GridItem, SimpleGrid, Text } from "@chakra-ui/react";

import { Button } from "@/components/ui/button";
import MaxWidthWrapper from "@/wrappers/MaxWidthWrapper";
import HeroSection from "@/components/landing/HeroSection";
import TagSelectionSection from "@/components/music/TagSelectionSection";

import { fetchVideos } from "@/features/video/videoSlice";
import { useAppDispatch, useAppSelector } from "@/app/store";
import PhotoVideoCardSkeleton from "@/components/loader/PhotoVideoCardSkeleton";
import { fetchPhotoVideoCategories } from "@/features/category/photoVideoCategorySlice";
import NoDataComponent from "@/components/global/NoDataComponent";
import { useDownload } from "@/hooks/useDownload";
import { useLikeUnlike } from "@/hooks/useLikeUnlike";
import ShareButton from "@/components/public/ShareButton";

export default function VideoExplorePage() {
  const dispatch = useAppDispatch();
  const { photoVideoCategories, isPending } = useAppSelector(
    (state) => state.photoVideoCategories
  );
  const { videos } = useAppSelector((state) => state.videos);

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSort, setSelectedSort] = useState<string>("createdAt");

  useEffect(() => {
    (async () => {
      await dispatch(fetchPhotoVideoCategories()).unwrap();
    })();
  }, [dispatch]);

  useEffect(() => {
    // TODO: SORTING AND FILTERING FROM SERVER OR FRONTEND
    (async () => {
      const sort = selectedSort === "createdAt" ? selectedSort : "photoTitle";
      await dispatch(
        fetchVideos({
          order: selectedSort !== "alpha" ? -1 : 1,
          sortBy: sort,
          category: selectedCategory,
        })
      ).unwrap();
    })();
  }, [dispatch, selectedCategory, selectedSort]);

  return (
    <Box>
      <HeroSection landingHero={false} title="Stock videos for every taste" />
      <MaxWidthWrapper>
        <Box py={10} minH="100vh">
          <TagSelectionSection
            tags={photoVideoCategories.map((c) => ({
              name: c.name,
              value: c.id,
            }))}
            selectedTag={selectedCategory || 0}
            title="View Videos"
            defaultSort={selectedSort}
            onSortChange={(sort) => setSelectedSort(sort)}
            onTagSelect={(tag) => setSelectedCategory(tag)}
            isLoading={isPending}
          />
          <SimpleGrid my={10} minChildWidth={{ base: 300, lg: 320 }} gap={4}>
            {isPending ? (
              <>
                {Array.from({ length: 20 }).map((_, i) => (
                  <PhotoVideoCardSkeleton key={i} />
                ))}
              </>
            ) : videos.length <= 0 ? (
              <NoDataComponent noFoundText="No Videos Found" />
            ) : (
              <>
                {videos.map((video, i) => (
                  <GridItem key={i}>
                    <VideoCard video={video} />
                  </GridItem>
                ))}
              </>
            )}
          </SimpleGrid>
        </Box>
      </MaxWidthWrapper>
    </Box>
  );
}

interface IVideoCardProps {
  video: Video;
}
const VideoCard = ({ video }: IVideoCardProps) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const { handleLikeUnlike, liked } = useLikeUnlike({
    entityId: video.id,
    entityName: "Video",
  });
  const { handleDownload } = useDownload();

  return (
    <Box
      margin={1}
      position={"relative"}
      height={"100%"}
      alignItems={"center"}
      maxWidth={400}
      _hover={{
        "& .icon": {
          display: "none",
        },
        "& .actions": {
          display: "flex",
        },
      }}
      onMouseEnter={() => {
        setIsPlaying(true);
      }}
      onMouseLeave={() => {
        setIsPlaying(false);
      }}
    >
      <ReactPlayer
        config={{ file: { attributes: { controlsList: "nodownload" } } }}
        playing={isPlaying}
        url={(import.meta.env.VITE_AWS_BUCKET_LINK + video.videoFile) as string}
        controls={false}
        width="100%"
        minH={200}
        height="full"
        style={{
          borderRadius: "1rem",
          objectFit: "cover",
        }}
      />
      <Text
        color={"white"}
        position={"absolute"}
        className={"icon"}
        left={4}
        bottom={4}
      >
        {video.videoTitle}
      </Text>
      <Flex
        display={"none"}
        w={"full"}
        className="actions"
        position={"absolute"}
        top={6}
        px={2}
        justify={"space-between"}
      >
        <Flex gap={2} w={"105px"}>
          <Button
            onClick={handleLikeUnlike}
            backgroundColor={"gray.800"}
            py={2}
            px={4}
            rounded={"full"}
            display={"flex"}
            alignItems={"center"}
            color={"white"}
            gap={2}
          >
            {liked ? (
              <Heart size={24} fill="red" stroke="red" />
            ) : (
              <Heart size={24} />
            )}{" "}
            {video.upVoteCount}
          </Button>
          <Button
            onClick={() =>
              handleDownload(
                video.videoFile,
                `kontraa-${video.videoTitle}.mp4`,
                "video",
                "free",
                "Video",
                video.id
              )
            }
            backgroundColor={"gray.800"}
            color={"white"}
            p={2}
            rounded={"full"}
          >
            <Download size={24} />
          </Button>

          <ShareButton shareLink={window.location.href} />
        </Flex>
      </Flex>
      <Box
        position={"absolute"}
        backgroundColor={"gray.700/80"}
        rounded={"full"}
        p={2}
        top={"40%"}
        left={"50%"}
        translateX={"-50%"}
        translateY={"-50%"}
        className={"icon"}
      >
        <Video color="white" />
      </Box>
    </Box>
  );
};
