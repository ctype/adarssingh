import { CircleOff } from "lucide-react";
import { Box, Flex, Text } from "@chakra-ui/react";

export default function NoDataComponent({
  noFoundText,
}: {
  noFoundText: string;
}) {
  return (
    <Box width={"full"} height={"300px"}>
      <Flex
        direction={"column"}
        gap={2}
        width={"full"}
        height={"full"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <CircleOff size={36} color="gray" />
        <Text color={"gray.800"} fontWeight={"bold"} fontSize={"lg"}>
          {noFoundText}
        </Text>
      </Flex>
    </Box>
  );
}
