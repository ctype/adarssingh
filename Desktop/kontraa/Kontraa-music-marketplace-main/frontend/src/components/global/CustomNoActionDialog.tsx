import { PropsWithChildren } from "react";

import { Button } from "@/components/ui/button";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ConditionalValue } from "@chakra-ui/react";

interface ICustomNoActionDialogProps {
  triggerText: string;
  dialogTitle: string;
  size?: ConditionalValue<"cover" | "lg" | "md" | "xl" | "sm">;
}

export default function CustomNoActionDialog({
  triggerText,
  dialogTitle,
  size,
  children,
}: PropsWithChildren<ICustomNoActionDialogProps>) {
  return (
    <DialogRoot
      size={size ?? "cover"}
      placement="center"
      motionPreset="slide-in-bottom"
    >
      <DialogTrigger asChild>
        <Button
          variant="plain"
          size="sm"
          color={"white"}
          _hover={{ backgroundColor: "gray.700" }}
        >
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent color={"white"} backgroundColor={"black"}>
        <DialogHeader>
          <DialogTitle as="h4">{dialogTitle}</DialogTitle>
          <DialogCloseTrigger
            color={"white"}
            _hover={{ backgroundColor: "gray.700" }}
          />
        </DialogHeader>
        <DialogBody>{children}</DialogBody>
      </DialogContent>
    </DialogRoot>
  );
}
