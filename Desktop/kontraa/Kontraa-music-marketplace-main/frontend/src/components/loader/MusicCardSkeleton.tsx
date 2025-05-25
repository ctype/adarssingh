import { Flex, Stack } from "@chakra-ui/react";
import { Skeleton, SkeletonText } from "../ui/skeleton";

export default function MusicCardSkeleton() {
  return (
    <Stack gap={2} w={"full"}>
      <Skeleton backgroundColor={"gray.600"} height="220px" />
      <Flex alignItems={"center"} justifyContent={"space-between"}>
        <SkeletonText backgroundColor={"gray.600"} noOfLines={1} />
        <Skeleton backgroundColor={"gray.600"} height="15px" w={"1/4"} />
      </Flex>
      <Skeleton backgroundColor={"gray.600"} height="50px" />
    </Stack>
  );
}
