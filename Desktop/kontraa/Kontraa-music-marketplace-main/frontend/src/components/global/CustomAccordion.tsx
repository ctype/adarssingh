import React from "react";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "../ui/accordion";

interface ICustomAccordionProps {
  selectedDefaultValue: string;
  items: {
    title: string | React.ReactNode;
    content: string | React.ReactNode;
    value: string;
  }[];
}

export default function CustomAccordion({
  items,
  selectedDefaultValue,
}: ICustomAccordionProps) {
  return (
    <AccordionRoot multiple collapsible defaultValue={[selectedDefaultValue]}>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          value={item.value}
          borderColor={"gray.600"}
          _open={{ color: "white" }}
          color={"gray.400"}
        >
          <AccordionItemTrigger>{item.title}</AccordionItemTrigger>
          <AccordionItemContent>{item.content}</AccordionItemContent>
        </AccordionItem>
      ))}
    </AccordionRoot>
  );
}
