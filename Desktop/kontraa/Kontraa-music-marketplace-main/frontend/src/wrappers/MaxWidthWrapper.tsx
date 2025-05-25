import { Container } from "@chakra-ui/react";

export default function MaxWidthWrapper({
  children,
  isDashboard = false,
}: {
  isDashboard?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Container
      maxWidth={{
        base: isDashboard ? "full" : "11/12",
        md: isDashboard ? "full" : "10/12",
      }}
      color={"white"}
      h={"full"}
    >
      {children}
    </Container>
  );
}
