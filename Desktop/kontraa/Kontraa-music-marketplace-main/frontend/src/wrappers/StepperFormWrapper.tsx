import { ArrowLeft } from "lucide-react";
import { PropsWithChildren } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

interface IStepperFormWrapperProps {
  title: string;
  isEdit?: boolean;
  backBtn?: React.ReactNode;
}

export default function StepperFormWrapper(
  props: PropsWithChildren<IStepperFormWrapperProps>
) {
  const { title, isEdit = false, backBtn } = props;
  const navigate = useNavigate();

  return (
    <Box w={"full"}>
      <Flex alignItems={"center"}>
        {backBtn ? (
          backBtn
        ) : (
          <Button variant="plain" color="white" onClick={() => navigate(-1)}>
            <ArrowLeft />
          </Button>
        )}
        <h5>
          {isEdit ? "Edit" : "Add"} {title}
        </h5>
      </Flex>
      <Box my={8} p={6} backgroundColor="black" rounded={"md"}>
        {props.children}
      </Box>
    </Box>
  );
}
