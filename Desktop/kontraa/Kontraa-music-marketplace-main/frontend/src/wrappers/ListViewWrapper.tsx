import { PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";

import { Button } from "@/components/ui/button";
import CustomInput from "@/components/form/CustomInput";
import { Skeleton } from "@/components/ui/skeleton";

interface IListViewWrapperProps {
  title: string;
  hasAdd?: boolean;
  subtitle?: string;
  onAdd?: () => void;
  isEmpty?: boolean;
  isLoading?: boolean;
  hasSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ListViewWrapper({
  children,
  title,
  subtitle,
  hasAdd = true,
  onAdd,
  isEmpty = false,
  isLoading = false,
  hasSearch = false,
  searchPlaceholder = "Search",
  searchValue,
  onSearch,
}: PropsWithChildren<IListViewWrapperProps>) {
  const navigate = useNavigate();

  const handleAdd = () => {
    if (onAdd) {
      onAdd();
    } else {
      navigate("add");
    }
  };

  return (
    <Box w={"full"}>
      <Flex alignItems={"center"} justifyContent={"space-between"} w={"full"}>
        <Box>
          <h3>{title}</h3>
          <p style={{ color: "#a1a1aa" }}>{subtitle}</p>
        </Box>
        {hasAdd && (
          <Button
            backgroundColor="blue.500"
            color={"white"}
            onClick={handleAdd}
          >
            Add {title}
          </Button>
        )}
      </Flex>

      {hasSearch && (
        <Box w={"full"} mt={4}>
          <CustomInput
            label="Search"
            required={false}
            name="searchText"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={onSearch}
          />
        </Box>
      )}
      <Box mt={12}>
        {isLoading ? (
          <>
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton w={"full"} h={24} rounded={"md"} key={i} my={2} />
            ))}
          </>
        ) : isEmpty ? (
          <Text textAlign={"center"}>No {title} found</Text>
        ) : (
          children
        )}
      </Box>
    </Box>
  );
}
