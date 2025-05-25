import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerRoot,
  DrawerTrigger,
} from "@/components/ui/drawer";
import React, { PropsWithChildren } from "react";

interface ICustomDrawerProps {
  trigger: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CustomDefaultDrawer({
  trigger,
  open,
  setOpen,
  children,
}: PropsWithChildren<ICustomDrawerProps>) {
  return (
    <DrawerRoot
      size="md"
      placement={"bottom"}
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
    >
      <DrawerBackdrop />
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent backgroundColor={"gray.950"}>
        <DrawerBody>{children}</DrawerBody>
        <DrawerCloseTrigger
          color={"white"}
          _hover={{ backgroundColor: "gray.800" }}
        />
      </DrawerContent>
    </DrawerRoot>
  );
}
