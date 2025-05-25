import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Flex, Link } from "@chakra-ui/react";

import ProfileTop from "./_components/ProfileTop";
import ProfileInfo from "./_components/ProfileInfo";
import { apolloClientQuery } from "@/apollo/apolloHelper";
import ProfileContents from "./_components/ProfileContents";
import { GET_USER_PROFILE } from "@/graphql/query/user/user.query";
import MaxWidthWrapper from "@/wrappers/MaxWidthWrapper";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { fetchSocialAccounts } from "@/features/socialMedia/socialMediaSlice";

export default function ProfilePage() {
  const { username } = useParams();
  const dispatch = useAppDispatch();
  const { socialAccounts, isPending } = useAppSelector(
    (state) => state.socialMedias
  );

  const [isFetchingUserData, setIsFetchingUserData] = useState<boolean>(true);
  const [userData, setUserData] = useState<{
    user: Partial<User>;
    audios: Partial<Track>[];
    presets: Partial<Preset>[];
    soundBanks: Partial<SoundBank>[];
    soundEffects: Partial<SoundEffect>[];
  }>({
    user: {
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      country: "",
      biography: "",
    },
    audios: [],
    presets: [],
    soundBanks: [],
    soundEffects: [],
  });

  const updateFollower = (isAdd: boolean) => {
    setUserData((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        followersCount: (prev.user.followersCount || 0) + (isAdd ? 1 : -1),
      },
    }));
  };

  useEffect(() => {
    (async () => {
      const result = await apolloClientQuery(GET_USER_PROFILE, { username });
      if (result.getUserProfile) {
        setUserData(result.getUserProfile);
      }
      return result.getUserProfile;
    })()
      .then((d) => {
        if (d.user) {
          dispatch(fetchSocialAccounts({ userId: d.user.id })).unwrap();
        }
      })
      .finally(() => setIsFetchingUserData(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MaxWidthWrapper>
      <Box mx="auto" my={10} overflowX={"hidden"}>
        <ProfileTop
          user={userData.user as unknown as Contributor}
          updateFollower={updateFollower}
          loading={isFetchingUserData || isPending}
          socialAccounts={socialAccounts}
        />
        <Flex
          alignItems="start"
          direction={{ base: "column", lg: "row" }}
          gap={4}
          w={"full"}
          mx={"auto"}
        >
          <ProfileInfo
            user={userData.user as unknown as Contributor}
            totalTracks={
              userData.audios.length +
              userData.presets.length +
              userData.soundBanks.length +
              userData.soundEffects.length
            }
            socialAccounts={socialAccounts}
          />
          <ProfileContents
            audios={userData.audios}
            presets={userData.presets}
            soundBanks={userData.soundBanks}
            soundEffects={userData.soundEffects}
          />
        </Flex>
      </Box>
    </MaxWidthWrapper>
  );
}

interface SocialLinkDatasType {
  label?: string;
  logo: JSX.Element;
  path: string;
  color?: string;
}

export const SocialButton = (props: SocialLinkDatasType) => {
  const { logo, label, path, color = "White" } = props;

  return (
    <Link href={path} color={color} _hover={{ color: "white" }}>
      {logo}
      {label ? label : ""}
    </Link>
  );
};
