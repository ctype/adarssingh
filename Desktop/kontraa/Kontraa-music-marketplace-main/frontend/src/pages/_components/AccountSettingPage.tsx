import { Box, Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  createUpdatePreference,
  fetchMyPreferences,
  profileData,
  updateProfileData,
} from "@/features/system_user/systemUserSlice";
import { toaster } from "@/components/ui/toaster";
import AccountInformationProfileSeciton from "@/components/settings/AccountInformationProfileSection";
import PersonalInformationProfileSeciton from "@/components/settings/PersonalInformationProfileSection";
import PreferenceSetting from "@/components/settings/PreferenceSetting";

export default function AccountSetting() {
  const dispatch = useAppDispatch();
  const { myProfile, isPending, myPreferences } = useAppSelector(
    (state) => state.systemUser
  );
  const [userData, setUserData] = useState<Partial<BaseUser>>({});
  const [userPreferences, setUserPreferences] = useState<Partial<Preference>[]>(
    []
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const sendingData = {
      username: userData.username,
      email: userData.email,
      biography: userData.biography,
      firstName: userData.firstName,
      lastName: userData.lastName,
      mobileNumber: Number(userData.mobileNumber),
      profilePath: userData.profilePath,
    };

    if ((formData.get("profilePath") as File).size <= 0) {
      delete sendingData.profilePath;
    } else {
      if (userData.profilePath === null) {
        sendingData.profilePath = formData.get("profilePath") as File;
      }
    }

    await dispatch(updateProfileData(sendingData))
      .unwrap()
      .then(() => {
        dispatch(createUpdatePreference({ data: userPreferences }))
          .unwrap()
          .then(() => {
            toaster.create({
              title: "Profile updated",
              type: "success",
              description: "Successfully updated your profile data",
            });
          });
      });
  };

  useEffect(() => {
    if (myProfile) {
      setUserData(myProfile as Partial<BaseUser>);
    } else {
      dispatch(profileData())
        .unwrap()
        .then((data) => {
          if (data.me) {
            setUserData(data.me as Partial<BaseUser>);
          }
        });
    }
    if (myPreferences.length > 0) {
      setUserPreferences(myPreferences);
    } else {
      dispatch(fetchMyPreferences())
        .unwrap()
        .then((data) => {
          setUserPreferences(data.myPreferences as Partial<Preference>[]);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box pb={46}>
      <h3>Account Setting</h3>
      <form onSubmit={handleSubmit}>
        <AccountInformationProfileSeciton
          data={userData}
          setData={setUserData}
        />

        <PersonalInformationProfileSeciton
          data={userData}
          setData={setUserData}
        />

        <PreferenceSetting
          data={userPreferences}
          setData={setUserPreferences}
        />

        <Flex
          w={"full"}
          p={2}
          alignItems="center"
          justifyContent={"end"}
          backgroundColor={"#000"}
        >
          <Button
            type="submit"
            colorPalette={"blue"}
            loading={isPending}
            loadingText="Updating.."
            w={{ base: "full", md: "fit-content" }}
          >
            Update Changes
          </Button>
        </Flex>
      </form>
    </Box>
  );
}
