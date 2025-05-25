import { useEffect } from "react";
import {
  Box,
  createListCollection,
  Flex,
  Grid,
  GridItem,
} from "@chakra-ui/react";

import CustomInput from "@/components/form/CustomInput";
import CustomSelect from "@/components/form/CustomSelect";
import { useAppDispatch, useAppSelector } from "@/app/store";
// import CustomTextArea from "@/components/form/CustomTextArea";
import CustomFileInput from "@/components/form/CustomFileInput";
import { fetchGenreMixes } from "@/features/genreMix/genreMixSlice";

interface IContributorvideoFormProps extends IFormBaseProperties {
  data?: SoundEffect;
}

export default function ContributorSoundEffectForm({
  data,
  errors,
}: IContributorvideoFormProps) {
  const dispatch = useAppDispatch();
  const { genreMixes } = useAppSelector((state) => state.genreMixes);

  const genreMixOptions = createListCollection({
    items: genreMixes?.map((gM) => ({
      label: gM.name,
      value: gM.id.toString(),
    })),
  });

  useEffect(() => {
    dispatch(fetchGenreMixes()).unwrap();
  }, [dispatch]);

  return (
    <Grid templateColumns={"repeat(2, 1fr)"} gap={4}>
      <GridItem colSpan={2}>
        <Flex direction="column" gap={4}>
          <CustomInput
            name="soundEffectTitle"
            label="Title"
            defaultValue={data?.soundEffectTitle}
            placeholder="Add sound Effect title"
            error={errors["soundEffect"]}
          />

          {/* <CustomTextArea label="Description" name="Description" /> */}

          <CustomSelect
            label="Genre Mix"
            name="genreMix"
            error={errors["genreMix"]}
            options={genreMixOptions}
            placeholder="Select genre mix"
            defaultValue={(data?.genreMix as GenreMix)?.id?.toString()}
          />
        </Flex>
      </GridItem>

      <GridItem colSpan={2}>
        <Flex gap={4}>
          <Box>
            <CustomFileInput
              name="soundEffectArtworkFile"
              label="Image"
              error={errors["soundEffectArtworkFile"]}
              defaultValue={
                data
                  ? {
                      name: data.soundEffectArtworkFile as string,
                      url:
                        (import.meta.env.VITE_AWS_BUCKET_LINK as string) +
                        data.soundEffectArtworkFile,
                    }
                  : undefined
              }
            />
          </Box>

          <CustomFileInput
            name="soundEffectMp3File"
            label="Mp3 File"
            error={errors["soundEffectMp3File"]}
            accept={["audio-mp3"]}
            maxSize={15}
            defaultValue={
              data
                ? {
                    name: data.soundEffectMp3File as string,
                    url:
                      (import.meta.env.VITE_AWS_BUCKET_LINK as string) +
                      data.soundEffectMp3File,
                  }
                : undefined
            }
          />
        </Flex>
      </GridItem>
    </Grid>
  );
}
