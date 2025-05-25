import { useRef } from "react";
import {
  Pause,
  Play,
  Volume2,
  Heart,
  Download,
} from "lucide-react";
import {
  Box,
  Flex,
  Text,
  Image,
  HStack,
  Button,
} from "@chakra-ui/react";

import { useMusic } from "@/hooks/userMusic";
import { useLikeUnlike } from "@/hooks/useLikeUnlike";
import { useDownload } from "@/hooks/useDownload";
import ShareButton from "../public/ShareButton";
import ReportButton from "../public/ReportButton";
import { Slider } from "@/components/ui/slider";

export default function BottomMusicPlayer({ track }: { track: BaseAudio }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { isPlaying, handlePlay, playTime, handleVolumeChange } = useMusic({
    audioUrl: import.meta.env.VITE_AWS_BUCKET_LINK + track?.mp3File,
    containerRef,
    waveHeight: 60,
  });

  const { handleLikeUnlike, liked } = useLikeUnlike({
    entityId: track?.id,
    entityName: "Track",
  });

  const { handleDownload } = useDownload();

  return (
    <Flex
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      zIndex="1000"
      bg="gray.900"
      p={3}
      borderTop="1px solid #2d2d2d"
      alignItems="center"
      justifyContent="space-between"
      gap={4}
    >
      {/* Track Info */}
      <HStack spacing={4} alignItems="center">
        <Image
          boxSize="50px"
          src={import.meta.env.VITE_AWS_BUCKET_LINK + track?.artworkFile}
          borderRadius="md"
          alt={track?.title}
        />
        <Box>
          <Text color="white" fontWeight="bold" noOfLines={1}>
            {track?.title}
          </Text>
          <Text color="gray.400" fontSize="sm" noOfLines={1}>
            {track?.uploadedBy?.username}
          </Text>
        </Box>
      </HStack>

      {/* Waveform and controls */}
      <Flex alignItems="center" gap={4} flex="1" maxW="50%">
        <Box onClick={handlePlay} cursor="pointer">
          {isPlaying ? <Pause color="white" /> : <Play color="white" />}
        </Box>
        <Box ref={containerRef} w="100%" id="bottomWave" />
        <Text color="gray.400" fontSize="sm" whiteSpace="nowrap">
          {playTime}
        </Text>
      </Flex>

      {/* Volume */}
      <HStack alignItems="center" spacing={2}>
        <Volume2 color="white" />
        <Slider
          width="100px"
          defaultValue={[40]}
          onValueChange={(e) => handleVolumeChange(e.value[0] / 100)}
        />
      </HStack>

      {/* Actions */}
      <HStack spacing={2}>
        <Button
          variant="ghost"
          size="sm"
          color="white"
          onClick={handleLikeUnlike}
        >
          {liked ? (
            <Heart size={16} fill="red" stroke="red" />
          ) : (
            <Heart size={16} />
          )}
          <Text ml={1}>{track?.upVoteCount}</Text>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          color="white"
          onClick={() =>
            handleDownload(
              track.mp3File,
              `${track.title}-kontraa.mp3`,
              "mp3",
              "free",
              "Track",
              track.id
            )
          }
        >
          <Download size={16} />
        </Button>

        <ShareButton
          shareLink={`${window.location.origin}/tracks/${track?.id}`}
        />

        <ReportButton
          title="Report this Track"
          entityName="Track"
          entityId={track?.id}
          artistId={track?.uploadedBy.id}
        />
      </HStack>
    </Flex>
  );
}
