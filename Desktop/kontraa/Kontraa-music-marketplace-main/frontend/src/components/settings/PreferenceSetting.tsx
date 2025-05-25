import React from "react";
import { Box, Flex, GridItem, Separator, Text, VStack } from "@chakra-ui/react";

import { Switch } from "../ui/switch";
import ProfileSectionWrapper from "./ProfileSectionWrapper";

interface IPreferenceSettingProps {
  data: Partial<Preference>[];
  setData: React.Dispatch<React.SetStateAction<Partial<Preference>[]>>;
}

export default function PreferenceSetting({
  data,
  setData,
}: IPreferenceSettingProps) {
  const handleCheckChange = (name: string, value: string) => {
    const isPreferencePresent = data.find((d) => d.name === name);
    let presentPreferences = data;
    const newPreferences: Partial<Preference>[] = [];

    if (isPreferencePresent) {
      presentPreferences = presentPreferences.map((pp) => {
        if (pp.name === name) {
          return { name, value };
        }
        return { name: pp.name, value: pp.value };
      });
    } else {
      presentPreferences = presentPreferences.map((pp) => {
        return { name: pp.name, value: pp.value };
      });
      newPreferences.push({ name, value });
    }
    setData([...presentPreferences, ...newPreferences]);
  };

  return (
    <ProfileSectionWrapper
      label="Preference Settings"
      description="Update your preferences"
    >
      <GridItem colSpan={2} display="flex" flexDirection={"column"} gap={4}>
        <Box>
          <h4>Web Notifications</h4>
          <Text color={"gray.600"} fontWeight={"medium"}>
            Enable or disable web notification
          </Text>
        </Box>
        {notificationPreferences.web.map((noti) => (
          <Flex
            key={noti.id}
            alignItems={"center"}
            justifyContent={"space-between"}
            w={"full"}
          >
            <VStack alignItems={"start"} gap={1}>
              <Text fontWeight={"semibold"} fontSize="md">
                {noti.title}
              </Text>
              <Text fontWeight={"medium"} color="gray.600">
                {noti.description}
              </Text>
            </VStack>
            <Switch
              checked={data.find((d) => d.name === noti.name)?.value === "yes"}
              onCheckedChange={(e) =>
                handleCheckChange(noti.name, e.checked ? "yes" : "no")
              }
              colorPalette={"blue"}
            />
          </Flex>
        ))}
      </GridItem>
      <GridItem colSpan={2}>
        <Separator />
      </GridItem>
      <GridItem colSpan={2} display="flex" flexDirection={"column"} gap={4}>
        <Box>
          <h4>Email Notifications</h4>
          <Text color={"gray.600"} fontWeight={"medium"}>
            Enable or disable email notification
          </Text>
        </Box>
        {notificationPreferences.mail.map((noti) => (
          <Flex
            key={noti.id}
            alignItems={"center"}
            justifyContent={"space-between"}
            w={"full"}
          >
            <VStack alignItems={"start"} gap={1}>
              <Text fontWeight={"semibold"} fontSize="md">
                {noti.title}
              </Text>
              <Text fontWeight={"medium"} color="gray.600">
                {noti.description}
              </Text>
            </VStack>
            <Switch
              checked={data.find((d) => d.name === noti.name)?.value === "yes"}
              onCheckedChange={(e) =>
                handleCheckChange(noti.name, e.checked ? "yes" : "no")
              }
              colorPalette={"blue"}
            />
          </Flex>
        ))}
      </GridItem>
    </ProfileSectionWrapper>
  );
}

const notificationPreferences = {
  web: [
    {
      id: 0,
      title: "Social activities (Likes, comments, etc)",
      description: "Enable web notification for social activities",
      name: "web-social-activities",
    },
    {
      id: 1,
      title: "Downloads and uploads",
      description: "Enable web notification for downloads and uploads",
      name: "web-download-activities",
    },
  ],
  mail: [
    {
      id: 0,
      title: "Social activities (Likes, comments, etc)",
      description: "Enable mail notification for social activities",
      name: "mail-social-activities",
    },
    {
      id: 1,
      title: "Downloads and uploads",
      description: "Enable mail notification for downloads and uploads",
      name: "mail-download-activities",
    },
  ],
};
