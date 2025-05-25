import { PropsWithChildren } from "react";
import { Box, Grid, Text, VStack } from "@chakra-ui/react";

interface IProfileSectionWrapperProps {
  label: string;
  description: string;
}

export default function ProfileSectionWrapper({
  children,
  label,
  description,
}: PropsWithChildren<IProfileSectionWrapperProps>) {
  return (
    <Box my={8}>
      <VStack alignItems={"start"}>
        <Text fontWeight={"semibold"} fontSize={"xl"}>
          {label}
        </Text>
        <Text color="gray.400" fontWeight={"medium"}>
          {description}
        </Text>
      </VStack>
      <Grid
        templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
        gap={4}
        mt={8}
      >
        {children}
      </Grid>
    </Box>
  );
}
