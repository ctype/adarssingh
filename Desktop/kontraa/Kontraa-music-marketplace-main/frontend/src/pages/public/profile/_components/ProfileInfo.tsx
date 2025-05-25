import { Award, Shield, Trophy } from "lucide-react";

import {
  Box,
  Flex,
  HStack,
  Separator,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { SocialButton } from "../ProfilePage";
import CustomTooltip from "@/components/global/CustomTooltip";
import { socialMediaIcons } from "@/utils/social_media_svg";

interface IProfileInfoProps {
  user: Partial<Contributor> | undefined;
  totalTracks: number;
  socialAccounts: UserSocialAccount[];
}
export default function ProfileInfo({
  totalTracks,
  user,
  socialAccounts,
}: IProfileInfoProps) {
  return (
    <Stack
      color={"gray.400"}
      w={{ base: "full", lg: "20vw" }}
      bg="primary"
      marginBlock={8}
      borderRadius={5}
      gap={2}
    >
      <Flex
        direction={{ base: "column", sm: "row", lg: "column" }}
        gap={4}
        justifyContent={{ base: "space-between" }}
        h={"full"}
      >
        <VStack
          alignItems="start"
          justifyContent="center"
          fontSize="0.9rem"
          color="secondary2"
          fontWeight={500}
        >
          <HStack
            alignItems={"center"}
            justifyContent="space-between"
            w={"full"}
          >
            <Text>Followers</Text>
            <span>{user?.followersCount}</span>
          </HStack>
          <HStack
            alignItems={"center"}
            justifyContent="space-between"
            w={"full"}
          >
            <Text>Following</Text>
            <span>{user?.followingCount}</span>
          </HStack>
          <HStack
            alignItems={"center"}
            justifyContent="space-between"
            w={"full"}
          >
            <Text>Tracks</Text>
            <span>{totalTracks}</span>
          </HStack>
        </VStack>
        <Separator
          borderColor="gray.600"
          h={{ base: ".5rem", sm: "5rem", lg: "0px" }}
          w={{ base: "full", sm: "fit", lg: "full" }}
          orientation={{
            base: "horizontal",
            sm: "vertical",
            lg: "horizontal",
          }}
        />

        {/* <VStack>
          <Text fontWeight="medium" fontSize="md" textTransform="uppercase">
            Starts
          </Text>
          <HStack gap={6} alignItems="start">
            <CustomTooltip content="Stream">
              <Radio size={24} />
            </CustomTooltip>
            <CustomTooltip content="Like">
              <ThumbsUp size={24} />
            </CustomTooltip>
            <CustomTooltip content="Download">
              <Download size={24} />
            </CustomTooltip>
          </HStack>
        </VStack> */}

        <VStack padding={0} alignItems={"start"} gap={4}>
          <Text fontWeight="medium" fontSize="md" textTransform="uppercase">
            Achievements
          </Text>
          <HStack fontSize="2rem" gap={6}>
            <CustomTooltip content="Achievements 1">
              <Trophy size={24} />
            </CustomTooltip>
            <CustomTooltip content="Achievements 2">
              <Award size={24} />
            </CustomTooltip>
            <CustomTooltip content="Achievements 3">
              <Shield size={24} />
            </CustomTooltip>
          </HStack>
        </VStack>
      </Flex>
      <Separator borderColor="gray.600" my={4} />
      <VStack padding={0} alignItems="start" w="full">
        <Text
          fontWeight="medium"
          fontSize="md"
          textTransform="uppercase"
          textAlign="left"
          color="textGray"
        >
          Also Find Me
        </Text>
        <VStack alignItems="start" gap={2}>
          {socialAccounts?.map((sa) => (
            <Box key={sa.id}>
              <SocialButton
                path={sa.socialAccountLink}
                logo={
                  socialMediaIcons[
                    (sa.socialAccountType as SocialAccountType).svgIndex
                  ].icon
                }
                label={
                  socialMediaIcons[
                    (sa.socialAccountType as SocialAccountType).svgIndex
                  ].name
                }
                color="gray.400"
              />
            </Box>
          ))}
        </VStack>
      </VStack>
    </Stack>
  );
}
