import { ReactNode } from "react";
import { Search } from "lucide-react";
import { Box, Flex } from "@chakra-ui/react";
import { NavLink, useLocation } from "react-router-dom";

import heroPillsData from "@/utils/heroPillsData";
import PublicSearchInput from "./PublicSearchInput";
import MaxWidthWrapper from "@/wrappers/MaxWidthWrapper";

interface HeroSectionProps {
  title: string;
  landingHero: boolean;
}

export default function HeroSection(props: HeroSectionProps) {
  const { title, landingHero } = props;
  const { pathname } = useLocation();

  return (
    <Box
      backgroundImage={`url(${landingHero ? "/images/hero.png" : "/images/hero-second.png"})`}
      backgroundSize={"cover"}
      backgroundRepeat={"no-repeat"}
      py={12}
    >
      <MaxWidthWrapper>
        <Flex direction={"column"} h={"full"} justifyContent={"center"}>
          <Flex direction="column" gap={3} w={{ base: "full", lg: "2/3" }}>
            <h1>{title}</h1>
            <PublicSearchInput
              button="Search"
              logo={<Search size="22" />}
              placeholder="Try searching music, tracks.."
              color="white"
              width="48%"
              py={2}
              radius="md"
            />
          </Flex>

          <Flex
            w={{ base: "full", md: "2/3" }}
            wrap="wrap"
            gap={4}
            marginTop={4}
          >
            {heroPillsData.map((data) => {
              if (pathname.split("/").slice(0, 2).join("/") === data.navUrl) {
                return (
                  <NavPill
                    key={data.name}
                    isActive={true}
                    name={data.name}
                    icon={data.icon}
                  />
                );
              }
              return (
                <NavLink to={data.navUrl} key={data.name}>
                  <NavPill isActive={false} name={data.name} icon={data.icon} />
                </NavLink>
              );
            })}
          </Flex>
        </Flex>
      </MaxWidthWrapper>
    </Box>
  );
}

function NavPill({
  isActive,
  icon,
  name,
}: {
  isActive: boolean;
  icon: ReactNode;
  name: string;
}) {
  return (
    <Flex
      as="span"
      alignItems="center"
      gap={"2"}
      rounded="full"
      cursor="pointer"
      userSelect={"none"}
      color="white"
      bg={isActive ? "blue.500" : "gray.800"}
      _hover={{
        bg: isActive ? "blue.600" : "gray.700",
      }}
      py={2}
      px={3}
    >
      {icon}
      {name}
    </Flex>
  );
}
