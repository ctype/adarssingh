import { useAppSelector } from "@/app/store";
import { LinkButton } from "@/components/ui/link-button";
import {
  Box,
  Button,
  Card,
  Flex,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ArrowRight } from "lucide-react";

export default function UserSubscription() {
  const { user } = useAppSelector((state) => state.auth);
  return (
    <Box>
      <h3>Subscription and Billing</h3>

      <Flex gap={4} direction={{ base: "column", lg: "row" }}>
        {/* Subscription card */}
        <Card.Root my={4} flex={1}>
          <Card.Body>
            <VStack
              alignItems={"start"}
              justifyContent={"space-between"}
              h={"full"}
              gap={4}
            >
              <HStack
                w="full"
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <VStack alignItems={"start"} gap={0}>
                  <Text color="gray.600" fontWeight={"medium"}>
                    Current Plan
                  </Text>
                  <Text fontSize={"2xl"} fontWeight={"semibold"}>
                    {user?.userProPackage?.name}
                  </Text>
                </VStack>
                <LinkButton
                  href="/pricing"
                  variant="outline"
                  colorPalette="blue"
                >
                  Change Plan <ArrowRight />
                </LinkButton>
              </HStack>
              <HStack
                w="full"
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Text color="gray.600" fontWeight={"medium"}>
                  Cost for this month
                </Text>
                <Text fontWeight={"semibold"}>
                  ${user?.userProPackage?.priceMonthly}
                </Text>
              </HStack>
            </VStack>
          </Card.Body>
        </Card.Root>

        {/* Payment card */}
        <Card.Root my={4} flex={1}>
          <Card.Body>
            <VStack
              alignItems={"start"}
              justifyContent={"space-between"}
              h={"full"}
              gap={4}
            >
              <HStack
                w="full"
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <VStack alignItems={"start"} gap={0}>
                  <Text color="gray.600" fontWeight={"medium"}>
                    Payment
                  </Text>
                  <Text fontSize={"2xl"} fontWeight={"semibold"}>
                    (Username)
                  </Text>
                </VStack>
                <Button variant="outline" colorPalette="blue">
                  Edit <ArrowRight />
                </Button>
              </HStack>
              <HStack
                w="full"
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Text color="gray.600" fontWeight={"medium"}>
                  Paypal account
                </Text>
                <Text fontWeight={"semibold"}>ma******@gmail.com</Text>
              </HStack>
              <HStack
                w="full"
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Text color="gray.600" fontWeight={"medium"}>
                  Billing Address
                </Text>
                <Text fontWeight={"semibold"}>(Someplace / somewhere)</Text>
              </HStack>
            </VStack>
          </Card.Body>
        </Card.Root>
      </Flex>
    </Box>
  );
}
