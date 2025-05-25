import MaxWidthWrapper from "@/wrappers/MaxWidthWrapper";
import { Box } from "@chakra-ui/react";
import MarkdownWrapper from "./_components/MarkdownWrapper";

export default function LicensingPage() {
  return (
    <MaxWidthWrapper>
      <Box py={8}>
        <h2>Licensing</h2>
        <MarkdownWrapper
          mdFilePath="/md/licensing.md"
          mdTOCFilePath="/md/licensingTOC.md"
        />
      </Box>
    </MaxWidthWrapper>
  );
}
