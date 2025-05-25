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
  deleteLicense,
  fetchMyLicenses,
} from "@/features/license/licenseSlice";

export default function ContributorLicenseList() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { myLicenses, isPending } = useAppSelector((state) => state.licenses);

  const handleDelete = (id: number) => {
    try {
      dispatch(deleteLicense(id)).unwrap();

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
    if (myLicenses.length <= 0) {
      dispatch(fetchMyLicenses("all")).unwrap();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ListViewWrapper
      title="Licenses"
      isEmpty={myLicenses.length <= 0 && !isPending}
      isLoading={isPending}
    >
      {myLicenses.map((lt) => (
        <LicenseCard
          key={lt.audioLicenseDistribution + lt.id}
          lt={lt}
          handleDelete={() => {
            handleDelete(lt.id);
          }}
          handleEdit={() => navigate(`edit/${lt.id}`)}
          type="custom"
        />
      ))}
    </ListViewWrapper>
  );
}

const LicenseCard = ({
  lt,
  handleEdit,
  handleDelete,
  type,
}: {
  lt: License;
  handleDelete: () => void;
  handleEdit: () => void;
  type: "custom" | "template";
}) => {
  return (
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
            <h4>{(lt as License).licenseName}</h4>
            <Tag
              boxShadow={"none"}
              size={"sm"}
              variant={"subtle"}
              colorPalette={"blue"}
            >
              {lt.type}
            </Tag>
          </Flex>
          <Box>{(lt as License).licenseShortDescription}</Box>
        </Box>

        {type === "custom" && (
          <Flex gap={2}>
            <EditButton handleEdit={handleEdit} />
            <DeleteButton handleDelete={handleDelete} />
          </Flex>
        )}
      </Flex>
    </Box>
  );
};
