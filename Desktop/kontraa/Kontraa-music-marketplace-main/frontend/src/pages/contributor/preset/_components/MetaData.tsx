import { Info } from "lucide-react";
import { useParams } from "react-router-dom";
import React, { useContext, useEffect } from "react";
import { Box, Flex, Text, VStack } from "@chakra-ui/react";

import { useAppDispatch, useAppSelector } from "@/app/store";
import CustomTagInput from "@/components/form/CustomTagInput";
import { CustomControlledSelect } from "@/components/form/CustomControlledSelect";
import {
  TEMP_AUDIO_FILE_MP3_ID,
  TEMP_AUDIO_FILE_ZIP_ID,
  TEMP_TRACK_ID,
} from "../../utils/options";
import { fetchGenreMixes } from "@/features/genreMix/genreMixSlice";
import { PresetContext } from "../context/PresetContext";
import { createPreset, updatePreset } from "@/features/preset/presetSlice";
import { fetchPresetTypes } from "@/features/preset/presetTypeSlice";
import CustomInput from "@/components/form/CustomInput";

export default function MetaData({
  goToNextStep,
  hasBeenEdited,
  setHasBeenEdited,
  setUploadingPreset,
}: {
  goToNextStep: () => void;
  hasBeenEdited: boolean;
  setHasBeenEdited: React.Dispatch<React.SetStateAction<boolean>>;
  setUploadingPreset: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { genreMixes } = useAppSelector((state) => state.genreMixes);
  const { presetTypes } = useAppSelector((state) => state.presetTypes);

  const { presetData, setPresetData } = useContext(PresetContext);

  const handleMetaDataSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploadingPreset(true);
    const formData = new FormData(e.currentTarget);

    const data = Object.fromEntries(formData.entries());
    const preset = {
      ...presetData,
      numberOfFiles: Number(data.numberOfFiles),
    };
    setPresetData(preset);

    const zipId = Number(
      localStorage.getItem(TEMP_AUDIO_FILE_ZIP_ID) ??
        (presetData.fileIds?.[0] as TrackFile)?.id
    );
    const mp3Id = Number(
      localStorage.getItem(TEMP_AUDIO_FILE_MP3_ID) ??
        (presetData.fileIds?.[1] as TrackFile)?.id
    );

    if (id || hasBeenEdited) {
      const toSendData: Partial<PresetCreateUpdateFields> = {
        ...preset,
      };

      if (typeof toSendData.artworkFile === "string") {
        delete toSendData.artworkFile;
      }

      delete toSendData.collaborators;
      delete (toSendData as Partial<Preset>).id;
      delete (toSendData as Partial<Preset>).uploadedBy;
      delete toSendData.__typename;
      delete toSendData.licenses;
      delete toSendData.exclusiveOneTimeBuyPrices;

      await dispatch(
        updatePreset({
          id: id ? Number(id) : Number(localStorage.getItem(TEMP_TRACK_ID)),
          data: {
            ...toSendData,
            fileIds: [zipId, mp3Id],
          },
        })
      )
        .then(() => {
          goToNextStep();
        })
        .finally(() => {
          setUploadingPreset(false);
        });
    } else {
      const toSendData = { ...presetData };
      delete toSendData.collaborators;

      await dispatch(
        createPreset({
          ...toSendData,
          fileIds: [zipId, mp3Id],
        })
      )
        .then((p) => {
          localStorage.setItem(TEMP_TRACK_ID, p.payload.createPreset.id);
          setHasBeenEdited(true);
          goToNextStep();
        })
        .finally(() => {
          setUploadingPreset(false);
        });
    }
  };

  const genreMixOptions = genreMixes.map((genreMix) => ({
    value: genreMix.id,
    label: genreMix.name,
  }));
  const presetOptions = presetTypes.map((presetType) => ({
    value: presetType.id,
    label: presetType.name,
  }));

  useEffect(() => {
    const fetchOptions = async () => {
      if (genreMixes.length <= 0) {
        dispatch(fetchGenreMixes()).unwrap();
      }
      if (presetTypes.length <= 0) {
        dispatch(fetchPresetTypes()).unwrap();
      }
    };

    fetchOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectChange = (value: string, name: string) => {
    if (setPresetData && presetData) {
      setPresetData({ ...presetData, [name]: Number(value) });
    }
  };

  const handleTagChange = (tag: string, isAdd: boolean) => {
    if (isAdd) {
      setPresetData({
        ...presetData,
        tags: [...presetData.tags, tag],
      });
    } else {
      const tags = presetData.tags.filter((t) => t !== tag);
      setPresetData({ ...presetData, tags });
    }
  };

  return (
    <Box justifyContent={"center"} alignItems={"center"} rounded={"lg"} mx={2}>
      <form onSubmit={handleMetaDataSubmit} id="metadata-form">
        <VStack gap={6}>
          <Flex direction={"Column"} gap={1} w={"full"}>
            <CustomTagInput
              tags={presetData?.tags ?? []}
              label="Tags"
              placeholder="Enter your tags"
              name="tags"
              updateTags={handleTagChange}
            />
            <Flex color={"gray.400"} gap={1} alignItems={"center"}>
              <Info size={16} />
              <Text fontSize={"xs"}>You can add up to 3 tags</Text>
            </Flex>
          </Flex>

          <Flex w={"full"} gap={2}>
            <CustomControlledSelect
              name="genreMix"
              label="Genre Mix"
              value={presetData?.genreMix.toString()}
              setValue={(v) => handleSelectChange(v, "genreMix")}
              options={genreMixOptions}
            />
            <CustomControlledSelect
              name="presetType"
              label="Preset Type"
              value={presetData?.presetType.toString()}
              setValue={(v) => handleSelectChange(v, "presetType")}
              options={presetOptions}
            />
          </Flex>

          <CustomInput
            name="numberOfFiles"
            type="number"
            label="Number of Files"
            defaultValue={presetData?.numberOfFiles.toString()}
            placeholder="Enter the number of audio files in the preset"
          />
        </VStack>
      </form>
    </Box>
  );
}
