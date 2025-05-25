import React, { useEffect } from "react";
import { Box, Flex } from "@chakra-ui/react";

import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { toaster } from "@/components/ui/toaster";
import SocialAccountSeciton from "@/components/settings/SocialAccountSection";
import {
  createUpdateSocialAccount,
  fetchSocialAccounts,
} from "@/features/socialMedia/socialMediaSlice";

export default function ContributorSocialAccountSettingPage() {
  const dispatch = useAppDispatch();
  const { myProfile, isPending } = useAppSelector((state) => state.systemUser);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const links = formData.getAll("link");
    const ids = formData.getAll("id");

    const data = [];

    for (let i = 0; i < links.length; i++) {
      const link = links[i];

      if (link !== "") {
        data.push({
          link: link as string,
          id: Number(ids[i] as string),
        });
      }
    }

    await dispatch(
      createUpdateSocialAccount({
        data,
      })
    )
      .unwrap()
      .then(() => {
        toaster.create({
          title: "Social account link updated",
          type: "success",
          description: "Successfully updated your social media links",
        });
      });
  };

  useEffect(() => {
    if (myProfile) {
      dispatch(fetchSocialAccounts({ userId: myProfile.id }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      <h3>Social Accounts</h3>
      <form onSubmit={handleSubmit}>
        <SocialAccountSeciton />

        <Flex
          w={"full"}
          p={2}
          position={"sticky"}
          bottom={0}
          alignItems="center"
          justifyContent={"end"}
          backgroundColor={"#000"}
        >
          <Button
            backgroundColor={"blue.700"}
            type="submit"
            color={"white"}
            loading={isPending}
            loadingText="Updating.."
          >
            Update Changes
          </Button>
        </Flex>
      </form>
    </Box>
  );
}
