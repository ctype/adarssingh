import { Box, HStack, Input } from "@chakra-ui/react";
import { Field } from "../ui/field";
import { Tag } from "../ui/tag";
import { useState } from "react";

interface ICustomTagInputProps {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
  error?: string | null;
  value?: string | number;
  tags: string[];
  maxLength?: number;
  updateTags: (tag: string, isAdd: boolean) => void;
}

export default function CustomTagInput(props: ICustomTagInputProps) {
  const {
    name,
    label,
    type = "text",
    required = true,
    placeholder,
    error = null,
    value,
    updateTags,
    tags,
    maxLength = 3,
  } = props;

  const [tagList, setTagList] = useState<string[]>(tags);
  const [errTxt, setErrTxt] = useState<string | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setErrTxt(null);
    if (e.key === " " && e.ctrlKey && e.currentTarget.value.trim()) {
      if (tagList.length < maxLength) {
        setTagList([...tagList, e.currentTarget.value]);
        updateTags(e.currentTarget.value, true);
        e.currentTarget.value = "";
      } else {
        setErrTxt(`You can only have ${maxLength} tags`);
      }
    }
    // if (e.key === "Backspace" && !e.currentTarget.value.trim()) {
    //   if (tagList.length > 0) {
    //     const tags = [...tagList];
    //     tags.pop();
    //     setTagList(tags);
    //     updateTags(tags[tags.length - 1], false);
    //   } else {
    //     setErrTxt("You must have at least one tag");
    //   }
    // }
  };

  return (
    <Field
      invalid={error !== null || errTxt !== null}
      label={label}
      required={required}
      errorText={error || errTxt}
    >
      <Box position={"relative"} w={"full"}>
        <HStack
          gap={2}
          my={tags.length > 0 ? 2 : 0}
          wrap="wrap"
          // position={"absolute"}
          // left={4}
          // top={"50%"}
          // transform={"translateY(-50%)"}
          // zIndex={"banner"}
        >
          {tags.map((t) => (
            <Tag
              backgroundColor={"blue.700/60"}
              border={"1px solid"}
              borderColor={"blue.700"}
              color={"white"}
              size={"md"}
              boxShadowColor={"black"}
              key={t}
              closable
              onClose={() => {
                setTagList(tagList.filter((tag) => tag !== t));
                updateTags(t, false);
              }}
            >
              {t}
            </Tag>
          ))}
        </HStack>
        <Input
          required={tags.length !== 3 && required}
          name={name}
          type={type}
          value={value}
          onKeyDown={handleKeyDown}
          placeholder={tags.length <= 0 ? placeholder : ""}
          borderColor={error || errTxt ? "red.600" : "#333"}
          _focus={{ borderColor: "blue.500", outlineColor: "blue.500" }}
        />
      </Box>
    </Field>
  );
}
