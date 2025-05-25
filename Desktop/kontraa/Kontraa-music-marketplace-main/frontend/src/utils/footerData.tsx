import { FaFacebook, FaInstagram, FaSoundcloud } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiBeatport, SiPixabay } from "react-icons/si";

const footerData = {
  company: [
    {
      title: "About",
      path: "/about",
    },
    // {
    //   title: "Blog",
    //   path: "/blog",
    // },
    {
      title: "Contact",
      path: "/contact",
    },
    {
      title: "FAQ",
      path: "/faq",
    },
  ],

  support: [
    {
      title: "Help Center",
      path: "/help-center",
    },
    {
      title: "Terms of Service",
      path: "/terms-of-service",
    },
    {
      title: "About Licensing",
      path: "/licensing",
    },
    {
      title: "DMCA",
      path: "/dmca",
    },
    {
      title: "Privacy Policy",
      path: "/privacy-policy",
    },
  ],

  communities: [
    // {
    //   title: "For label/Studio",
    // },
    // {
    //   title: "For Advertising",
    // },
    {
      title: "Become a Contributor",
      path: "/contributor",
    },
  ],

  socialButton: [
    {
      title: "X",
      logo: <FaXTwitter />,
      path: "https://x.com/Kontraamusic",
    },
    // {
    //   title: "YouTube",
    //   logo: <FaYoutube />,
    //   path: "/",
    // },
    {
      title: "Instagram",
      logo: <FaInstagram />,
      path: "http://instagram.com/kontraamusic",
    },
    {
      title: "Facebook",
      logo: <FaFacebook />,
      path: "https://www.facebook.com/prazkhanalmusic",
    },
    {
      title: "Beatport",
      logo: <SiBeatport />,
      path: "https://www.beatport.com/label/uka-records/108733",
    },
    {
      title: "Pixabay",
      logo: <SiPixabay />,
      path: "https://pixabay.com/users/24653570/",
    },
    {
      title: "SoundCloud",
      logo: <FaSoundcloud />,
      path: "https://soundcloud.com/praz_khanal",
    },
  ],
};

export default footerData;
