import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useNavigate } from "react-router-dom";
import { Box, GridItem, Text } from "@chakra-ui/react";

import GridViewWrapper from "@/wrappers/GridViewWrapper";
import EditButton from "@/components/afterAuth/EditButton";
import DeleteButton from "@/components/afterAuth/DeleteButton";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { deleteVideo, fetchMyVideos } from "@/features/video/videoSlice";

export default function ContributorVideoList() {
  const dispatch = useAppDispatch();
  const { myVideos, isPending } = useAppSelector((state) => state.videos);

  const handleDelete = (id: number) => {
    dispatch(deleteVideo(id)).unwrap();
  };

  useEffect(() => {
    if (myVideos.length <= 0) {
      dispatch(fetchMyVideos(1)).unwrap();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GridViewWrapper
      title="Video"
      subtitle="Share your best moments"
      isEmpty={!isPending && myVideos.length <= 0}
      isLoading={isPending}
    >
      {myVideos.map((video) => (
        <GridItem key={video.id}>
          <VideoCard
            id={video.id}
            videoSrc={
              (import.meta.env.VITE_AWS_BUCKET_LINK + video.videoFile) as string
            }
            videoTitle={video.videoTitle}
            handleDelete={() => handleDelete(video.id)}
          />
        </GridItem>
      ))}
    </GridViewWrapper>
  );
}

function VideoCard({
  videoTitle,
  videoSrc,
  id,
  handleDelete,
}: {
  videoTitle: string;
  videoSrc: string;
  id: number;
  handleDelete: () => void;
}) {
  const navigate = useNavigate();
  // const [control, setControl] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  return (
    <Box
      cursor="pointer"
      position="relative"
      className="select-none"
      maxH={"full"}
      maxW={400}
      _hover={{
        "& .actions": {
          display: "flex",
        },
      }}
      onMouseEnter={() => {
        // setControl(true);
        setIsPlaying(true);
      }}
      onMouseLeave={() => {
        // setControl(false);
        setIsPlaying(false);
      }}
    >
      <ReactPlayer
        playing={isPlaying}
        url={videoSrc}
        controls={false}
        width="100%"
        height="full"
        style={{
          borderRadius: "1rem",
          objectFit: "cover",
        }}
      />
      <Box className="actions" display={"none"}>
        <Box
          backgroundColor={"blackAlpha.700"}
          position={"absolute"}
          bottom={"0"}
          left={"0"}
          right={"0"}
          py={3}
          px={2}
        >
          <Text color={"white"}>{videoTitle}</Text>
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
