import { Box } from "@chakra-ui/react";

import Footer from "@/components/public/Footer";
import Navbar from "@/components/public/Navbar";
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <Box as="main" backgroundColor="#000" w="full">
      <Box position={"sticky"} top={"0"} zIndex={"sticky"}>
        <Navbar />
      </Box>
      <Outlet />
      <Footer />
    </Box>
  );
}
