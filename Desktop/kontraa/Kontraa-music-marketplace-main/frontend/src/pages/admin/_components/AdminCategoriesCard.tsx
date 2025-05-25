import { Box, Flex, Image } from "@chakra-ui/react";

import EditButton from "@/components/afterAuth/EditButton";
import DeleteButton from "@/components/afterAuth/DeleteButton";

interface IAdminCategoriesCardProps {
  name: string;
  hasImage?: boolean;
  imgUrl?: string;
  handleEdit: () => void;
  handleDelete: () => void;
}

export function AdminCategoriesCardListView(props: IAdminCategoriesCardProps) {
  const { name, hasImage = false, imgUrl, handleEdit, handleDelete } = props;

  return (
    <Box
      px={6}
      py={4}
      mb={4}
      _hover={{
        backgroundColor: "gray.800/80",
      }}
      backgroundColor={"gray.900"}
      rounded={"lg"}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Flex alignItems={"center"} gap={4}>
          {hasImage && (
            <Image w={"60px"} h={"60px"} rounded={"md"} src={imgUrl} />
          )}
          <p>{name}</p>
        </Flex>
        <Flex gap={2} alignItems={"center"}>
          <EditButton handleEdit={handleEdit} />
          <DeleteButton handleDelete={handleDelete} />
        </Flex>
      </Flex>
    </Box>
  );
}
