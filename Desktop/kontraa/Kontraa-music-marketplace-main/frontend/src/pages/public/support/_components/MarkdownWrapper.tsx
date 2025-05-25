import remarkGfm from "remark-gfm";
import Markdown from "react-markdown";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Link as ChakraLink, Grid, List, Text } from "@chakra-ui/react";

import "@/styles/md.css";

interface IMarkdownWrapperProps {
  mdFilePath: string;
  mdTOCFilePath: string;
}

export default function MarkdownWrapper({
  mdFilePath,
  mdTOCFilePath,
}: IMarkdownWrapperProps) {
  const [mdFile, setMdFile] = useState("");
  const [TocFile, setTocFile] = useState("");

  useEffect(() => {
    fetch(mdFilePath)
      .then((response) => response.text())
      .then((text) => setMdFile(text));

    fetch(mdTOCFilePath)
      .then((response) => response.text())
      .then((text) => setTocFile(text));
  }, []);

  return (
    <Grid
      templateColumns={{
        base: "1fr",
        md: "1fr 3fr",
      }}
      gap={10}
    >
      <Box
        position={{ base: "relative", md: "sticky" }}
        top={{ base: 8, md: 58 }}
        maxH={"85vh"}
        overflowY={"scroll"}
      >
        <Markdown
          components={{
            ol: ({ ...props }) => {
              return <List.Root as="ol" {...props} my={2} />;
            },
            ul: ({ ...props }) => {
              return <List.Root ps={5} {...props} my={2} />;
            },
            li: ({ ...props }) => {
              return <List.Item {...props} mb={2} />;
            },
          }}
        >
          {TocFile}
        </Markdown>
      </Box>
      <Box mt={{ base: 8, md: 0 }} className="content">
        <Markdown
          components={{
            p: ({ ...props }) => {
              return <Text {...props} my={4} />;
            },
            a: ({ ...props }) => {
              return (
                <ChakraLink
                  asChild
                  color={"blue.500"}
                  textDecoration={"underline"}
                >
                  <Link to={props.href ?? "#"} {...props} />
                </ChakraLink>
              );
            },
            ul: ({ ...props }) => {
              return <List.Root ps={5} {...props} my={2} />;
            },
            li: ({ ...props }) => {
              return <List.Item {...props} mb={2} />;
            },
            h3: ({ ...props }) => {
              return (
                <h3 {...props} id={getHeaderId(props.children?.toString())} />
              );
            },
            h4: ({ ...props }) => {
              return (
                <h4 {...props} id={getHeaderId(props.children?.toString())} />
              );
            },
            h5: ({ ...props }) => {
              return (
                <h5 {...props} id={getHeaderId(props.children?.toString())} />
              );
            },
          }}
          remarkPlugins={[remarkGfm]}
        >
          {mdFile}
        </Markdown>
      </Box>
    </Grid>
  );
}

function getHeaderId(header?: string) {
  const dashRemovedHeader = header?.replace(/-/g, " ");
  const textOnlyHeader = dashRemovedHeader
    ?.replace(/[^a-zA-Z0-9\s]/g, "")
    .trim();
  return textOnlyHeader
    ?.split(" ")
    .map((c) => c.toLowerCase())
    .join("-");
}
