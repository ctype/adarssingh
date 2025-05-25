import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Flex, Stack, Text } from "@chakra-ui/react";

import footerData from "@/utils/footerData";
import MaxWidthWrapper from "@/wrappers/MaxWidthWrapper";

const ListHeader = ({ children }: { children: ReactNode }) => {
  return (
    <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
      {children}
    </Text>
  );
};

export default function Footer() {
  return (
    <MaxWidthWrapper>
      <Flex
        justifyContent={"space-between"}
        gap="11"
        py="10"
        flexWrap={"wrap"}
        fontSize={"md"}
        color={"gray.400"}
      >
        {/* <Stack align={"flex-start"}>
          <Link to="/">
            <Image alt="Kontraa" src="/images/logo.png" h={150} w={150} />
          </Link>
        </Stack> */}

        <Stack align={"flex-start"}>
          <ListHeader>Company</ListHeader>
          {footerData.company?.map((object, key) => (
            <Text
              key={key}
              _hover={{
                color: "white",
                textDecoration: "none",
              }}
            >
              <Link to={object.path} color={"gray.400"}>
                {object.title}
              </Link>
            </Text>
          ))}
        </Stack>

        <Stack align={"flex-start"}>
          <ListHeader>Support</ListHeader>
          {footerData.support?.map((object, key) => (
            <Text
              key={key}
              _hover={{
                color: "white",
                textDecoration: "none",
              }}
            >
              <Link to={object.path!} color={"gray.400"}>
                {object.title}
              </Link>
            </Text>
          ))}
        </Stack>

        <Stack align={"flex-start"}>
          <ListHeader>Communities</ListHeader>
          {footerData.communities?.map((object, key) => (
            <Text
              key={key}
              _hover={{
                color: "white",
                textDecoration: "none",
              }}
            >
              <Link to={object.path!} color={"gray.400"}>
                {object.title}
              </Link>
            </Text>
          ))}
        </Stack>

        <Stack align={"flex-start"}>
          <ListHeader>Social Media</ListHeader>
          {footerData.socialButton?.map((object, key) => (
            <Text
              key={key}
              _hover={{
                color: "white",
                textDecoration: "none",
              }}
            >
              <Link to={object.path} color={"gray.400"}>
                <Flex as={"span"} alignItems="center" gap="2">
                  {object.logo}
                  {object.title}
                </Flex>
              </Link>
            </Text>
          ))}
        </Stack>
      </Flex>

      {/* <Divider /> */}
      <Text textAlign="center" py="2">
        &copy; UKA Music Publishing. All rights reserved
      </Text>
    </MaxWidthWrapper>
  );
}
