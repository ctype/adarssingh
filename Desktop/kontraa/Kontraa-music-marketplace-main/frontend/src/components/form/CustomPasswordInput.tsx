import { Field } from "../ui/field";
import { PasswordInput } from "../ui/password-input";

interface ICustomPasswordInputProps {
  name: string;
  label: string;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
  error?: string | null;
}

export default function CustomPasswordInput(props: ICustomPasswordInputProps) {
  const {
    name,
    label,
    required = true,
    defaultValue,
    placeholder,
    error = null,
  } = props;

  return (
    <Field
      invalid={error !== null}
      label={label}
      required={required}
      errorText={error}
    >
      <PasswordInput
        required={required}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        borderColor={error ? "red.600" : "#333"}
        _focus={{ borderColor: "blue.500", outlineColor: "blue.500" }}
      />
    </Field>
  );
}
