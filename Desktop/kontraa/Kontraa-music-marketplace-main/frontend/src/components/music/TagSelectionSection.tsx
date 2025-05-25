import { Box, createListCollection, Flex } from "@chakra-ui/react";

import { Button } from "../ui/button";
import CustomInput from "../form/CustomInput";
import CustomSelect from "../form/CustomSelect";
import { Skeleton } from "../ui/skeleton";

interface ITagSelectionSectionProps {
  title: string;
  selectedTag: number;
  defaultSort: string;
  tags: { name: string; value: number }[];
  onTagSelect?: (tag: number) => void;
  onValueChange?: (value: string) => void;
  onSortChange?: (value: string) => void;
  isLoading?: boolean;
}

export default function TagSelectionSection({
  title,
  selectedTag,
  tags,
  onTagSelect,
  defaultSort,
  onSortChange,
  isLoading = false,
}: ITagSelectionSectionProps) {
  return (
    <Box>
      <h3>{title}</h3>
      <Flex direction={"column"} w={"full"} py={2} gap={3}>
        <Flex flex={5} alignItems={"center"} gap={3} flexWrap={"wrap"}>
          {tags.map((tag) => (
            <Skeleton asChild loading={isLoading} key={tag.value}>
              <Button
                backgroundColor={
                  tag.value === selectedTag ? "blue.700" : "gray.800"
                }
                color={"white"}
                rounded={"md"}
                _hover={{ opacity: "0.8" }}
                key={tag.value}
                onClick={() => onTagSelect && onTagSelect(tag.value)}
              >
                {tag.name}
              </Button>
            </Skeleton>
          ))}
        </Flex>

        <Flex gap={2} alignItems={"end"} alignSelf={"end"}>
          <Box>
            <CustomInput
              required={false}
              placeholder="Search for tags"
              name="search"
              label=""
            />
          </Box>

          <Box w={44}>
            <CustomSelect
              name="sort"
              defaultValue={defaultSort}
              onChange={(v) => {
                if (onSortChange) onSortChange(v);
              }}
              options={createListCollection({
                items: [
                  { value: "createdAt", label: "Latest" },
                  { value: "alpha", label: "Alphabetical(A-Z)" },
                  { value: "alphaReverse", label: "Alphabetical(Z-A)" },
                ],
              })}
              required={false}
              placeholder="Select how to sort"
              zIndex="dropdown"
            />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}
