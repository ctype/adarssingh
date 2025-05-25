import { Headphones, Image, Music, Music2, Music4, Video } from "lucide-react";

const heroPillsData = [
  {
    name: "Music",
    icon: <Music size={18} />,
    navUrl: "/tracks",
  },
  {
    name: "Sound Effects",
    icon: <Music2 size={18} />,
    navUrl: "/sound-effects",
  },
  {
    name: "Sound Banks",
    icon: <Music4 size={18} />,
    navUrl: "/sound-banks",
  },
  {
    name: "Presets",
    icon: <Headphones size={18} />,
    navUrl: "/presets",
  },
  {
    name: "Videos",
    icon: <Video size={18} />,
    navUrl: "/videos",
  },
  {
    name: "Photo",
    icon: <Image size={18} />,
    navUrl: "/photos",
  },
];

export default heroPillsData;
