import { Input } from "@chakra-ui/react";
import { Field } from "../ui/field";

interface ICustomInputProps {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
  error?: string | null;
  value?: string | number;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CustomInput(props: ICustomInputProps) {
  const {
    name,
    label,
    type = "text",
    required = true,
    disabled = false,
    defaultValue,
    placeholder,
    error = null,
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
      <Input
        required={required}
        name={name}
        type={type}
        value={value}
        disabled={disabled}
        onChange={onChange}
        defaultValue={defaultValue}
        placeholder={placeholder}
        borderColor={error ? "red.600" : "#333"}
        step={0.01}
        _focus={{ borderColor: "blue.500", outlineColor: "blue.500" }}
      />
    </Field>
  );
}
