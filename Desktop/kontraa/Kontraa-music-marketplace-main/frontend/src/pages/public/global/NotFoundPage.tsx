import { Button } from "@/components/ui/button";
import { Box, Heading, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <Box
      w="full"
      h="100dvh"
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      gap={4}
      flexDirection={"column"}
    >
      <Heading as="h3">Page Not found</Heading>
      <Text>We couldnot find the resource you are looking.</Text>
      <Button
        size="sm"
        colorPalette={"blue"}
        onClick={() => navigate("/tracks")}
      >
        Explore Music
      </Button>
    </Box>
  );
}
