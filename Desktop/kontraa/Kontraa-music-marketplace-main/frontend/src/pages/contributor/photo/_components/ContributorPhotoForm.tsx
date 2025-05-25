import { useEffect } from "react";
import { createListCollection, Flex, Grid, GridItem } from "@chakra-ui/react";

import { useAppDispatch, useAppSelector } from "@/app/store";
import { fetchPhotoVideoCategories } from "@/features/category/photoVideoCategorySlice";
import CustomInput from "@/components/form/CustomInput";
import CustomSelect from "@/components/form/CustomSelect";
import CustomFileInput from "@/components/form/CustomFileInput";

interface IContributorPhotoFormProps extends IFormBaseProperties {
  data?: Photo;
}

export default function ContributorPhotoForm({
  data,
  errors,
}: IContributorPhotoFormProps) {
  const dispatch = useAppDispatch();
  const { photoVideoCategories } = useAppSelector(
    (state) => state.photoVideoCategories
  );

  const categories = createListCollection({
    items: photoVideoCategories.map((c) => ({
      label: c.name,
      value: c.id.toString(),
    })),
  });

  useEffect(() => {
    dispatch(fetchPhotoVideoCategories()).unwrap();
  }, [dispatch]);

  return (
    <Grid templateColumns={"repeat(4, 1fr)"} gap={4}>
      <CustomFileInput
        name="photoFile"
        label="Image File"
        required
        error={errors["photoFile"]}
        defaultValue={
          data
            ? {
                name: data.photoFile as string,
                url: (import.meta.env.VITE_AWS_BUCKET_LINK +
                  data.photoFile) as string,
              }
            : undefined
        }
      />

      <GridItem colSpan={3}>
        <Flex direction="column" gap={4} w="full">
          <CustomInput
            name="photoTitle"
            label="Title"
            defaultValue={data?.photoTitle}
            placeholder="Add photo title for the image alternative name"
            error={errors["photoTitle"]}
          />

          <CustomSelect
            label="Category"
            name="photoVideoCategory"
            error={errors["photoVideoCategory"]}
            options={categories}
            placeholder="Select category"
            defaultValue={(
              data?.photoVideoCategory as PhotoVideoCategory
            )?.id?.toString()}
          />
        </Flex>
      </GridItem>
    </Grid>
  );
}
