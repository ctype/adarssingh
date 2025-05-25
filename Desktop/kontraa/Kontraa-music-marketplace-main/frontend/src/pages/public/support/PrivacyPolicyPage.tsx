import MaxWidthWrapper from "@/wrappers/MaxWidthWrapper";
import { Box } from "@chakra-ui/react";
import MarkdownWrapper from "./_components/MarkdownWrapper";

export default function PrivacyPolicyPage() {
  return (
    <MaxWidthWrapper>
      <Box py={8}>
        <h2>Privacy Policy</h2>
        <MarkdownWrapper
          mdFilePath="/md/privacyPolicy.md"
          mdTOCFilePath="/md/privacyPolicyTOC.md"
        />
      </Box>
    </MaxWidthWrapper>
  );
}
