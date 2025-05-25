import { useNavigate } from "react-router-dom";
import { AudioLines, FileMusic } from "lucide-react";
import { Card, Text, VStack, Flex, Image, Box } from "@chakra-ui/react";

import { Tag } from "@/components/ui/tag";
import { useAppDispatch } from "@/app/store";
import {
  deleteAudio,
  // updateAudio
} from "@/features/audio/audioSlice";
import EditButton from "@/components/afterAuth/EditButton";
import DeleteButton from "@/components/afterAuth/DeleteButton";
// import { Button } from "@/components/ui/button";
// import { toaster } from "@/components/ui/toaster";

const ContributorTrackCard = function ({
  track,
  hideActions = false,
}: {
  track: Track;
  hideActions?: boolean;
}) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // const handleSendToReview = async () => {
  //   await dispatch(
  //     updateAudio({
  //       id: track.id,
  //       data: {
  //         status: 3,
  //         fileIds: (track.fileIds as TrackFile[]).map((t) => t.id),
  //       },
  //     })
  //   )
  //     .unwrap()
  //     .then(() => {
  //       toaster.create({
  //         type: "success",
  //         title: "Sent for Review",
  //         description: "Your track will be revewied soon",
  //       });
  //     });
  // };

  const handleDelete = async () => {
    dispatch(deleteAudio(track.id)).unwrap();
  };

  return (
    <Card.Root
      _hover={{ backgroundColor: "black" }}
      justifyContent="center"
      alignItems="center"
      backgroundColor={"#000"}
      border={"none"}
      color={"white"}
      userSelect={"none"}
      width={"full"}
      display={"flex"}
      flexDirection={"column"}
      gap={2}
      padding={3}
    >
      <Card.Body padding={0} w={"full"} position={"relative"} textAlign="left">
        <Image
          alt={track.title}
          src={import.meta.env.VITE_AWS_BUCKET_LINK + track.artworkFile}
          borderRadius="5px"
          height={"230px"}
          w={"full"}
        />
        {!hideActions && (
          <Box position={"absolute"} top={0} left={0} right={0} bottom={0}>
            <Flex gap={2} position={"absolute"} top={2} right={2}>
              <Box as="span" rounded={"md"} backgroundColor="black">
                <EditButton handleEdit={() => navigate(`edit/${track.id}`)} />
              </Box>
              <Box as="span" rounded={"md"} backgroundColor="black">
                <DeleteButton handleDelete={handleDelete} />
              </Box>
            </Flex>
            <Tag
              position={"absolute"}
              bottom={2}
              left={2}
              size={"lg"}
              rounded="full"
              px={6}
              py={1}
              colorPalette={
                track.isDraft
                  ? "gray"
                  : track.status === 0
                  ? "orange"
                  : track.status === 1
                  ? "green"
                  : track.status === 2
                  ? "red"
                  : "yellow"
              }
            >
              {track.isDraft
                ? "Draft"
                : track.status === 0
                ? "Pending"
                : track.status === 1
                ? "Approved"
                : track.status === 2
                ? "Rejected"
                : "In Review"}
            </Tag>
            {/* TODO: Enable in next release */}
            {/* {track.status === 2 && (
              <Button
                position={"absolute"}
                right={2}
                top={14}
                size="sm"
                backgroundColor={"black"}
                color={"white"}
                title="Send to review by admin"
                onClick={handleSendToReview}
              >
                Send to Review
              </Button>
            )} */}
          </Box>
        )}
      </Card.Body>
      <Card.Footer w="full" textAlign="left" padding={0}>
        <VStack alignItems="initial" gap={0.5} w="100%">
          <Text
            fontSize="md"
            textAlign="left"
            color="secondary"
            fontWeight="semibold"
          >
            {track.title}
          </Text>
          <Text
            fontSize="sm"
            color="gray.400"
            display={"flex"}
            alignItems={"center"}
            gap={1}
          >
            <AudioLines size={18} /> {track.audioBpm} BPM
          </Text>
          {track.fileIds && track.fileIds.length > 0 && (
            <Text
              fontSize="sm"
              color="gray.400"
              display={"flex"}
              alignItems={"center"}
              gap={1}
            >
              <FileMusic size={18} />
              {(
                ((
                  track.fileIds.find(
                    (tf) => (tf as TrackFile).fileType === "wav"
                  ) as TrackFile
                )?.size ?? 1024) / 1024
              ).toPrecision(2)}{" "}
              Mb
            </Text>
          )}
        </VStack>
      </Card.Footer>
    </Card.Root>
  );
};

export default ContributorTrackCard;
