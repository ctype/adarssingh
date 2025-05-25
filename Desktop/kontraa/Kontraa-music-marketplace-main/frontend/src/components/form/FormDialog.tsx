import React, { PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConditionalValue } from "@chakra-ui/react";

export interface IFormDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  isEdit?: boolean;
  handleCancel: () => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleOk?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isLoading?: boolean;
  hideCross?: boolean;
  isNotForm?: boolean;
  escapeEnabled?: boolean;
  yesText?: string;
  yesBgColor?: string;
  size?: ConditionalValue<"md" | "lg" | "sm" | "xl" | "cover" | "full" | "xs">;
}

export function FormDialog(props: PropsWithChildren<IFormDialogProps>) {
  const {
    open,
    setOpen,
    title,
    children,
    isEdit = false,
    handleCancel,
    handleSubmit,
    handleOk,
    isLoading = false,
    hideCross = false,
    escapeEnabled = true,
    isNotForm = false,
    size = "md",
    yesText,
    yesBgColor,
  } = props;

  return (
    <DialogRoot
      placement={"center"}
      size={size}
      motionPreset="slide-in-bottom"
      open={open}
      lazyMount
      onOpenChange={(e) => setOpen(e.open)}
      closeOnInteractOutside={false}
      closeOnEscape={escapeEnabled}
      onEscapeKeyDown={escapeEnabled ? handleCancel : undefined}
    >
      <DialogContent backgroundColor={"black"} color={"white"}>
        <DialogHeader>
          <DialogTitle as="h4">
            {!isNotForm && <>{isEdit ? "Update" : "Create"}</>}
            {title}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          {isNotForm ? (
            children
          ) : (
            <form onSubmit={handleSubmit} id="dialogForm">
              {children}
            </form>
          )}
        </DialogBody>
        <DialogFooter>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button
            backgroundColor={yesBgColor ?? "blue.700"}
            form="dialogForm"
            type={isNotForm ? "button" : "submit"}
            loading={isLoading}
            loadingText={"Uploading..."}
            color={"white"}
            onClick={isNotForm ? handleOk : undefined}
          >
            {isNotForm ? yesText : isEdit ? "Update" : "Create"}
          </Button>
        </DialogFooter>
        {!hideCross && (
          <DialogCloseTrigger
            color={"white"}
            _hover={{ backgroundColor: "transparent" }}
            onClick={handleCancel}
          />
        )}
      </DialogContent>
    </DialogRoot>
  );
}
