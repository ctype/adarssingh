import MaxWidthWrapper from "@/wrappers/MaxWidthWrapper";
import { Box } from "@chakra-ui/react";
import MarkdownWrapper from "./_components/MarkdownWrapper";

export default function DMCAPage() {
  return (
    <MaxWidthWrapper>
      <Box py={8}>
        <h2>DMCA</h2>
        <MarkdownWrapper
          mdFilePath="/md/dmca.md"
          mdTOCFilePath="/md/dmcaTOC.md"
        />
      </Box>
    </MaxWidthWrapper>
  );
}
