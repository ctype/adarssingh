// import { useRef } from "react";
import { MdVerified } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { Download } from "lucide-react";
import { Card, HStack, Text, VStack, Image } from "@chakra-ui/react";

// import { useMusic } from "@/hooks/userMusic";
import { Button } from "@/components/ui/button";
import { useDownload } from "@/hooks/useDownload";
// import CustomCartDialog from "@/components/cart/CustomCartDialog";

interface ISoundBankPresetExploreCardProps {
  sound: BaseAudio;
  audioUrl: string;
  type: "sound-banks" | "presets";
}
const SoundBankPresetExploreCard = function ({
  sound,
  // audioUrl,
  type,
}: ISoundBankPresetExploreCardProps) {
  const navigate = useNavigate();
  // const containerRef = useRef<HTMLDivElement>(null);
  // const waveHeight = 50;
  // const { isPlaying, handlePlay } = useMusic({
  //   audioUrl,
  //   containerRef,
  //   waveHeight,
  // });
  const { handleDownload } = useDownload();

  return (
    <Card.Root
      _hover={{ backgroundColor: "black" }}
      justifyContent="center"
      alignItems="center"
      // minW={236}
      // maxW={236}
      w="full"
      backgroundColor={"#000"}
      border={"none"}
      color={"white"}
      userSelect={"none"}
    >
      <Card.Body
        padding={3}
        textAlign="left"
        cursor={"pointer"}
        _hover={{
          "& .actions": {
            display: "block",
          },
        }}
        w="full"
      >
        <Link to={`/${type}/${sound?.id}`}>
          <Image
            alt="images"
            h={230}
            w={"full"}
            src={import.meta.env.VITE_AWS_BUCKET_LINK + sound.artworkFile}
            borderRadius="5px"
            objectFit={"cover"}
          />
        </Link>
        {/* TODO: enable in next release */}
        {/* <Button
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
          color={"white"}
          aspectRatio={1}
          p={2}
          rounded={"full"}
          onClick={(e) => {
            handlePlay(e);
            e.stopPropagation();
          }}
        >
          {!isPlaying ? <Play size={18} /> : <Pause size={18} />}
        </Button> */}
      </Card.Body>
      <Card.Footer w="full" textAlign="left" padding={0} px={3} pb={2}>
        <VStack alignItems="initial" w="100%">
          <VStack
            textAlign="initial"
            alignItems="initial"
            justifyContent={"space-between"}
            gap={0.5}
            className="cursor-pointer"
          >
            <Text
              fontSize="md"
              textAlign="left"
              color="secondary"
              fontWeight="semibold"
              truncate
            >
              {sound.title}
            </Text>
            <HStack gap={1} className="cursor-pointer">
              <Text
                fontWeight={"bold"}
                color="gray.500"
                cursor={"pointer"}
                _hover={{ textDecoration: "underline" }}
                onClick={() =>
                  navigate(`/profile/${sound?.uploadedBy.username}`)
                }
              >
                {sound?.uploadedBy.username}
              </Text>
              <MdVerified color="#5050FE" />
            </HStack>
          </VStack>

          <HStack
            rounded={5}
            gap={1}
            alignItems="center"
            justifyContent="end"
            fontSize="md"
          >
            {/* TODO: enable in next release */}
            {/* {sound?.exclusiveOneTimeBuyPrices &&
            sound?.exclusiveOneTimeBuyPrices.length > 0 ? (
              <CustomCartDialog
                title="Add to Cart"
                licenses={sound?.licenses as License[]}
                prices={sound?.exclusiveOneTimeBuyPrices.map((p) => ({
                  id: Number(p.split("*")[0]),
                  price: Number(p.split("*")[1]),
                }))}
                fileId={(sound?.fileIds?.[0] as TrackFile).id}
              >
                <Button
                  w={"full"}
                  variant={"outline"}
                  borderColor={"blue.700"}
                  color={"blue.500"}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  gap={2}
                  _hover={{ backgroundColor: "blue.700/20" }}
                >
                  <ShoppingCart size={18} />$
                  {sound.exclusiveOneTimeBuyPrices[0].split("*")[1]}
                </Button>
              </CustomCartDialog>
            ) : (
              <Text
                backgroundColor={"yellow.700/20"}
                color={"yellow.400"}
                px={2}
                py={2.5}
                rounded={"lg"}
                className="small"
              >
                Only Subscribtion
              </Text>
            )} */}

            <Button
              w={"full"}
              variant={"outline"}
              borderColor={"blue.700"}
              color={"blue.500"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              gap={2}
              _hover={{ backgroundColor: "blue.700/20" }}
              onClick={() =>
                handleDownload(
                  type === "sound-banks"
                    ? (sound as SoundBank).mp3Files[0]
                    : (sound as Preset).mp3Files[0],
                  `${sound.title}-kontraa.mp3`,
                  "mp3",
                  "free",
                  type === "sound-banks" ? "SoundBank" : "Preset",
                  sound.id
                )
              }
            >
              <Download size={18} />
              Download
            </Button>
          </HStack>
        </VStack>
      </Card.Footer>
    </Card.Root>
  );
};

export default SoundBankPresetExploreCard;
