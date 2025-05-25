import { useEffect, useState } from "react";
import { Download, Heart } from "lucide-react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";

import { Button } from "@/components/ui/button";
import MaxWidthWrapper from "@/wrappers/MaxWidthWrapper";
import { fetchPhotos } from "@/features/photo/photoSlice";
import HeroSection from "@/components/landing/HeroSection";
import { useAppDispatch, useAppSelector } from "@/app/store";
import NoDataComponent from "@/components/global/NoDataComponent";
import TagSelectionSection from "@/components/music/TagSelectionSection";
import PhotoVideoCardSkeleton from "@/components/loader/PhotoVideoCardSkeleton";
import { fetchPhotoVideoCategories } from "@/features/category/photoVideoCategorySlice";
import { useDownload } from "@/hooks/useDownload";
import { useLikeUnlike } from "@/hooks/useLikeUnlike";
import ShareButton from "@/components/public/ShareButton";

export default function PhotoExplorePage() {
  const dispatch = useAppDispatch();
  const { photoVideoCategories, isPending: isPhotoVideoCategoryPending } =
    useAppSelector((state) => state.photoVideoCategories);
  const { photos, isPending: isPhotoPending } = useAppSelector(
    (state) => state.photos
  );

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
        fetchPhotos({
          order: selectedSort !== "alpha" ? -1 : 1,
          sortBy: sort,
          category: selectedCategory,
        })
      ).unwrap();
    })();
  }, [dispatch, selectedCategory, selectedSort]);

  return (
    <Box>
      <HeroSection landingHero={false} title="Stock Images And Photos" />
      <MaxWidthWrapper>
        <Box py={10} minH="100vh">
          <TagSelectionSection
            tags={photoVideoCategories.map((c) => ({
              name: c.name,
              value: c.id,
            }))}
            selectedTag={selectedCategory || 0}
            title="View Gallary"
            defaultSort={selectedSort}
            onSortChange={(sort) => setSelectedSort(sort)}
            onTagSelect={(tag) => setSelectedCategory(tag)}
            isLoading={isPhotoVideoCategoryPending}
          />
          <Flex my={10} gap={4} alignItems={"center"} flexWrap={"wrap"}>
            {isPhotoPending ? (
              <>
                {Array.from({ length: 20 }).map((_, i) => (
                  <PhotoVideoCardSkeleton key={i} />
                ))}
              </>
            ) : photos.length <= 0 ? (
              <NoDataComponent noFoundText="No Photos found" />
            ) : (
              <>
                {photos.map((photo) => (
                  <Box w={"350px"} key={photo.id}>
                    <ImageCard photoData={photo} />
                  </Box>
                ))}
              </>
            )}
          </Flex>
        </Box>
      </MaxWidthWrapper>
    </Box>
  );
}

interface IImageCardProps {
  photoData: Photo;
}
const ImageCard = function ({ photoData }: IImageCardProps) {
  const { handleDownload } = useDownload();
  const { handleLikeUnlike, liked } = useLikeUnlike({
    entityId: photoData.id,
    entityName: "Photo",
  });

  return (
    <Box
      cursor="pointer"
      position="relative"
      className="select-none"
      _hover={{
        "& .actions": { display: "flex" },
      }}
    >
      <Image
        src={import.meta.env.VITE_AWS_BUCKET_LINK + photoData.photoFile}
        alt={photoData.photoTitle}
        minH={250}
        // w={320}
        objectFit="cover"
        className="brightness-90 opacity-80"
      />
      <Text
        color={"white"}
        position={"absolute"}
        bottom={0}
        left={0}
        p={2}
        w={"full"}
        backgroundColor={"gray.600/60"}
      >
        {photoData.photoTitle}
      </Text>
      <Flex
        display={"none"}
        className="actions"
        w={"full"}
        position={"absolute"}
        top={6}
        px={2}
        justify={"space-between"}
      >
        <Flex gap={2} w={"105px"}>
          <Button
            backgroundColor={"gray.800"}
            py={2}
            px={4}
            rounded={"full"}
            onClick={handleLikeUnlike}
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
            {photoData.upVoteCount}
          </Button>
          <Button
            variant="plain"
            backgroundColor={"gray.800"}
            color={"white"}
            p={2}
            rounded={"full"}
            onClick={() =>
              handleDownload(
                photoData.photoFile as string,
                `kontraa-${photoData.photoTitle}.png`,
                "photo",
                "free",
                "Photo",
                photoData.id
              )
            }
          >
            <Download size={24} />
          </Button>
          <ShareButton shareLink={window.location.href} />
        </Flex>
      </Flex>
    </Box>
  );
};
