import { Button } from "@/components/ui/button";
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";

interface ICustomDrawerProps {
  trigger: React.ReactNode;
  title: string;
}

export default function CustomDrawer({
  trigger,
  title,
  children,
}: PropsWithChildren<ICustomDrawerProps>) {
  return (
    <DrawerRoot size="md">
      <DrawerBackdrop />
      <DrawerTrigger asChild>
        <Button variant="plain" size="sm" p={0}>
          {trigger}
        </Button>
      </DrawerTrigger>
      <DrawerContent backgroundColor={"gray.950"}>
        <DrawerHeader>
          <DrawerTitle fontSize={"xl"}>{title}</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>{children}</DrawerBody>
        <DrawerFooter>
          <Button colorPalette={"blue"} asChild>
            <Link to="/checkout">Checkout</Link>
          </Button>
        </DrawerFooter>
        <DrawerCloseTrigger
          color={"white"}
          _hover={{ backgroundColor: "gray.800" }}
        />
      </DrawerContent>
    </DrawerRoot>
  );
}
