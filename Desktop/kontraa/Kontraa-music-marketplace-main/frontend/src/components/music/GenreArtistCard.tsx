import { Link } from "react-router-dom";

import { Card, Image, Text } from "@chakra-ui/react";

interface IGenreArtistCardProps {
  image: string;
  name?: string;
  path: string;
  bg?: string;
  imageRadius?: string;
  hover?: boolean;
  boxSize?: string;
  opacity?: boolean;
  isOpacityEffect?: boolean;
}

export default function GenreArtistCard(props: IGenreArtistCardProps) {
  const {
    image,
    name,
    path,
    imageRadius = "md",
    isOpacityEffect = false,
  } = props;
  const imageBoxSize = props.boxSize || "200px";

  return (
    <Link to={path}>
      <Card.Root
        backgroundColor={"transparent"}
        border="none"
        userSelect={"none"}
        _hover={{
          backgroundColor: isOpacityEffect ? "initial" : "#141414",
          opacity: isOpacityEffect ? 0.75 : 1,
        }}
        justifyContent="center"
        alignItems="center"
      >
        <Card.Body padding={2} textAlign="left" className="cursor-pointer">
          <Image
            minW={imageBoxSize}
            maxW={imageBoxSize}
            minH={imageBoxSize}
            maxH={imageBoxSize}
            src={image}
            alt="Genre Type"
            border=".5px solid #2f2f2f"
            borderRadius={imageRadius}
            objectFit={"cover"}
            aspectRatio={1}
          />
          <Text color={"white"} textAlign={"center"} my={2}>
            {name}
          </Text>
        </Card.Body>
      </Card.Root>
    </Link>
  );
}
