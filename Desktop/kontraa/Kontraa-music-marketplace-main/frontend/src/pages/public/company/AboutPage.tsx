import { Box, Flex, Image, Text } from "@chakra-ui/react";

// import video from "@/assets/videos/sample1.mp4";
import MaxWidthWrapper from "@/wrappers/MaxWidthWrapper";

const aboutUs = [
  {
    title: "Who we are",
    paragraph:
      "Kontraa is a dynamic collective of creators innovators and technologists reshoping the digital content landscape.",
    image: "/images/q.png",
  },
  {
    title: "Where We Belong",
    paragraph:
      "We thrive at the intersection of creativity and technology, empowering creators worldwide to amplify thier impact.",
    image: "/images/q.png",
  },
  {
    title: "How We Work",
    paragraph:
      "Our collaborative culture fastens creativity and innovtaion, driven by a passion for excellence and continious improvement.",
    image: "/images/q.png",
  },
  {
    title: "How We Contribute",
    paragraph:
      "Each team members brings unique skills and perspective,contributing to a vibrant ecosystem of creativity and growth.",
    image: "/images/q.png",
  },
  {
    title: "How We Plan For The Future",
    paragraph:
      "We envision a future where every creator has the tools and support they need to succed in a rapidly evolving digital world.",
    image: "/images/q.png",
  },
  {
    title: "How We Act",
    paragraph:
      "Integrity, transparency, and inclusivity define our actions, ensuring trust and respect in all our interactions.",
    image: "/images/q.png",
  },
  {
    title: "Why Choose Kontraa",
    paragraph:
      "Join us to unleash your potential, make a global impact, and be part of a supportive community driving innovations forward.",
    image: "/images/q.png",
  },
];

export default function AboutPage() {
  return (
    <>
      <Box position={"relative"} overflow={"hidden"} maxH={"400px"} w={"full"}>
        <video
          src={
            "https://videos.pexels.com/video-files/2022395/2022395-sd_640_360_30fps.mp4"
          }
          autoPlay
          loop
          muted
          style={{ width: "100%" }}
        />
        <Box
          position={"absolute"}
          top={0}
          left={0}
          right={0}
          bottom={0}
          backgroundColor={"blackAlpha.400"}
        >
          <MaxWidthWrapper>
            <Flex
              direction={"column"}
              gap={2}
              h={"full"}
              justifyContent={"center"}
            >
              <h1>DESIGN THE FUTURE</h1>
              <h4>INNOVATE WITH KONTRAA</h4>
            </Flex>
          </MaxWidthWrapper>
        </Box>
      </Box>

      <Flex direction="column" gap={8} my={10} alignItems={"center"}>
        <h2>About Us</h2>
        {aboutUs.map((about, index) => (
          <Flex
            alignItems={"center"}
            justifyContent={"space-between"}
            direction={{
              base: "column",
              md: index % 2 === 0 ? "row-reverse" : "row",
            }}
            maxWidth={"9/12"}
            mx={"auto"}
            key={index}
            gap={{ base: 4, md: 12 }}
          >
            <Box>
              <h3>{about.title}</h3>
              <Text>{about.paragraph}</Text>
            </Box>
            <Image src={about.image} h={450} w={500} />
          </Flex>
        ))}
      </Flex>
    </>
  );
}
