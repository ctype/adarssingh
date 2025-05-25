import { useEffect } from "react";
import { Box, GridItem } from "@chakra-ui/react";

import CustomInput from "../form/CustomInput";
import ProfileSectionWrapper from "./ProfileSectionWrapper";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  fetchSocialAccountTypes,
  removeSocialAccount,
} from "@/features/socialMedia/socialMediaSlice";
import { Button } from "../ui/button";

export default function SocialAccountSeciton() {
  const dispatch = useAppDispatch();
  const { socialAccountTypes, socialAccounts, isPending } = useAppSelector(
    (state) => state.socialMedias
  );

  const removeSocialLink = async (id: number) => {
    dispatch(removeSocialAccount({ id })).unwrap();
  };

  useEffect(() => {
    dispatch(fetchSocialAccountTypes()).unwrap();
  }, [dispatch]);

  return (
    <ProfileSectionWrapper
      label="Social Media links"
      description="Update your social media links"
    >
      {socialAccountTypes.map((sat) => {
        const sa = socialAccounts.find(
          (sa) => (sa.socialAccountType as SocialAccountType).id === sat.id
        );
        return (
          <Box
            display={"grid"}
            gridTemplateColumns={"repeat(4, 1fr)"}
            gap={2}
            alignItems={sa ? "end" : "center"}
            key={sat.id}
            w="full"
          >
            <GridItem colSpan={sa ? 3 : 4}>
              <CustomInput
                label={sat.socialAccountTypeName}
                name="link"
                disabled={isPending}
                required={false}
                defaultValue={sa?.socialAccountLink}
                placeholder="Enter the link"
              />
            </GridItem>
            {sa && (
              <Button
                bg={"red.700"}
                color="white"
                onClick={() => removeSocialLink(sa.id)}
              >
                Remove Link
              </Button>
            )}
            <CustomInput
              label={""}
              name="id"
              disabled={isPending}
              required={false}
              defaultValue={sat.id?.toString()}
              type="hidden"
            />
          </Box>
        );
      })}
    </ProfileSectionWrapper>
  );
}
