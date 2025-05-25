import { PropsWithChildren } from "react";
import {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "../ui/popover";
import { Button } from "../ui/button";

interface ICustomPopOverProps {
  trigger: React.ReactNode;
}

export default function CustomPopOver({
  trigger,
  children,
}: PropsWithChildren<ICustomPopOverProps>) {
  return (
    <PopoverRoot positioning={{ placement: "bottom" }}>
      <PopoverTrigger asChild>
        <Button variant={"plain"} size="sm" p={0}>
          {trigger}
        </Button>
      </PopoverTrigger>
      <PopoverContent css={{ "--popover-bg": "#27272a" }}>
        <PopoverArrow />
        <PopoverBody py={4} px={2}>
          {children}
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
}
