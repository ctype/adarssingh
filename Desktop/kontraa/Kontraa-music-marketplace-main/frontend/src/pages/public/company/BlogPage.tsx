import { Link } from "react-router-dom";
import {
  Card,
  Grid,
  GridItem,
  Image,
  Stack,
  Text,
  Link as ChakraLink,
} from "@chakra-ui/react";

import MaxWidthWrapper from "@/wrappers/MaxWidthWrapper";

export default function BlogPage() {
  return (
    <MaxWidthWrapper>
      <h2>Blogs</h2>
      <Grid
        templateColumns={{
          base: "repeat(1, 1fr)",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
          xl: "repeat(3, 1fr)",
        }}
        gap={8}
        py={14}
        px={6}
      >
        {blog.map((b) => (
          <GridItem key={b.id} colSpan={1}>
            <Card.Root maxW="sm" bg="gray.900" color={"white"} border={"none"}>
              <Card.Body>
                <Image src={b.image} borderRadius="lg" />
                <Stack mt="3" gap={2}>
                  <h4>{b.title}</h4>
                  <Text>{b.desc}</Text>
                  <ChakraLink asChild color={"blue.500"}>
                    <Link to={`/blog/${b.id}`}>Read More...</Link>
                  </ChakraLink>
                </Stack>
              </Card.Body>
            </Card.Root>
          </GridItem>
        ))}
      </Grid>
    </MaxWidthWrapper>
  );
}

const blog = [
  {
    id: 1,
    image: "/images/hero.png",
    title: "Living room Sofa",
    desc: "This sofa is perfect for modern tropical spaces, baroque inspired spaces, earthy toned spaces and for people who love a chic design with a sprinkle of vintage design.",
  },
  {
    id: 2,
    image: "/images/hero.png",
    title: "Living room Sofa",
    desc: "This sofa is perfect for modern tropical spaces, baroque inspired spaces, earthy toned spaces and for people who love a chic design with a sprinkle of vintage design.",
  },
  {
    id: 3,
    image: "/images/hero.png",
    title: "Living room Sofa",
    desc: "This sofa is perfect for modern tropical spaces, baroque inspired spaces, earthy toned spaces and for people who love a chic design with a sprinkle of vintage design.",
  },
  {
    id: 4,
    image: "/images/hero.png",
    title: "Living room Sofa",
    desc: "This sofa is perfect for modern tropical spaces, baroque inspired spaces, earthy toned spaces and for people who love a chic design with a sprinkle of vintage design.",
  },
  {
    id: 5,
    image: "/images/hero.png",
    title: "Living room Sofa",
    desc: "This sofa is perfect for modern tropical spaces, baroque inspired spaces, earthy toned spaces and for people who love a chic design with a sprinkle of vintage design.",
  },
  {
    id: 6,
    image: "/images/hero.png",
    title: "Living room Sofa",
    desc: "This sofa is perfect for modern tropical spaces, baroque inspired spaces, earthy toned spaces and for people who love a chic design with a sprinkle of vintage design.",
  },
  {
    id: 7,
    image: "/images/hero.png",
    title: "Living room Sofa",
    desc: "This sofa is perfect for modern tropical spaces, baroque inspired spaces, earthy toned spaces and for people who love a chic design with a sprinkle of vintage design.",
  },
  {
    id: 8,
    image: "/images/hero.png",
    title: "Living room Sofa",
    desc: "This sofa is perfect for modern tropical spaces, baroque inspired spaces, earthy toned spaces and for people who love a chic design with a sprinkle of vintage design.",
  },
  {
    id: 9,
    image: "/images/hero.png",
    title: "Living room Sofa",
    desc: "This sofa is perfect for modern tropical spaces, baroque inspired spaces, earthy toned spaces and for people who love a chic design with a sprinkle of vintage design.",
  },
  {
    id: 10,
    image: "/images/hero.png",
    title: "Living room Sofa",
    desc: "This sofa is perfect for modern tropical spaces, baroque inspired spaces, earthy toned spaces and for people who love a chic design with a sprinkle of vintage design.",
  },
  {
    id: 1,
    image: "/images/hero.png",
    title: "Living room Sofa",
    desc: "This sofa is perfect for modern tropical spaces, baroque inspired spaces, earthy toned spaces and for people who love a chic design with a sprinkle of vintage design.",
  },
];
