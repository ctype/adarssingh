import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, GridItem, Image, Text } from "@chakra-ui/react";

import GridViewWrapper from "@/wrappers/GridViewWrapper";
import EditButton from "@/components/afterAuth/EditButton";
import { deletePhoto, fetchMyPhotos } from "@/features/photo/photoSlice";
import { useAppDispatch, useAppSelector } from "@/app/store";
import DeleteButton from "@/components/afterAuth/DeleteButton";

export default function ContributorPhotoList() {
  const dispatch = useAppDispatch();
  const { myPhotos, isPending } = useAppSelector((state) => state.photos);

  const handleDelete = async (id: number) => {
    await dispatch(deletePhoto(id)).unwrap();
  };

  useEffect(() => {
    if (myPhotos.length <= 0) {
      dispatch(fetchMyPhotos(1)).unwrap();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GridViewWrapper
      title="Photo"
      subtitle="Share your best moments"
      isLoading={isPending}
      isEmpty={myPhotos.length <= 0}
    >
      {myPhotos.map((photo) => (
        <GridItem key={photo.id}>
          <PhotoCard
            id={photo.id}
            imgSrc={photo.photoFile as string}
            imgTitle={photo.photoTitle}
            handleDelete={() => handleDelete(photo.id)}
          />
        </GridItem>
      ))}
    </GridViewWrapper>
  );
}

function PhotoCard({
  imgTitle,
  imgSrc,
  id,
  handleDelete,
}: {
  imgTitle: string;
  imgSrc: string;
  id: number;
  handleDelete: () => void;
}) {
  const navigate = useNavigate();

  return (
    <Box
      cursor="pointer"
      w={"full"}
      position="relative"
      className="select-none"
    >
      <Image
        src={import.meta.env.VITE_AWS_BUCKET_LINK + imgSrc}
        alt={imgTitle}
        h={250}
        w="full"
        objectFit="cover"
        opacity={0.8}
        brightness={0.9}
      />
      <Box position={"absolute"} top={0} left={0} right={0} bottom={0}>
        <Box
          backgroundColor={"blackAlpha.700"}
          position={"absolute"}
          bottom={"0"}
          left={"0"}
          right={"0"}
          py={3}
          px={2}
        >
          <Text color={"white"}>{imgTitle}</Text>
        </Box>

        <Box
          position={"absolute"}
          display={"flex"}
          gap={"2"}
          top={"2"}
          right={"2"}
        >
          <Box as="span" rounded={"md"} backgroundColor="black">
            <EditButton handleEdit={() => navigate(`edit/${id}`)} />
          </Box>
          <Box as="span" rounded={"md"} backgroundColor="black">
            <DeleteButton handleDelete={handleDelete} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
