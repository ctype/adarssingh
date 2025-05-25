import { Stack } from "@chakra-ui/react";
import { Skeleton, SkeletonCircle } from "../ui/skeleton";

export default function ContributorCardSkeleton() {
  return (
    <Stack gap={4} w={"full"} alignItems="center">
      <SkeletonCircle backgroundColor={"gray.600"} height="150px" w={"150px"} />
      <Skeleton backgroundColor={"gray.600"} height={"15px"} w={"1/2"} />
    </Stack>
  );
}
