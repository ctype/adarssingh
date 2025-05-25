import { Share2 } from "lucide-react";

import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  ClipboardInput,
  ClipboardLabel,
  ClipboardRoot,
  ClipboardIconButton,
} from "../ui/clipboard";
import { InputGroup } from "../ui/input-group";

interface IShareButtonProps {
  shareLink: string;
}

export default function ShareButton({ shareLink }: IShareButtonProps) {
  return (
    <DialogRoot placement={"center"}>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          color={"white"}
          backgroundColor="gray.800"
          p={2}
          rounded={"full"}
        >
          <Share2 size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle as="h4">Share file</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <ClipboardRoot maxW="300px" value={shareLink}>
            <ClipboardLabel>Copy and Share link</ClipboardLabel>
            <InputGroup
              width="full"
              endElement={<ClipboardIconButton me="-2" />}
            >
              <ClipboardInput />
            </InputGroup>
          </ClipboardRoot>
        </DialogBody>
        <DialogCloseTrigger
          color={"white"}
          _hover={{ backgroundColor: "transparent" }}
        />
      </DialogContent>
    </DialogRoot>
  );
}
