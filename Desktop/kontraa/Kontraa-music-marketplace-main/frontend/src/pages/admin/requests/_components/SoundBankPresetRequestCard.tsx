import { FileMusic } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, Text, VStack, Flex, Image, Box } from "@chakra-ui/react";

import { Tag } from "@/components/ui/tag";
import { useAppDispatch } from "@/app/store";
import { deleteAudio } from "@/features/audio/audioSlice";
import EditButton from "@/components/afterAuth/EditButton";
import DeleteButton from "@/components/afterAuth/DeleteButton";

const SoundBankPresetRequestCard = function ({
  soundBankPreset,
  title,
  artworkFile,
  hideActions = false,
}: {
  soundBankPreset: SoundBank | Preset;
  title: string;
  artworkFile: string;
  hideActions?: boolean;
}) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    dispatch(deleteAudio(soundBankPreset.id)).unwrap();
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
    >
      <Card.Body padding={0} position={"relative"} textAlign="left">
        <Image
          alt={title}
          width={"full"}
          height={"250px"}
          src={import.meta.env.VITE_AWS_BUCKET_LINK + artworkFile}
          borderRadius="5px"
          padding={3}
        />
        {!hideActions && (
          <Box position={"absolute"} top={0} left={0} right={0} bottom={0}>
            <Flex gap={2} position={"absolute"} top={5} right={5}>
              <Box as="span" rounded={"md"} backgroundColor="black">
                <EditButton
                  handleEdit={() => navigate(`edit/${soundBankPreset.id}`)}
                />
              </Box>
              <Box as="span" rounded={"md"} backgroundColor="black">
                <DeleteButton handleDelete={handleDelete} />
              </Box>
            </Flex>
            <Tag
              position={"absolute"}
              bottom={5}
              left={5}
              size={"lg"}
              rounded="full"
              px={6}
              py={1}
              colorPalette={
                soundBankPreset.isDraft
                  ? "gray"
                  : soundBankPreset.status === 0
                    ? "orange"
                    : soundBankPreset.status === 1
                      ? "green"
                      : "red"
              }
            >
              {soundBankPreset.isDraft
                ? "Draft"
                : soundBankPreset.status === 0
                  ? "Pending"
                  : soundBankPreset.status === 1
                    ? "Approved"
                    : "Rejected"}
            </Tag>
          </Box>
        )}
      </Card.Body>
      <Card.Footer w="full" textAlign="left" padding={0} px={3} pb={2}>
        <VStack alignItems="initial" gap={0.5} w="100%">
          <Text
            fontSize="md"
            textAlign="left"
            color="secondary"
            fontWeight="semibold"
          >
            {title}
          </Text>
          {soundBankPreset.fileIds && soundBankPreset.fileIds.length > 0 && (
            <Text
              fontSize="sm"
              color="gray.400"
              display={"flex"}
              alignItems={"center"}
              gap={1}
            >
              <FileMusic size={18} />
              {(
                ((soundBankPreset.fileIds?.[0] as TrackFile).size ?? 1024) /
                1024
              ).toPrecision(2)}{" "}
              Mb
            </Text>
          )}
        </VStack>
      </Card.Footer>
    </Card.Root>
  );
};

export default SoundBankPresetRequestCard;
