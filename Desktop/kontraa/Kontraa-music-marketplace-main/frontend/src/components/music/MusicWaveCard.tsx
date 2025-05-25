import { useRef } from "react";
// import { formatDistanceToNow } from "date-fns";
import {
  Pause,
  Play,
  // Volume2,
  Heart,
  Download,
} from "lucide-react";
import { Box, Flex, Image, Text, VStack } from "@chakra-ui/react";

import { Button } from "../ui/button";
// import { Slider } from "../ui/slider";
// import { toaster } from "../ui/toaster";
import { useMusic } from "@/hooks/userMusic";
// import { useAppSelector } from "@/app/store";
// import { useNavigate } from "react-router-dom";
// import CustomCartDialog from "../cart/CustomCartDialog";
import { useLikeUnlike } from "@/hooks/useLikeUnlike";
import ShareButton from "../public/ShareButton";
import ReportButton from "../public/ReportButton";
import { useDownload } from "@/hooks/useDownload";

interface IMusicWaveCardProps {
  audioUrl: string;
  waveId: string;
  showVolume?: boolean;
  preset?: boolean;
  track: BaseAudio;
  trackInfo: dynamicObj;
  trackType: string;
}

export default function MusicWaveCard(props: IMusicWaveCardProps) {
  const { audioUrl, waveId, track, trackType } = props;

  const iconColor: string = "#F1F1FF";
  const waveHeight = 120;
  const containerRef = useRef<HTMLDivElement>(null);

  // const [vol, setVol] = useState([40]);
  // const navigate = useNavigate();
  // const { user } = useAppSelector((state) => state.auth);

  const { isPlaying, handlePlay, playTime } = useMusic({
    audioUrl,
    containerRef,
    waveHeight,
  });

  const { handleLikeUnlike, liked } = useLikeUnlike({
    entityId: track?.id,
    entityName: trackType,
  });
  const { handleDownload } = useDownload();

  return (
    <Box>
      <Flex
        gap={{ base: 4, md: 6 }}
        direction={{ base: "column", lg: "row" }}
        alignItems="center"
      >
        {/* Music card artwork image */}
        <Image
          border="0.06rem solid #3667964d"
          minW="280px"
          maxH="300px"
          w={{ base: "full", lg: "1/4" }}
          aspectRatio={1}
          src={import.meta.env.VITE_AWS_BUCKET_LINK + track?.artworkFile}
          alt="Music image"
          objectFit="cover"
          borderRadius="10px"
        />
        {/* Music detail section */}
        <Flex direction="column" gap={8} w="full">
          {/* Info Section */}
          <Flex
            w="full"
            h="full"
            flex={1}
            gap={8}
            direction={{ base: "column", lg: "row" }}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            {/* Music title, artist, play button, etc */}
            <Flex flex={5} direction="column" w="full" h="full">
              {/* Title, artist */}
              <VStack
                alignItems={{ base: "center", md: "start" }}
                paddingInline={2}
                paddingBlock={2}
                borderRadius="0.6rem"
                fontSize={{ base: "0.7rem", md: "0.9rem", lg: "1rem" }}
                gap={0}
              >
                <h3>{track?.title}</h3>
                <Text color={"gray.400"} fontSize="xl">
                  by {track?.uploadedBy.username}
                </Text>
              </VStack>

              {/* Wav and play */}
              <Flex
                display={{ base: "none", md: "inline-block" }}
                direction="column"
                w="100%"
              >
                <Flex w="full" gap={4} alignItems="center">
                  <Button
                    w="40px"
                    h="40px"
                    backgroundColor="gray.900"
                    borderRadius="50%"
                    alignItems="center"
                    justifyContent="center"
                    border="none"
                    p={0}
                    m={0}
                    onClick={handlePlay}
                  >
                    {isPlaying ? (
                      <Pause color={iconColor} size={18} />
                    ) : (
                      <Play color={iconColor} size={18} />
                    )}
                  </Button>
                  <Box as="div" w="full" id={waveId} ref={containerRef} />
                  <Text>{playTime}</Text>
                </Flex>
                {/* <Flex
                  color="white"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box width="fit-content" mx={2}>
                    {showVolume && (
                      <HStack>
                        <Volume2 size={20} cursor={"pointer"} />
                        <Slider
                          width={"200px"}
                          defaultValue={vol}
                          size={"sm"}
                          colorPalette={"blue"}
                          onValueChange={(e) => {
                            setVol(e.value);
                            handleVolumeChange(e.value[0] / 100);
                          }}
                        />
                      </HStack>
                    )}
                  </Box>
                </Flex> */}
              </Flex>
            </Flex>

            {/* Genre, mood, etc section */}
            <Flex
              w={{ base: "full", lg: "200px" }}
              // columns={{ base: 6, md: 2 }}
              alignItems={"center"}
              justifyContent={{ base: "center", lg: "start" }}
              gap={10}
              flex={2}
              h={"full"}
              flexWrap={{ base: "nowrap", lg: "wrap" }}
              overflowX={{ base: "scroll", lg: "hidden" }}
              scrollbarWidth={"none"}
            >
              {Object.keys(props.trackInfo).map((info) => (
                <InfoGridItem
                  key={info}
                  title={info}
                  value={props.trackInfo[info] as string}
                />
              ))}
            </Flex>
          </Flex>

          {/* Action section */}
          <Flex
            alignItems="center"
            justifyContent={{ base: "center", lg: "start" }}
            color="textGray"
            fontSize="sm"
            gap={2}
          >
            {/* TODO: enable in next release */}
            {/* {track?.exclusiveOneTimeBuyPrices &&
              track?.exclusiveOneTimeBuyPrices?.length > 0 && (
                <CustomCartDialog
                  title="Choose Your License"
                  licenses={track?.licenses as License[]}
                  prices={track?.exclusiveOneTimeBuyPrices.map((p) => ({
                    id: Number(p.split("*")[0]),
                    price: Number(p.split("*")[1]),
                  }))}
                  fileId={(track.fileIds?.[0] as TrackFile).id}
                >
                  <Button
                    color="white"
                    _hover={{
                      backgroundColor: "blue.600/50",
                    }}
                    backgroundColor={"blue.600"}
                    px={12}
                    rounded={"full"}
                  >
                    Add to cart
                  </Button>
                </CustomCartDialog>
              )} */}
            <Button
              color="white"
              _hover={{
                backgroundColor: "blue.600/50",
              }}
              backgroundColor={"blue.600"}
              px={12}
              rounded={"full"}
              onClick={() =>
                handleDownload(
                  trackType === "Track"
                    ? (track as Track).mp3File
                    : trackType === "SoundBank"
                    ? (track as SoundBank).mp3Files[0]
                    : (track as Preset).mp3Files[0],
                  `${track.title}-kontraa.mp3`,
                  "mp3",
                  "free",
                  trackType,
                  track.id
                )
              }
            >
              <Download /> Download
            </Button>
            <Button
              variant={"ghost"}
              color={"white"}
              backgroundColor="gray.600/30"
              rounded={"full"}
              py={2}
              px={4}
              display={"flex"}
              alignItems={"center"}
              gap={2}
              onClick={handleLikeUnlike}
            >
              {liked ? (
                <Heart size={18} fill="red" stroke="red" />
              ) : (
                <Heart size={18} />
              )}
              {track?.upVoteCount}
            </Button>

            <ShareButton
              shareLink={
                window.location.origin +
                `/${
                  trackType === "Track"
                    ? "tracks"
                    : trackType === "Preset"
                    ? "presets"
                    : "sound-banks"
                }/${track?.id}`
              }
            />

            <ReportButton
              title={`Report this ${trackType}`}
              entityName={trackType}
              entityId={track?.id}
              artistId={track?.uploadedBy.id}
            />
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}

function InfoGridItem({ title, value }: { title: string; value: string }) {
  return (
    <VStack
      color="textGray"
      alignItems={{ base: "start", md: "start" }}
      fontSize="md"
      gap={4}
      w="fit-content"
    >
      <Text
        as="span"
        fontSize={"sm"}
        fontWeight={"bold"}
        color={"gray.500"}
        textTransform={"uppercase"}
      >
        {title}
      </Text>
      <Text
        as="span"
        fontSize={"lg"}
        _hover={{ color: "fullWhite" }}
        whiteSpace="wrap"
      >
        {value}
      </Text>
    </VStack>
  );
}
