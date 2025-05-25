import { Checkbox } from "../ui/checkbox";

interface ICustomCheckbox {
  isChecked: boolean;
  handleCheck: () => void;
  checkboxName: string;
}

export default function CustomCheckbox({
  isChecked,
  handleCheck,
  checkboxName,
}: ICustomCheckbox) {
  return (
    <Checkbox
      checked={isChecked}
      onCheckedChange={handleCheck}
      colorPalette={"blue"}
    >
      {checkboxName}
    </Checkbox>
  );
}
