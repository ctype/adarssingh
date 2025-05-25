import React from "react";

import CustomInput from "../form/CustomInput";
import ProfileSectionWrapper from "./ProfileSectionWrapper";
import { Flex } from "@chakra-ui/react";
import CustomFileInput from "../form/CustomFileInput";
import CustomTextArea from "../form/CustomTextArea";

interface IAccountInformationProfileSectionProps {
  data: Partial<BaseUser>;
  setData: React.Dispatch<React.SetStateAction<Partial<BaseUser>>>;
}

export default function AccountInformationProfileSeciton({
  data,
  setData,
}: IAccountInformationProfileSectionProps) {
  return (
    <ProfileSectionWrapper
      label="Account Information"
      description="Update your account information"
    >
      <CustomFileInput
        label="Profile Image"
        name="profilePath"
        required={false}
        defaultValue={
          data?.profilePath
            ? {
                url: (import.meta.env.VITE_AWS_BUCKET_LINK +
                  data.profilePath) as string,
                name: "profile image of " + data.username,
              }
            : undefined
        }
      />
      <Flex direction={"column"} gap={4}>
        <CustomInput
          label="Email"
          name="email"
          type="email"
          value={data.email ?? ""}
          onChange={(e) =>
            setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
          }
          placeholder="Enter your email"
        />
        <CustomInput
          label="User name"
          name="username"
          value={data.username ?? ""}
          onChange={(e) =>
            setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
          }
          placeholder="Enter a username for kontraa"
        />
        <CustomTextArea
          label="About me"
          name="biography"
          value={data.biography ?? ""}
          onChange={(e) =>
            setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
          }
          placeholder="Tell us few things about yourself"
        />
      </Flex>
    </ProfileSectionWrapper>
  );
}
