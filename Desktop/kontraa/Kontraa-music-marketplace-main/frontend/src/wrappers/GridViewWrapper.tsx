import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Box, Flex, Grid, GridItem } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";

interface IGridViewWrapperProps {
  title: string;
  hasAdd?: boolean;
  subtitle?: string;
  isEmpty?: boolean;
  isLoading?: boolean;
}

export default function GridViewWrapper({
  children,
  title,
  subtitle,
  hasAdd = true,
  isEmpty = false,
  isLoading = false,
}: PropsWithChildren<IGridViewWrapperProps>) {
  const navigate = useNavigate();

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
            onClick={() => navigate("add")}
          >
            Add {title}
          </Button>
        )}
      </Flex>
      <Grid
        templateColumns={{
          base: "repeat(2, 1fr)",
          mdToLg: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
          xl: "repeat(5, 1fr)",
        }}
        gap={4}
        mt={8}
      >
        {isLoading ? (
          <>
            {Array.from({ length: 8 }).map((_, i) => (
              <GridItem
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                key={i}
              >
                <Skeleton rounded="md" minH={300} w={"full"} />
              </GridItem>
            ))}
          </>
        ) : isEmpty ? (
          <GridItem
            colSpan={5}
            h={"48"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            No {title} found
          </GridItem>
        ) : (
          children
        )}
      </Grid>
    </Box>
  );
}
