import { Textarea } from "@chakra-ui/react";
import { Field } from "../ui/field";

interface ICustomInputProps {
  name: string;
  label: string;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
  error?: string | null;
  rows?: number;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function CustomTextArea(props: ICustomInputProps) {
  const {
    name,
    label,
    required = true,
    defaultValue,
    placeholder = "Share the story ,vibe and inspiration",
    error = null,
    rows = 5,
    value,
    onChange,
  } = props;

  return (
    <Field
      invalid={error !== null}
      label={label}
      required={required}
      errorText={error}
    >
      <Textarea
        required={required}
        name={name}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        borderColor={error ? "red.600" : "#333"}
        _focus={{ borderColor: "blue.500", outlineColor: "blue.500" }}
      />
    </Field>
  );
}
