import { Button } from "../ui/button";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { PropsWithChildren, useState } from "react";

interface ICustomDialogProps {
  title: string;
  bodyText: string;
  cancelText: string;
  confirmText: string;
  handleCancel?: () => void;
  handleConfirm: () => void;
}

export default function CustomDialog({
  children,
  ...props
}: PropsWithChildren<ICustomDialogProps>) {
  const {
    title,
    bodyText,
    confirmText,
    cancelText,
    handleConfirm,
    handleCancel,
  } = props;

  const [open, setOpen] = useState(false);

  const handleDone = async () => {
    handleConfirm();
    setOpen(false);
  };

  return (
    <DialogRoot
      placement={"center"}
      motionPreset="slide-in-bottom"
      open={open}
      lazyMount
      onOpenChange={(e) => setOpen(e.open)}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent backgroundColor={"black"} color={"white"}>
        <DialogHeader>
          <DialogTitle as="h4">{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p>{bodyText}</p>
        </DialogBody>
        <DialogFooter>
          {handleCancel ? (
            <Button
              backgroundColor={"#fff"}
              color={"#000"}
              onClick={handleCancel}
            >
              {cancelText}
            </Button>
          ) : (
            <DialogActionTrigger asChild>
              <Button>{cancelText}</Button>
            </DialogActionTrigger>
          )}
          <Button
            backgroundColor="red.700"
            onClick={handleDone}
            color={"white"}
          >
            {confirmText}
          </Button>
        </DialogFooter>
        <DialogCloseTrigger
          color={"white"}
          _hover={{ backgroundColor: "transparent" }}
        />
      </DialogContent>
    </DialogRoot>
  );
}
