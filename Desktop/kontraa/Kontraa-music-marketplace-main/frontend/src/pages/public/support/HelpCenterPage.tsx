import { Box } from "@chakra-ui/react";

import MaxWidthWrapper from "@/wrappers/MaxWidthWrapper";
import MarkdownWrapper from "./_components/MarkdownWrapper";

export default function HelpCenterPage() {
  return (
    <MaxWidthWrapper>
      <Box py={8}>
        <h2>Kontraa Help Center</h2>
        <MarkdownWrapper
          mdFilePath="/md/helpCenter.md"
          mdTOCFilePath="/md/helpCenterTOC.md"
        />
      </Box>
    </MaxWidthWrapper>
  );
}
