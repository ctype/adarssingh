import { FileMusic } from "lucide-react";
import { Flex, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Box, Card, Text } from "@chakra-ui/react";

// import { Tag } from "@/components/ui/tag";
import { useAppDispatch } from "@/app/store";
import EditButton from "@/components/afterAuth/EditButton";
import DeleteButton from "@/components/afterAuth/DeleteButton";
import { deleteSoundEffect } from "@/features/sound_effect/soundEffectSlice";

export default function SoundEffectStudioCard({
  soundEffect,
}: {
  soundEffect: SoundEffect;
}) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    dispatch(deleteSoundEffect(soundEffect.id)).unwrap();
  };

  return (
    <Card.Root
      cursor="pointer"
      className="select-none"
      _hover={{ backgroundColor: "black" }}
      backgroundColor={"#000"}
      border={"none"}
      color={"white"}
      userSelect={"none"}
      width={"full"}
    >
      <Card.Body position="relative" w={"full"} padding={2}>
        <Image
          alt={soundEffect.soundEffectTitle}
          src={
            (import.meta.env.VITE_AWS_BUCKET_LINK +
              soundEffect.soundEffectArtworkFile) as string
          }
          height={"230px"}
          objectFit={"cover"}
          rounded={"md"}
        />

        <Box position={"absolute"} top={4} left={0} right={4} bottom={0}>
          <Box
            position={"absolute"}
            display={"flex"}
            gap={"2"}
            top={"2"}
            right={"2"}
          >
            <Box as="span" rounded={"md"} backgroundColor="black">
              <EditButton
                handleEdit={() => navigate(`edit/${soundEffect.id}`)}
              />
            </Box>
            <Box as="span" rounded={"md"} backgroundColor="black">
              <DeleteButton handleDelete={handleDelete} />
            </Box>
          </Box>
          {/* <Tag
            position={"absolute"}
            bottom={5}
            left={5}
            size={"lg"}
            rounded="full"
            px={6}
            py={1}
            colorPalette={
              soundEffect.approveStatus === 0
                ? "orange"
                : soundEffect.approveStatus === 1
                  ? "green"
                  : "red"
            }
          >
            {soundEffect.approveStatus === 0
              ? "Pending"
              : soundEffect.approveStatus === 1
                ? "Accepted"
                : "Rejected"}
          </Tag> */}
        </Box>
      </Card.Body>
      <Card.Footer w="full" textAlign="left" padding={0} px={3} pb={2}>
        <Flex direction="column" gap={0.5}>
          <Text color={"white"}>{soundEffect.soundEffectTitle}</Text>
          <Flex alignItems={"center"} gap={1}>
            <FileMusic size={18} />
            <Text color={"white"}>
              {(soundEffect.size / 1024).toPrecision(2)} MB
            </Text>
          </Flex>
        </Flex>
      </Card.Footer>
    </Card.Root>
  );
}
