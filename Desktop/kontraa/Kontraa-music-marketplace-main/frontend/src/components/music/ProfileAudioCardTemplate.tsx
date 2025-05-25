import { useState } from "react";
import { Link } from "react-router-dom";
import { Pause, Play } from "lucide-react";
import { Card, Text, VStack, Flex, Image, Box } from "@chakra-ui/react";

interface IProfileAudioCardTemplate {
  imageUrl?: string;
  cardShadow?: string;
  price?: string;
  trackName: string;
  trackCount?: number;
  navigatePath: string;
  isTrack?: boolean;
  isSoundEffect?: boolean;
}

export default function ProfileAudioCardTemplate(
  props: IProfileAudioCardTemplate
) {
  const {
    imageUrl,
    cardShadow,
    price = "",
    trackName,
    trackCount,
    navigatePath,
    isTrack = true,
    isSoundEffect = false,
  } = props;
  const [playActive, setPlayActive] = useState<boolean>(false);
  // const [heartColor, setHeartColor] = useState<string>("black/90");
  const boxShadow: string = cardShadow || "";

  return (
    <Card.Root
      _hover={{ backgroundColor: "black" }}
      boxShadow={boxShadow}
      justifyContent="center"
      alignItems="center"
      maxW={240}
      backgroundColor={"#000"}
      border={"none"}
      color={"white"}
      userSelect={"none"}
    >
      <Card.Body
        padding={0}
        textAlign="left"
        cursor={"pointer"}
        _hover={{
          "& .actions": {
            display: "block",
          },
        }}
      >
        <Link to={navigatePath}>
          <Image
            alt={`cover image for ${trackName}`}
            // maxW={240}
            minW={200}
            maxH={250}
            aspectRatio={"square"}
            src={imageUrl}
            borderRadius="5px"
            padding={3}
          />
        </Link>
        <Box
          display={"none"}
          style={{
            position: "absolute",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -40%)",
          }}
          className={"actions"}
          border="none"
          backgroundColor={"black/90"}
          rounded={"full"}
          onClick={(e) => {
            e.stopPropagation();
            setPlayActive((prev) => !prev);
          }}
        >
          {!playActive ? (
            <Flex
              width={10}
              height={10}
              justifyContent="center"
              alignItems="center"
              bg="hoverColor"
              color="white"
              borderRadius="50%"
              _hover={{
                backgroundColor: "primary",
                borderRadius: "50%",
              }}
            >
              <Play size={18} />
            </Flex>
          ) : (
            <Flex
              width={10}
              height={10}
              justifyContent="center"
              alignItems="center"
              backgroundColor="hoverColor"
              borderRadius="50%"
              color="white"
              _hover={{
                backgroundColor: "primary",
                borderRadius: "50%",
              }}
            >
              <Pause size={18} />
            </Flex>
          )}
        </Box>
      </Card.Body>
      <Card.Footer w="full" textAlign="left" padding={0} px={3} pb={2}>
        {isTrack ? (
          <VStack alignItems="initial" gap={0.4} w="100%">
            <Flex
              w="100%"
              justifyContent="space-between"
              color="secondary2"
              cursor="default"
            >
              <Text color={"gray.400"}>2:56</Text>
              <p>{price}</p>
            </Flex>
            <VStack
              textAlign="initial"
              alignItems="initial"
              gap={0.4}
              className="cursor-pointer"
            >
              <Text fontSize="lg" textTransform={"uppercase"}>
                {trackName}
              </Text>
            </VStack>
          </VStack>
        ) : (
          <VStack alignItems="initial" gap={0.4} w="100%">
            <Flex w="100%" justifyContent="space-between" alignItems={"center"}>
              <Text fontSize={"lg"} textTransform={"uppercase"}>
                {trackName}
              </Text>
              <Text>{price}</Text>
            </Flex>

            {!isSoundEffect && (
              <VStack
                textAlign="initial"
                alignItems="initial"
                gap={0.4}
                className="cursor-pointer"
              >
                <Text color="gray.500">{trackCount} TRACKS</Text>
              </VStack>
            )}
          </VStack>
        )}
      </Card.Footer>
    </Card.Root>
  );
}
