import { Tooltip } from "@/components/ui/tooltip";
import { PropsWithChildren } from "react";
type TooltipPlacement =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end"
  | "right"
  | "right-start"
  | "right-end";
interface CustomTooltipTypes {
  content: string;
  tooltipBg?: string;
  positioning?: {
    placement: TooltipPlacement;
  };
}
export default function CustomTooltip(
  props: PropsWithChildren<CustomTooltipTypes>
) {
  const {
    content,
    positioning = { placement: "top" },
    tooltipBg = "white",
    children,
  } = props;
  return (
    <Tooltip
      showArrow
      content={content}
      positioning={positioning}
      contentProps={{
        css: {
          "--tooltip-bg": { tooltipBg },
        },
      }}
    >
      {children}
    </Tooltip>
  );
}
