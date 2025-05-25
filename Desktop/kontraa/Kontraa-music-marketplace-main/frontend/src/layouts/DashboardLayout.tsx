import { ChevronUp } from "lucide-react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { NavLink, Outlet } from "react-router-dom";
import { AccordionItem, IconButton } from "@chakra-ui/react";

import Navbar from "@/components/public/Navbar";
import {
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "@/components/ui/accordion";
import { ISidebarListType } from "@/utils/sidebarData";
import { useWindowResize } from "@/hooks/useWindowResize";
import CustomDefaultDrawer from "@/components/global/CustomDefaultDrawer";

export default function DashboardLayout({
  sidebarData,
}: {
  sidebarData: ISidebarListType[];
}) {
  const { isNavbarOpen, setIsNavbarOpen } = useWindowResize({ size: 768 });

  return (
    <Box
      as="main"
      backgroundColor={"#000"}
      color={"white"}
      maxH={"100vh"}
      overflow={"hidden"}
    >
      <Navbar isDashboardNav />
      <Flex h={"100vh"}>
        <Box
          backgroundColor={"#141414"}
          display={{ base: "none", md: "block" }}
          position={"sticky"}
          top={"0"}
          minW={"18%"}
        >
          <SidebarMenu sidebarData={sidebarData} />
        </Box>

        <Box
          display={{ base: "flex", md: "none" }}
          position={"fixed"}
          zIndex={"docked"}
          bottom={"5"}
          left={"50%"}
          translateX={"-50%"}
        >
          <CustomDefaultDrawer
            open={isNavbarOpen}
            setOpen={setIsNavbarOpen}
            trigger={
              <IconButton
                colorPalette={"white"}
                rounded={"full"}
                size={"md"}
                onClick={() => setIsNavbarOpen(true)}
              >
                <ChevronUp />
              </IconButton>
            }
          >
            <SidebarMenu
              sidebarData={sidebarData}
              closeNav={() => setIsNavbarOpen(false)}
            />
          </CustomDefaultDrawer>
        </Box>

        <Box w={"full"} overflowY={"scroll"} px={4} pt={4} pb={40}>
          <Outlet />
        </Box>
      </Flex>
    </Box>
  );
}

function SidebarMenu({
  sidebarData,
  closeNav,
}: {
  sidebarData: ISidebarListType[];
  closeNav?: () => void;
}) {
  return (
    <Box overflowX={"hidden"} p={6} pb={20} h={"95vh"}>
      <AccordionRoot
        collapsible
        defaultValue={[sidebarData.filter((c) => c.children)[0]?.id.toString()]}
        multiple
      >
        <Flex direction="column" gap={5} alignItems={"start"}>
          {sidebarData.map((c) => {
            if (!c.children) {
              return (
                <NavLink
                  to={c.link!}
                  style={({ isActive }) => ({
                    color: isActive ? "#3b82f6" : "#a1a1aa",
                  })}
                  onClick={closeNav}
                  key={c.id}
                >
                  <Flex gap={2} alignItems={"center"}>
                    {c.icon}
                    <Text>{c.title}</Text>
                  </Flex>
                </NavLink>
              );
            }

            return (
              <AccordionItem
                style={{ borderWidth: 0 }}
                value={c.id.toString()}
                h={"fit-content"}
                w={"full"}
                key={c.id}
              >
                <AccordionItemTrigger pt={0}>
                  <Text>{c.title}</Text>
                </AccordionItemTrigger>
                <AccordionItemContent pb={0}>
                  <Flex direction="column" gap={4} pl={4}>
                    {c.children.map((object) => (
                      <NavLink
                        to={object.link!}
                        key={object.id}
                        style={({ isActive }) => ({
                          color: isActive ? "#3b82f6" : "#a1a1aa",
                        })}
                        onClick={closeNav}
                      >
                        <Flex gap={2} alignItems={"center"}>
                          {object.icon}
                          <Text>{object.title}</Text>
                        </Flex>
                      </NavLink>
                    ))}
                  </Flex>
                </AccordionItemContent>
              </AccordionItem>
            );
          })}
        </Flex>
      </AccordionRoot>
    </Box>
  );
}
