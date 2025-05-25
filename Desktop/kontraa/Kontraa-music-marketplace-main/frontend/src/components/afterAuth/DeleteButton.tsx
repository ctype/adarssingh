import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import CustomDialog from "../global/CustomDialog";

interface IDeleteButtonProps {
  handleDelete: () => void;
  onlyIcon?: boolean;
  bgColor?: string;
  p?: number;
}

export default function DeleteButton({
  handleDelete,
  onlyIcon = true,
  bgColor = "transparent",
  p = 0,
}: IDeleteButtonProps) {
  return (
    <CustomDialog
      title="Delete"
      bodyText="Are you sure you want to delete this resource?"
      cancelText="Cancel"
      confirmText="Yes, Delete"
      handleConfirm={handleDelete}
    >
      <Button
        variant="plain"
        backgroundColor={bgColor}
        color="red.500"
        p={p}
        display={"flex"}
        alignItems={"center"}
        gap={2}
      >
        <Trash2 />
        {!onlyIcon && "Delete"}
      </Button>
    </CustomDialog>
  );
}
