import { Stack } from "@chakra-ui/react";
import { Skeleton } from "../ui/skeleton";

export default function GenreCardSkeleton() {
  return (
    <Stack gap={2} w={"full"} alignItems={"center"}>
      <Skeleton backgroundColor={"gray.600"} height="250px" w={"full"} />
      <Skeleton backgroundColor={"gray.600"} height="15px" w={"1/2"} />
    </Stack>
  );
}
