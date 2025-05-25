import { RotateCcw } from "lucide-react";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Box, Flex, HStack, Text } from "@chakra-ui/react";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/form/CustomInput";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  addLicensesToMusic,
  fetchMyLicenses,
} from "@/features/license/licenseSlice";
import { TEMP_TRACK_ID } from "../utils/options";

export default function Monetization({
  hasBeenEdited,
  typeOfTrack,
  onSuccess,
  setUploadingTrack,
  trackData,
}: {
  onSuccess: (prices: string[], id: number) => void;
  hasBeenEdited: boolean;
  typeOfTrack: "track" | "sound-bank" | "preset";
  trackData: Track | SoundBank | Preset;
  setUploadingTrack: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  // const { setTrackData, trackData } = useContext(TrackContext);
  const { myLicenses } = useAppSelector((state) => state.licenses);
  // const { myAudios } = useAppSelector((state) => state.audios);
  const [addedLicenseAndPrice, setAddedLicenseAndPrice] = useState<
    { id: number; price: string }[]
  >([]);

  const handlePricingSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setUploadingTrack(true);
    const form = new FormData(e.currentTarget);
    const licenseIds = form.getAll("licenseIds[]").map((id) => Number(id));
    const audioPrices = form
      .getAll("audioPrices[]")
      .map((price, index) => `${licenseIds[index]}*${price}`);

    try {
      (async () => {
        await dispatch(
          addLicensesToMusic({
            licenseIds,
            musicId: id
              ? Number(id)
              : Number(localStorage.getItem(TEMP_TRACK_ID)),
            exclusivePrices: audioPrices,
            type: typeOfTrack,
            toReview: true,
          })
        )
          .unwrap()
          .then((d) => {
            if (d) {
              onSuccess(audioPrices, Number(id));
            }
          });
      })();
    } catch (error) {
      setUploadingTrack(false);
      console.error(error);
    }
  };

  useEffect(() => {
    dispatch(fetchMyLicenses(typeOfTrack)).unwrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const licenses = trackData.licenses?.map((l) => (l as License).id) ?? [];
    const exclusiveOneTimeBuyPrices = trackData.exclusiveOneTimeBuyPrices ?? [];

    if (licenses.length && exclusiveOneTimeBuyPrices.length) {
      const licenseWithPrices = licenses.map((l) => ({
        id: l,
        price:
          exclusiveOneTimeBuyPrices
            .find((ep) => Number(ep.split("*")[0]) === l)
            ?.split("*")[1] ?? "",
      }));
      setAddedLicenseAndPrice(licenseWithPrices);
    }
  }, [trackData.licenses, trackData.exclusiveOneTimeBuyPrices]);

  return (
    <Box borderRadius={"md"}>
      <form id="pricing-form" onSubmit={handlePricingSubmit}>
        <Text my={4}>Non-exclusive licenses</Text>
        {myLicenses?.map((data, i) => {
          return (
            <MonetizationTypeBox
              id={data.id}
              label={data.licenseName}
              type={data.type}
              defaultPrice={data.licenseDefaultPrice?.toString() ?? ""}
              price={
                addedLicenseAndPrice.find((a) => a.id === data.id)
                  ? addedLicenseAndPrice.find((a) => a.id === data.id)?.price
                  : data.licenseDefaultPrice?.toString()
              }
              key={i}
              isChecked={
                (!hasBeenEdited && !id && data.addToMusicByDefault) ||
                !!trackData.licenses?.find((a) => (a as License).id === data.id)
              }
            />
          );
        })}
      </form>

      {/* <Text>Free Download</Text>
      {monetizationsData2?.map((data, i) => (
        <MonetizationTypeBox
          id={data.id}
          label={data.label}
          type={data.type}
          key={i}
        />
      ))} */}
    </Box>
  );
}

interface monetizationsDatasProps {
  id: number;
  label: string;
  type: string;
  price?: string;
  defaultPrice: string;
  isChecked?: boolean;
}

const MonetizationTypeBox = (props: monetizationsDatasProps) => {
  const { id, label, type, price, defaultPrice } = props;
  const [isSwitchOn, setIsSwitchOn] = useState<boolean>(false);
  const [currentPrice, setCurrentPrice] = useState<string | undefined>(price);

  const handleSwitchClicked = () => {
    setIsSwitchOn((prev) => !prev);
  };

  useEffect(() => {
    setIsSwitchOn(props.isChecked || false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Flex
        px={4}
        border={isSwitchOn ? "1px solid #006AFF" : "1px solid gray"}
        py={2}
        rounded={"lg"}
        alignItems={"center"}
        justify={"space-between"}
        bg={isSwitchOn ? "#081C39" : "transparent"}
        key={id}
        my={4}
        mx={2}
      >
        <HStack gap={4} w={"full"}>
          <Switch
            colorPalette={"blue"}
            size="md"
            checked={isSwitchOn}
            onChange={handleSwitchClicked}
          />
          <Box w={"full"}>
            <Text>{label}</Text>
            <Text fontSize={"sm"} color={"gray.400"}>
              {type}
            </Text>
          </Box>
        </HStack>
        <CustomInput
          name="licenseIds[]"
          label=""
          type="hidden"
          disabled={!isSwitchOn}
          value={id}
          placeholder={price}
        />
        {price && (
          <HStack gap={4} w={"full"}>
            <Text>Price: </Text>
            <CustomInput
              name="audioPrices[]"
              label=""
              type="number"
              placeholder={price}
              value={currentPrice}
              onChange={(e) => setCurrentPrice(e.target.value)}
              disabled={!isSwitchOn}
              required={false}
            />
            <Button
              onClick={() => {
                setCurrentPrice(defaultPrice);
              }}
              bg={"#262626"}
              p={2}
              rounded={"full"}
              color={"gray.400"}
            >
              <RotateCcw size={16} />
            </Button>
          </HStack>
        )}
      </Flex>
    </>
  );
};
