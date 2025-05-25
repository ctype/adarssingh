import { FormEvent, useState } from "react";
import { Flex, Box, Input, Text } from "@chakra-ui/react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../ui/button";

interface IPublicSearchInputProps {
  logo?: JSX.Element;
  button?: string;
  placeholder?: string;
  color?: string;
  width?: string;
  height?: string;
  py?: number;
  radius?: string;
  onFocus?: () => void; // ✅ Add this
}

export default function PublicSearchInput(props: IPublicSearchInputProps) {
  const {
    logo,
    button = "Search",
    placeholder = "Search...",
    color,
    height,
    py,
    radius,
    onFocus, // ✅ Destructure it here
  } = props;

  const navigate = useNavigate();
  const [query] = useSearchParams();
  const { pathname } = useLocation();
  const [err, setErr] = useState<string | null>(null);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr(null);

    const formData = new FormData(e.currentTarget);
    const search = formData.get("search") as string;

    if (!search || search.trim().length <= 2) {
      setErr("Please search for a word at least 3 characters long");
      return;
    }

    const searchParams = new URLSearchParams();
    searchParams.set("search", search.trim());

    if (pathname === "/") {
      navigate(`/tracks?${searchParams.toString()}`);
    } else {
      navigate(`${pathname}?${searchParams.toString()}`, { replace: true });
    }
  };

  return (
    <form onSubmit={handleSearch}>
      <Flex
        alignItems="center"
        justifyContent="center"
        gap={1}
        px={4}
        py={py}
        bg={color}
        rounded={radius}
      >
        <Box color="black">{logo}</Box>

        <Input
          width="full"
          height={height}
          border="none"
          outline="none"
          fontSize="large"
          name="search"
          color="black"
          placeholder={placeholder}
          defaultValue={query.get("search") ?? ""}
          onFocus={onFocus} // ✅ Use it here
        />

        <Button
          color="gray.700"
          px={6}
          w="60px"
          type="submit"
          fontSize="large"
          variant="plain"
        >
          {button}
        </Button>
      </Flex>

      {err && (
        <Text mt={2} color="red.400" fontWeight="semibold">
          {err}
        </Text>
      )}
    </form>
  );
}
