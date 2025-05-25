import { useEffect, useState } from "react";
import { MapPin, Plus } from "lucide-react";
import { Flex, HStack, Image, Text, VStack } from "@chakra-ui/react";

import { useAppSelector } from "@/app/store";
import { SocialButton } from "../ProfilePage";
import { Button } from "@/components/ui/button";
import { apolloClientMutate } from "@/apollo/apolloHelper";
import {
  FOLLOW_CONTRIBUTOR,
  IS_FOLLOWING,
  UNFOLLOW_CONTRIBUTOR,
} from "@/graphql/mutation/social_system/follow.mutation";
import { Skeleton } from "@/components/ui/skeleton";
import { socialMediaIcons } from "@/utils/social_media_svg";

interface IProfileTopProps {
  user: Partial<Contributor> | undefined;
  updateFollower: (isAddition: boolean) => void;
  loading: boolean;
  socialAccounts: UserSocialAccount[];
}

export default function ProfileTop({
  user,
  updateFollower,
  loading,
  socialAccounts,
}: IProfileTopProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const { myProfile } = useAppSelector((state) => state.systemUser);

  const follow = async () => {
    try {
      await apolloClientMutate(FOLLOW_CONTRIBUTOR, {
        toFollowUserId: user?.id,
      }).then(() => {
        updateFollower(true);
        setIsFollowing(true);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const unfollow = async () => {
    try {
      await apolloClientMutate(UNFOLLOW_CONTRIBUTOR, {
        toUnfollowUserId: user?.id,
      }).then(() => {
        updateFollower(false);
        setIsFollowing(false);
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      if (myProfile) {
        (async () => {
          try {
            const res = await apolloClientMutate(IS_FOLLOWING, {
              followId: user.id,
            });
            setIsFollowing(res.isFollowing);
          } catch (error) {
            console.error(error);
          }
        })();
      }
    }
  }, [user, myProfile]);

  return (
    <Flex
      position={"relative"}
      padding={6}
      w="100%"
      height="300px"
      alignItems="center"
      gap={{ base: 5, sm: 10 }}
      bg="black"
      background="url(/images/hero-second.png)"
      objectFit="contain"
      bgSize="cover"
      bgRepeat="no-repeat"
      backgroundColor={"#000"}
      rounded={"lg"}
      color="fullWhite"
      pl={{ xl: 24 }}
      direction={{
        base: "column",
        sm: "row",
      }}
      justifyContent={{ base: "center", xl: "start" }}
    >
      <Image
        src={
          user?.profilePath
            ? import.meta.env.VITE_AWS_BUCKET_LINK + user?.profilePath
            : `https://api.dicebear.com/9.x/initials/png?seed=${user?.firstName} ${user?.lastName}`
        }
        alt="profile img"
        w={{ base: "130px", sm: "150px", md: "160px" }}
        h={{ base: "130px", sm: "150px", md: "160px" }}
        borderRadius="50%"
        p={0}
        objectFit="cover"
      />
      {loading ? (
        <VStack align="start">
          <Skeleton w="72" h="12" backgroundColor="gray.500" />
          <Skeleton w="48" h="4" backgroundColor="gray.500" />
          <Skeleton w="48" h="4" backgroundColor="gray.500" />
          <Skeleton w="96" h="8" backgroundColor="gray.500" />
        </VStack>
      ) : (
        <VStack gap={0} align={"start"}>
          <HStack alignItems={"center"} justifyContent={"center"} gap={2}>
            <h2>
              {user?.firstName} {user?.lastName}
            </h2>
            {myProfile?.id !== user?.id && (
              <>
                {isFollowing ? (
                  <Button
                    backgroundColor={"gray.800"}
                    color={"white"}
                    mt={3}
                    onClick={unfollow}
                  >
                    Unfollow
                  </Button>
                ) : (
                  <Button colorPalette={"blue"} mt={3} onClick={follow}>
                    <Plus />
                    Follow
                  </Button>
                )}
              </>
            )}
          </HStack>
          <Text>@{user?.username}</Text>
          {/* <Text>Music Producer</Text> */}
          <HStack gap={1}>
            <MapPin size={16} />
            <Text>{user?.country}</Text>
          </HStack>
          <Text as="p" textAlign="justify">
            {user?.biography}
          </Text>
        </VStack>
      )}
      <HStack
        align=""
        alignContent="end"
        gap={6}
        position="absolute"
        display={{ base: "none", md: "flex" }}
        bottom={6}
        right={6}
      >
        {socialAccounts?.map((sa) => (
          <section key={sa.id} className="text-xl hover:text-white">
            <SocialButton
              path={sa.socialAccountLink}
              logo={
                socialMediaIcons[
                  (sa.socialAccountType as SocialAccountType).svgIndex
                ].icon
              }
            />
          </section>
        ))}
      </HStack>
    </Flex>
  );
}
