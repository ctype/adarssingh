import { ListCollection, Text } from "@chakra-ui/react";
import { Field } from "../ui/field";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../ui/select";

interface ICustomSelectProps {
  name: string;
  label?: string;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
  error?: string | null;
  zIndex?: string;
  options: ListCollection<{ value: string | number; label: string }>;
  onChange?: (value: string) => void;
}

export default function CustomSelect(props: ICustomSelectProps) {
  const {
    error,
    defaultValue,
    name,
    placeholder,
    label,
    required = true,
    options,
    onChange,
    zIndex = "popover",
  } = props;

  return (
    <Field required={required} invalid={!!error} errorText={error}>
      <SelectRoot
        name={name}
        required={required}
        collection={options}
        width={"full"}
        defaultValue={defaultValue ? [defaultValue] : undefined}
        zIndex={zIndex}
      >
        <SelectLabel display={"flex"} gap={1} alignItems={"center"}>
          {label}{" "}
          {required && (
            <Text fontSize={"sm"} color={"red.400"}>
              *
            </Text>
          )}
        </SelectLabel>
        <SelectTrigger
          borderColor={error ? "red.600" : "#333"}
          _focus={{ borderColor: "blue.500", outlineColor: "blue.500" }}
        >
          <SelectValueText placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent backgroundColor="black" color={"white"}>
          {options.items.map((op) => (
            <SelectItem
              item={op}
              key={op.value}
              backgroundColor={"transparent"}
              _hover={{ backgroundColor: "#000000aa" }}
              _selected={{ backgroundColor: "#000" }}
              onClick={() => {
                if (onChange) {
                  onChange(op.value.toString());
                }
              }}
            >
              {op.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
    </Field>
  );
}
