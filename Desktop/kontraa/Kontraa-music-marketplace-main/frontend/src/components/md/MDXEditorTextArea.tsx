import React, { forwardRef, useEffect, useState } from "react";
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  headingsPlugin,
  InsertThematicBreak,
  listsPlugin,
  ListsToggle,
  markdownShortcutPlugin,
  MDXEditor,
  MDXEditorMethods,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from "@mdxeditor/editor";
import { Field } from "../ui/field";
import { PopoverBody, PopoverContent, PopoverRoot } from "../ui/popover";
import { Button } from "../ui/button";

const dynamicVariablesList = {
  audioLicenseDuration: "License duration",
  audioLicenseDistribution: "Audio distribution",
  audioLicenseStreams: "Audio streaming",
  audioLicenseFreeDownloads: "Audio Free downloads",
  musicVideoMonitizedAmount: "Music video monetization",
  musicVideoNonMonitizedAmount: "Music video non-profit",
  musicVideoMonitizedStreamAmount: "Music video streaming",
  musicVideoNonMonitizedStreamAmount: "Music video streaming non-profit",
  radioBroadcastRights: "Radio Broadcasting",
  radioStationsAmount: "Radio station",
  livePerformanceProfitRights: "Live performance",
  livePerformanceNonProfitAmount: "Live performance non-profit",
};

interface IMDXEditorTextAreaProps {
  label: string;
}

const MDXEditorTextArea = forwardRef<MDXEditorMethods, IMDXEditorTextAreaProps>(
  ({ label }, ref) => {
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.ctrlKey) {
        const selection = window.getSelection();
        if (!selection?.rangeCount) return;

        const range = selection.getRangeAt(0);
        let rect = range.getBoundingClientRect();

        if (rect.top === 0 && rect.left === 0) {
          const marker = document.createElement("span");
          marker.textContent = "\u200b";
          range.insertNode(marker);
          rect = marker.getBoundingClientRect();
          marker.parentNode?.removeChild(marker);
        }

        setPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
        });

        setOpen(true);
      }
    };

    const handleSetDynamicVariable = (v: keyof typeof dynamicVariablesList) => {
      const mdEditor = ref as React.RefObject<MDXEditorMethods>;
      const md = mdEditor.current?.getMarkdown();

      if (md) {
        mdEditor.current?.insertMarkdown(`\${{${v}}}`);
      }
      mdEditor.current?.focus();
      setOpen(false);
    };

    useEffect(() => {
      const editor = document.getElementsByClassName("md-editor")[0];
      (editor as HTMLDivElement)?.addEventListener("keydown", handler, false);
      return () => {
        (editor as HTMLDivElement).removeEventListener(
          "keydown",
          handler,
          false
        );
      };
    }, []);

    return (
      <Field
        label={label}
        required
        w={"full"}
        onClick={() =>
          (ref as React.RefObject<MDXEditorMethods>).current?.focus()
        }
      >
        <MDXEditor
          markdown={""}
          contentEditableClassName="prose"
          className="md-editor"
          ref={ref}
          plugins={[
            toolbarPlugin({
              toolbarContents: () => (
                <>
                  {" "}
                  <UndoRedo />
                  <BoldItalicUnderlineToggles />
                  <BlockTypeSelect />
                  <ListsToggle options={["number", "bullet"]} />
                  <InsertThematicBreak />
                </>
              ),
            }),
            headingsPlugin({ allowedHeadingLevels: [4, 5, 6] }),
            listsPlugin(),
            thematicBreakPlugin(),
            markdownShortcutPlugin(),
          ]}
        />
        <PopoverRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
          <PopoverContent
            position={"absolute"}
            top={`${position.top}px`}
            left={`${position.left}px`}
            maxH={"300px"}
            overflowY="scroll"
          >
            <PopoverBody h="inherit">
              {Object.keys(dynamicVariablesList).map((v, i) => (
                <Button
                  w="full"
                  my={1}
                  backgroundColor="transparent"
                  color="white"
                  textAlign={"start"}
                  _hover={{
                    backgroundColor: "gray.700",
                  }}
                  onClick={() =>
                    handleSetDynamicVariable(
                      v as keyof typeof dynamicVariablesList
                    )
                  }
                  key={i}
                >
                  {dynamicVariablesList[v as keyof typeof dynamicVariablesList]}
                </Button>
              ))}
            </PopoverBody>
          </PopoverContent>
        </PopoverRoot>
      </Field>
    );
  }
);

export default MDXEditorTextArea;
