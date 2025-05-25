import { Stack } from "@chakra-ui/react";
import { Skeleton } from "../ui/skeleton";

export default function PhotoVideoCardSkeleton() {
  return (
    <Stack gap={2} w={"350px"} position={"relative"}>
      <Skeleton backgroundColor={"gray.600"} height="230px" />
      <Skeleton
        backgroundColor={"gray.800"}
        position={"absolute"}
        bottom={0}
        left={0}
        right={0}
        height="50px"
      />
    </Stack>
  );
}
