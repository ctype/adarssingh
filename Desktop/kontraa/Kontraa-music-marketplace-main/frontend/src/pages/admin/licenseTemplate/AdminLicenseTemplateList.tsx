import { useEffect } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { Tag } from "@/components/ui/tag";
import { toaster } from "@/components/ui/toaster";
import ListViewWrapper from "@/wrappers/ListViewWrapper";
import EditButton from "@/components/afterAuth/EditButton";
import { useAppDispatch, useAppSelector } from "@/app/store";
import DeleteButton from "@/components/afterAuth/DeleteButton";
import {
  deleteLicenseTemplate,
  fetchLicenseTemplates,
} from "@/features/license/licenseTemplateSlice";

export default function AdminLicenseTemplateList() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { licenseTemplates, isPending } = useAppSelector(
    (state) => state.licenseTemplates
  );

  const handleDelete = (id: number) => {
    try {
      dispatch(deleteLicenseTemplate(id)).unwrap();

      toaster.create({
        title: "Sucessfully deleted the template",
        type: "success",
      });
    } catch (error) {
      console.log(error);
      toaster.create({
        title: "Error while deleting the template",
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (licenseTemplates.length <= 0) {
      dispatch(fetchLicenseTemplates(1)).unwrap();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ListViewWrapper
      title="License Templates"
      subtitle="List of all license templates"
      isEmpty={licenseTemplates.length <= 0 && !isPending}
      isLoading={isPending}
    >
      {licenseTemplates.map((lt) => (
        <Box
          backgroundColor="gray.900"
          rounded={"sm"}
          mb={2}
          color={"whiteAlpha.900"}
          key={lt.id}
        >
          <Flex p={4} alignItems={"center"} justifyContent={"space-between"}>
            <Box>
              <Flex fontWeight="bold" alignItems={"center"} gap={2}>
                <h4>{lt.licenseTemplateName}</h4>
                <Tag colorPalette={"blue"} size={"md"} variant={"subtle"}>
                  {lt.type}
                </Tag>
              </Flex>
              <Box>{lt.licenseTemplateShortDescription}</Box>
            </Box>

            <Flex gap={2}>
              <EditButton handleEdit={() => navigate(`edit/${lt.id}`)} />
              <DeleteButton
                handleDelete={() => {
                  handleDelete(lt.id);
                }}
              />
            </Flex>
          </Flex>
        </Box>
      ))}
    </ListViewWrapper>
  );
}
