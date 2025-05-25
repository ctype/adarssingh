import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Box, Flex, HStack, Image, Text, VStack } from "@chakra-ui/react";

import { useAppSelector } from "@/app/store";
import { Button } from "@/components/ui/button";
// import { useDownload } from "@/hooks/useDownload";
import MaxWidthWrapper from "@/wrappers/MaxWidthWrapper";

export default function Checkout() {
  const { carts } = useAppSelector((state) => state.carts);
  // const { handleDownload } = useDownload();

  return (
    <MaxWidthWrapper>
      <Box py={12} minH={"60svh"}>
        <Flex
          alignItems={"center"}
          justifyContent={"space-between"}
          gap={2}
          direction={{ base: "column", md: "row" }}
        >
          <h4>Tracks ({carts.length} items)</h4>
          <Flex
            alignItems="center"
            gap={1}
            textDecoration={"underline"}
            color="cyan"
          >
            <Link to="/tracks">Continue exploring</Link>
            <ArrowRight size={16} />
          </Flex>
        </Flex>
        <Flex direction={{ base: "column", md: "row" }} gap={4} mt={4}>
          <Box flex={2}>
            {carts.map((cart) => (
              <Box px={4} py={2} my={4} w={"full"} rounded={"sm"} key={cart.id}>
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  w={"full"}
                >
                  <HStack gap={6} w={"full"}>
                    <Image
                      src={
                        import.meta.env.VITE_AWS_BUCKET_LINK +
                        cart.artWorkFilePath
                      }
                      alt={cart.title}
                      rounded={"sm"}
                      w={24}
                      h={20}
                    />

                    <VStack gap={2} alignSelf={"center"}>
                      <Box>
                        <Text fontSize={18}>{cart.title}</Text>
                        <Text
                          fontSize={14}
                          color={"gray.400"}
                          alignSelf={"self-start"}
                        >
                          track
                        </Text>
                      </Box>
                      <Text
                        alignSelf={"self-start"}
                        color={"blue.400"}
                        fontWeight={"semibold"}
                      >
                        ${cart.price}
                      </Text>
                    </VStack>
                  </HStack>
                  <Button
                    variant="plain"
                    color="red.500"
                    onClick={() => {}}
                    alignSelf={"center"}
                    textDecoration={"underline"}
                  >
                    Remove
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
          <Box
            flex={1}
            border="1px solid"
            borderColor="gray.800"
            rounded={"md"}
            h={"fit"}
            p={8}
          >
            <VStack gap={2} alignItems={"start"} mb={4}>
              <HStack
                gap={2}
                alignItems={"center"}
                justifyContent={"space-between"}
                w="full"
              >
                <Text color={"gray.400"} fontWeight={"medium"}>
                  Subtotal
                </Text>
                <Text fontSize={"xl"}>
                  ${carts.reduce((a, b) => a + b.price, 0).toFixed(2)}
                </Text>
              </HStack>
              <HStack
                gap={2}
                alignItems={"center"}
                justifyContent={"space-between"}
                w="full"
              >
                <Text color={"gray.400"} fontWeight={"medium"}>
                  Coupon
                </Text>
                <Text fontSize={"xl"}>${0}</Text>
              </HStack>
              <HStack
                gap={2}
                alignItems={"center"}
                justifyContent={"space-between"}
                w="full"
              >
                <Text color={"gray.400"} fontWeight={"medium"}>
                  Total
                </Text>
                <Text fontSize={"xl"}>
                  ${carts.reduce((a, b) => a + b.price, 0).toFixed(2)}
                </Text>
              </HStack>
            </VStack>
            <Button
              colorPalette={"blue"}
              w="full"
              onClick={() => {
                // handleDownload(
                //   "8/wav/1739355108723Tfile_example_WAV_1MG.wav",
                //   "file_example_WAV_1MG.wav",
                //   "compress",
                //   "Track",
                //   27,
                //   2
                // );
              }}
            >
              Pay
            </Button>
          </Box>
        </Flex>
      </Box>
    </MaxWidthWrapper>
  );
}
