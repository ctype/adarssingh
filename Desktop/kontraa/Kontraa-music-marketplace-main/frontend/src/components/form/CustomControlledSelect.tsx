import { Box } from "@chakra-ui/react";

import { Field } from "../ui/field";
import { NativeSelectField, NativeSelectRoot } from "../ui/native-select";

interface ICustomControlledSelect {
  label: string;
  name: string;
  value?: string;
  required?: boolean;
  error?: string;
  setValue: (value: string) => void;
  options: { label: string; value: string | number }[];
}

export function CustomControlledSelect(props: ICustomControlledSelect) {
  const {
    value,
    setValue,
    label,
    name,
    required = true,
    error,
    options,
  } = props;

  return (
    <Field
      label={label}
      required={required}
      invalid={!!error}
      errorText={error}
    >
      <NativeSelectRoot>
        <NativeSelectField
          placeholder="Select"
          name={name}
          value={value}
          color={"white"}
          backgroundColor={"black"}
          borderColor={"gray.700"}
          onChange={(e) => setValue(e.currentTarget.value)}
          _focus={{ borderColor: "blue.500", outlineColor: "blue.500" }}
        >
          {options.map((op) => (
            <Box
              asChild
              key={op.value}
              color={"white"}
              backgroundColor={"#000"}
            >
              <option key={op.value} className="option" value={op.value}>
                {op.label}
              </option>
            </Box>
          ))}
        </NativeSelectField>
      </NativeSelectRoot>
    </Field>
  );
}
