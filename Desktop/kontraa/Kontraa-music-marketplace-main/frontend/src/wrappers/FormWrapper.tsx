import { ArrowLeft } from "lucide-react";
import { PropsWithChildren } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

interface IFormWrapperProps {
  title: string;
  isEdit?: boolean;
  hideSubmit?: boolean;
  backBtn?: React.ReactNode;
  isBtnPending?: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function FormWrapper(
  props: PropsWithChildren<IFormWrapperProps>
) {
  const {
    title,
    isEdit = false,
    handleSubmit,
    hideSubmit = false,
    backBtn,
    isBtnPending,
  } = props;
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <Box w={"full"}>
      <Flex alignItems={"center"}>
        {backBtn ? (
          backBtn
        ) : (
          <Button
            variant="plain"
            color="white"
            onClick={() => {
              navigate(pathname.split("/").slice(0, 3).join("/"));
            }}
          >
            <ArrowLeft />
          </Button>
        )}
        <h5>
          {isEdit ? "Edit" : "Add"} {title}
        </h5>
      </Flex>
      <Box mt={8} p={6} backgroundColor="black" rounded={"md"}>
        <form onSubmit={handleSubmit}>
          <Box mb={8}>{props.children}</Box>
          {!hideSubmit && (
            <Flex justifyContent={"end"}>
              <Button
                type="submit"
                backgroundColor={"blue.500"}
                color={"white"}
                disabled={isBtnPending}
              >
                {isBtnPending ? "Uploading..." : isEdit ? "Edit" : "Submit"}
              </Button>
            </Flex>
          )}
        </form>
      </Box>
    </Box>
  );
}
