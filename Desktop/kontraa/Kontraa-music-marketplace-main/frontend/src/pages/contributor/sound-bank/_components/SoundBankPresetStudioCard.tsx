import { FileMusic } from "lucide-react";
import { Flex, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Box, Card, Text } from "@chakra-ui/react";

import { Tag } from "@/components/ui/tag";
import { useAppDispatch } from "@/app/store";
import EditButton from "@/components/afterAuth/EditButton";
import DeleteButton from "@/components/afterAuth/DeleteButton";
import { deletePreset } from "@/features/preset/presetSlice";
import { deleteSoundBank } from "@/features/soundBank/soundBankSlice";

export default function SoundBankPresetStudioCard({
  id,
  title,
  img,
  status=1,
  size,
  type,
  isDraft,
}: {
  id: number;
  title: string;
  img: string;
  status: number;
  size: number;
  type: "preset" | "sound-bank";
  isDraft: boolean;
}) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    if (type === "sound-bank") {
      dispatch(deleteSoundBank(id)).unwrap();
    } else {
      dispatch(deletePreset(id)).unwrap();
    }
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
      <Card.Body position="relative" padding={2} w={"full"}>
        <Image
          alt={title}
          src={img}
          h={230}
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
              <EditButton handleEdit={() => navigate(`edit/${id}`)} />
            </Box>
            <Box as="span" rounded={"md"} backgroundColor="black">
              <DeleteButton handleDelete={handleDelete} />
            </Box>
          </Box>
          <Tag
            position={"absolute"}
            bottom={5}
            left={5}
            size={"lg"}
            rounded="full"
            px={6}
            py={1}
            colorPalette={
              isDraft
                ? "gray"
                : status === 0
                  ? "orange"
                  : status === 1
                    ? "green"
                    : "red"
            }
          >
            {isDraft
              ? "Draft"
              : status === 0
                ? "Pending"
                : status === 1
                  ? "Accepted"
                  : "Rejected"}
          </Tag>
        </Box>
      </Card.Body>
      <Card.Footer w="full" textAlign="left" padding={0} px={3} pb={2}>
        <Flex direction="column" gap={0.5}>
          <Text color={"white"}>{title}</Text>
          <Flex alignItems={"center"} gap={1}>
            <FileMusic size={18} />
            <Text color={"white"}>{(size / 1024).toPrecision(2)} MB</Text>
          </Flex>
        </Flex>
      </Card.Footer>
    </Card.Root>
  );
}
