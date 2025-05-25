import { EditIcon } from "lucide-react";
import { Button } from "../ui/button";

interface IEditButtonProps {
  handleEdit: () => void;
  onlyIcon?: boolean;
  bgColor?: string;
  p?: number;
}

export default function EditButton({
  handleEdit,
  onlyIcon = true,
  bgColor = "transparent",
  p = 0,
}: IEditButtonProps) {
  return (
    <Button
      variant="plain"
      color="blue.400"
      p={p}
      backgroundColor={bgColor}
      onClick={handleEdit}
      display={"flex"}
      alignItems={"center"}
      gap={2}
    >
      <EditIcon />
      {!onlyIcon && "Edit"}
    </Button>
  );
}
