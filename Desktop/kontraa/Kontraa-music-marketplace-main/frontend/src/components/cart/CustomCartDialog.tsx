import { PropsWithChildren, useState } from "react";
import { BoomBox, Layers, Mic, Radio, Thermometer, Video } from "lucide-react";
import { Box, Flex, Grid, HStack, Stack, Text, Badge } from "@chakra-ui/react";

import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import CustomTabs from "../global/CustomTabs";
import { addToCart } from "@/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { LinkButton } from "../ui/link-button";

interface ICustomCartDialogProps {
  title: string;
  licenses: License[];
  prices: { id: number; price: number }[];
  fileId: number;
  handleBuyNow?: () => void;
}

export default function CustomCartDialog({
  children,
  ...props
}: PropsWithChildren<ICustomCartDialogProps>) {
  const { title, handleBuyNow, licenses, prices, fileId } = props;

  const [cartLicenseSelectedData, setCartLicenseSelectedData] = useState({
    licenseId: licenses[0]?.id,
    licenseTypeName: licenses[0]?.licenseName,
    price: prices.find((px) => px.id === licenses[0]?.id)?.price ?? 0,
  });

  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((store) => store.auth);
  const { carts } = useAppSelector((store) => store.carts);

  const handleCartAdd = () => {
    dispatch(
      addToCart({ fileId, licenseId: cartLicenseSelectedData.licenseId })
    ).unwrap();
    setOpen(false);
  };

  return (
    <DialogRoot
      placement={"center"}
      motionPreset="slide-in-bottom"
      open={open}
      lazyMount
      onOpenChange={(e) => setOpen(e.open)}
      size={{
        base: "xs",
        md: "lg",
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent backgroundColor={"black"} color={"white"}>
        <DialogHeader>
          <DialogTitle as="h4">{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <CartDialogBody
            cartLicenseSelectedData={cartLicenseSelectedData}
            setCartLicenseSelectedData={setCartLicenseSelectedData}
            licenses={licenses.map((l) => {
              return {
                ...l,
                price:
                  prices.find((px) => px.id === l.id)?.price.toString() ?? "",
              };
            })}
            carts={carts}
            fileId={fileId}
          />
        </DialogBody>
        <DialogFooter>
          <Flex w={"full"} justifyContent={"space-between"}>
            <Box>
              <Text fontSize={"xs"} color={"gray.400"}>
                TOTAL :{" "}
              </Text>
              <Text>${cartLicenseSelectedData.price}</Text>
            </Box>
            {user ? (
              <HStack gap={4}>
                {!carts.find(
                  (c) =>
                    c.fileId === fileId &&
                    cartLicenseSelectedData.licenseId === c.licenseId
                ) ? (
                  <Button
                    backgroundColor={"#fff"}
                    color={"#000"}
                    onClick={handleCartAdd}
                  >
                    Add to Cart
                  </Button>
                ) : (
                  <DialogActionTrigger asChild>
                    <LinkButton
                      href={"/checkout"}
                      color={"black"}
                      backgroundColor={"white"}
                    >
                      View in Cart
                    </LinkButton>
                  </DialogActionTrigger>
                )}
                <Button
                  backgroundColor={"blue.500"}
                  color={"white"}
                  onClick={handleBuyNow}
                  _hover={{ backgroundColor: "blue.600" }}
                >
                  Buy Now
                </Button>
              </HStack>
            ) : (
              <Text>You need to be logged in first</Text>
            )}
          </Flex>
        </DialogFooter>
        <DialogCloseTrigger
          color={"white"}
          _hover={{ backgroundColor: "transparent" }}
        />
      </DialogContent>
    </DialogRoot>
  );
}

interface CartDialogBodyType {
  cartLicenseSelectedData: {
    licenseTypeName: string;
    price: number;
    licenseId: number;
  };
  setCartLicenseSelectedData: React.Dispatch<
    React.SetStateAction<{
      licenseTypeName: string;
      price: number;
      licenseId: number;
    }>
  >;
  licenses: (License & { price: string })[];
  carts: CartResponse[];
  fileId: number;
}
function CartDialogBody(props: CartDialogBodyType) {
  const { setCartLicenseSelectedData, carts, fileId, licenses } = props;
  const handleLicenseSelected = (
    licenseTypeName: string,
    price: number,
    licenseId: number
  ) => {
    setCartLicenseSelectedData({ licenseTypeName, price, licenseId });
  };

  return (
    <Box>
      <Flex gap={6} flexDirection={"column"}>
        <Box minH={"200px"}>
          <CustomTabs
            defaultValue={licenses[0].id.toString()}
            items={licenses.map((data) => ({
              onclick: () =>
                handleLicenseSelected(data.type, Number(data.price), data.id),
              trigger: (
                <Flex gap={2} alignItems={"center"}>
                  {data.licenseName}
                  {carts.find(
                    (c) => c.fileId === fileId && c.licenseId === data.id
                  ) && (
                    <Badge variant={"solid"} colorPalette={"blue"}>
                      In Cart
                    </Badge>
                  )}
                </Flex>
              ),
              value: data.id.toString(),
              children: (
                <Stack>
                  <Text color={"white"} my={2}>
                    {data.licenseShortDescription}
                  </Text>

                  <Grid
                    templateColumns={{
                      base: "repeat(1, 1fr)",
                      md: "repeat(2, 1fr)",
                    }}
                    gap="4"
                    textAlign={"center"}
                  >
                    {licenseUsageTermsData?.map((lut) => {
                      if (lut.isCheck) {
                        if (data[lut.name as keyof License]) {
                          return (
                            <LicenseDetailFlex key={lut.id}>
                              {lut.icon}
                              <Text fontSize={"xs"}>{lut.label}</Text>
                            </LicenseDetailFlex>
                          );
                        } else {
                          return null;
                        }
                      }

                      return (
                        <LicenseDetailFlex key={lut.id}>
                          {lut.icon}
                          <Text fontSize={"xs"}>
                            {lut.label}{" "}
                            {data[lut.name as keyof License]?.toString()}
                          </Text>
                        </LicenseDetailFlex>
                      );
                    })}
                  </Grid>
                </Stack>
              ),
            }))}
          />
        </Box>
      </Flex>
    </Box>
  );
}

function LicenseDetailFlex({ children }: PropsWithChildren) {
  return (
    <Flex gap={4} color={"gray.300"} alignItems={"center"} p={2}>
      {children}
    </Flex>
  );
}

const licenseUsageTermsData = [
  {
    id: "luttype1",
    icon: <Mic />,
    label: "LICENSE PERIOD IN YEARS : ",
    name: "audioLicenseDuration",
    isCheck: false,
  },
  {
    id: "luttype2",
    icon: <Layers style={{ rotate: "45deg" }} />,
    label: "DITRIBUTION LIMIT : ",
    name: "audioLicenseDistribution",
    isCheck: false,
  },
  {
    id: "luttype3",
    icon: <Radio />,
    label: "AUDIO STREAMING LIMIT : ",
    name: "audioLicenseStreams",
    isCheck: false,
  },
  {
    id: "luttype4",
    icon: <Video />,
    label: "MUSIC VIDEO LIMIT : ",
    name: "musicVideoMonitizedAmount",
    isCheck: false,
  },
  {
    id: "luttype5",
    icon: <Thermometer style={{ rotate: "230deg" }} />,
    label: "FOR PROFIT LIVE PERFORMANCES",
    name: "livePerformanceProfitRights",
    isCheck: true,
  },
  {
    id: "luttype6",
    icon: <BoomBox />,
    label: "RADIO BROADCASTING RIGHTS",
    name: "radioBroadcastRights",
    isCheck: true,
  },
];
