import { createListCollection } from "@chakra-ui/react";
import {
  SiBeatport,
  SiFacebook,
  SiInstagram,
  SiPixabay,
  SiSoundcloud,
  SiX,
  SiYoutube,
} from "react-icons/si";

export const socialMediaIcons = [
  {
    id: 0,
    name: "X",
    icon: <SiX />,
  },
  {
    id: 1,
    name: "Youtube",
    icon: <SiYoutube />,
  },
  {
    id: 2,
    name: "Instagram",
    icon: <SiInstagram />,
  },
  {
    id: 3,
    name: "Facebook",
    icon: <SiFacebook />,
  },
  {
    id: 4,
    name: "Beatport",
    icon: <SiBeatport />,
  },
  {
    id: 5,
    name: "SoundCloud",
    icon: <SiSoundcloud />,
  },
  {
    id: 6,
    name: "Pixabay",
    icon: <SiPixabay />,
  },
];

export const socialMediaIconList = createListCollection({
  items: socialMediaIcons.map((c) => ({
    label: c.icon,
    value: c.id.toString(),
  })),
});
