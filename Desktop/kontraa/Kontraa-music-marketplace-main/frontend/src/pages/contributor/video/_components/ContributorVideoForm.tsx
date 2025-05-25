import { useEffect } from "react";
import { createListCollection, Flex, Grid, GridItem } from "@chakra-ui/react";

import CustomInput from "@/components/form/CustomInput";
import CustomSelect from "@/components/form/CustomSelect";
import CustomFileInput from "@/components/form/CustomFileInput";

import { useAppDispatch, useAppSelector } from "@/app/store";
import { fetchPhotoVideoCategories } from "@/features/category/photoVideoCategorySlice";

interface IContributorvideoFormProps extends IFormBaseProperties {
  data?: Video;
}

export default function ContributorvideoForm({
  data,
  errors,
}: IContributorvideoFormProps) {
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
        name="videoFile"
        label="Video File"
        error={errors["videoFile"]}
        accept={["video"]}
        maxSize={500}
        // TODO: fix the video preview issue
        defaultValue={
          data
            ? {
                name: data.videoTitle,
                url:
                  (import.meta.env.VITE_AWS_BUCKET_LINK as string) +
                  data.videoFile,
              }
            : undefined
        }
      />

      <GridItem colSpan={3}>
        <Flex direction="column" gap={4}>
          <CustomInput
            name="videoTitle"
            label="Title"
            defaultValue={data?.videoTitle}
            placeholder="Add video title"
            error={errors["videoTitle"]}
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
