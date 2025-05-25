import { MdVerified } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { Card, HStack, Text, VStack, Image, Box, Flex } from "@chakra-ui/react";
import { Play } from "lucide-react";

interface IMusicCardProps {
  track: BaseAudio;
  type: "Track" | "SoundBank" | "Preset";
}

const MusicCard = function ({ track, type }: IMusicCardProps) {
  const navigate = useNavigate();

  return (
    <Card.Root
      justifyContent="center"
      alignItems="center"
      backgroundColor={"#000"}
      border={"none"}
      color={"white"}
      userSelect={"none"}
      position="relative"
    >
      {/* Image with Link - Only this part will lighten on hover */}
      <Box 
        position="relative"
        p={3}
        _hover={{
          backgroundColor: "gray.800",
          "& .play-button": {
            display: "flex",
          },
        }}
        transition="background-color 0.2s ease"
        borderRadius="5px"
      >
        <Link to={`/tracks/${track?.id}`}>
          <Image
            alt={`cover image for ${track?.title}`}
            aspectRatio={"square"}
            src={import.meta.env.VITE_AWS_BUCKET_LINK + track?.artworkFile}
            borderRadius="5px"
            w="full"
          />
        </Link>
        
        {/* Play Button */}
        <Flex
          className="play-button"
          display="none"
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          backgroundColor="rgba(0, 0, 0, 0.7)"
          color="white"
          borderRadius="full"
          w="40px"
          h="40px"
          alignItems="center"
          justifyContent="center"
          _hover={{
            backgroundColor: "rgba(0, 0, 0, 0.9)",
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Add your play logic here
          }}
        >
          <Play size={18} />
        </Flex>
      </Box>

      {/* Track Info Section */}
      <Card.Footer w="full" textAlign="left" padding={0} px={3} pb={2} pt={1}>
        <VStack alignItems="flex-start" w="100%" spacing={1}>
          {/* Track Title */}
          <Link to={`/tracks/${track?.id}`}> 
          <Text
            fontSize="md"
            fontWeight="semibold"
            color="white"
            noOfLines={1}
            width="100%"
          >
            {track?.title}
          </Text>
          </Link>

          {/* Artist Info */}
          <Flex alignItems="center" gap={1}>
            <Text
              fontSize="sm"
              color="gray.400"
              cursor="pointer"
              _hover={{ textDecoration: "underline" }}
              onClick={() => navigate(`/profile/${track?.uploadedBy.username}`)}
              noOfLines={1}
            >
              {track?.uploadedBy.username}
            </Text>
            <MdVerified color="#5050FE" size={14} />
          </Flex>
        </VStack>
      </Card.Footer>
    </Card.Root>
  );
};

export default MusicCard;