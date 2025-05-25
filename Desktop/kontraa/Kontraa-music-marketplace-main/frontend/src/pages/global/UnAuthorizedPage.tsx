import { Box, Link, Text } from "@chakra-ui/react";
import { LinkButton } from "@/components/ui/link-button";

export default function UnAuthorizedPage() {
  return (
    <Box
      minW={"100vw"}
      minH={"100vh"}
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      gap={4}
      backgroundColor={"#000"}
      color={"white"}
    >
      <h4>You are unauthorized to access this resource.</h4>
      <Text>
        Contact kontraa support at{" "}
        <Link href="mailto:support@kontraa.com" color={"blue.600"}>
          support@kontraa.com
        </Link>
        , if you think it is a mistake.
      </Text>
      <LinkButton
        href="/"
        backgroundColor={"blue.600"}
        color={"white"}
        _hover={{ backgroundColor: "blue.700" }}
      >
        Go to home
      </LinkButton>
    </Box>
  );
}
