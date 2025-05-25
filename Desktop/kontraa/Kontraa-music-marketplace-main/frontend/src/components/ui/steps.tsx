import { Box, Steps as ChakraSteps } from "@chakra-ui/react";
import * as React from "react";
import { LuCheck } from "react-icons/lu";

interface StepInfoProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  titleColor?: string;
}

export interface StepsItemProps
  extends Omit<ChakraSteps.ItemProps, "title">,
    StepInfoProps {
  completedIcon?: React.ReactNode;
  icon?: React.ReactNode;
}

export const StepsItem = React.forwardRef<HTMLDivElement, StepsItemProps>(
  function StepsItem(props, ref) {
    const { title, description, completedIcon, icon, titleColor, ...rest } =
      props;
    return (
      <ChakraSteps.Item {...rest} ref={ref}>
        <ChakraSteps.Trigger>
          <ChakraSteps.Indicator>
            <ChakraSteps.Status
              complete={completedIcon || <LuCheck />}
              incomplete={icon || <ChakraSteps.Number />}
            />
          </ChakraSteps.Indicator>
          <StepInfo
            title={title}
            description={description}
            titleColor={titleColor}
          />
        </ChakraSteps.Trigger>
        <ChakraSteps.Separator />
      </ChakraSteps.Item>
    );
  }
);

const StepInfo = (props: StepInfoProps) => {
  const { title, description, titleColor } = props;

  if (title && description) {
    return (
      <Box>
        <ChakraSteps.Title color={titleColor}>{title}</ChakraSteps.Title>
        <ChakraSteps.Description>{description}</ChakraSteps.Description>
      </Box>
    );
  }

  return (
    <>
      {title && (
        <ChakraSteps.Title color={titleColor}>{title}</ChakraSteps.Title>
      )}
      {description && (
        <ChakraSteps.Description>{description}</ChakraSteps.Description>
      )}
    </>
  );
};

interface StepsIndicatorProps {
  completedIcon: React.ReactNode;
  icon?: React.ReactNode;
}

export const StepsIndicator = React.forwardRef<
  HTMLDivElement,
  StepsIndicatorProps
>(function StepsIndicator(props, ref) {
  const { icon = <ChakraSteps.Number />, completedIcon } = props;
  return (
    <ChakraSteps.Indicator ref={ref}>
      <ChakraSteps.Status complete={completedIcon} incomplete={icon} />
    </ChakraSteps.Indicator>
  );
});

export const StepsList = ChakraSteps.List;
export const StepsRoot = ChakraSteps.Root;
export const StepsContent = ChakraSteps.Content;
export const StepsCompletedContent = ChakraSteps.CompletedContent;

export const StepsNextTrigger = ChakraSteps.NextTrigger;
export const StepsPrevTrigger = ChakraSteps.PrevTrigger;
