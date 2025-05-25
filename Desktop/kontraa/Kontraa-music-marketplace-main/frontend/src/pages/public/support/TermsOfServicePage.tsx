import MaxWidthWrapper from "@/wrappers/MaxWidthWrapper";
import { Box } from "@chakra-ui/react";
import MarkdownWrapper from "./_components/MarkdownWrapper";

export default function TermsOfServicePage() {
  return (
    <MaxWidthWrapper>
      <Box py={8}>
        <h2>Terms of services</h2>
        <MarkdownWrapper
          mdFilePath="/md/termsOfService.md"
          mdTOCFilePath="/md/termsOfServiceTOC.md"
        />
      </Box>
    </MaxWidthWrapper>
  );
}
