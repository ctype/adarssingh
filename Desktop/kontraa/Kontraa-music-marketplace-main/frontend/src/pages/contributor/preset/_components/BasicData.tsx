import { useParams } from "react-router-dom";
import React, { useContext, useState } from "react";
import {
  Box,
  FileUploadFileChangeDetails,
  Flex,
  Separator,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useAppDispatch } from "@/app/store";
import {
  TEMP_AUDIO_FILE_MP3_ID,
  TEMP_AUDIO_FILE_ZIP_ID,
  visibility,
} from "../../utils/options";
import CustomInput from "@/components/form/CustomInput";
import CustomTextArea from "@/components/form/CustomTextArea";
import CustomFileInput from "@/components/form/CustomFileInput";
import { uploadTrackFile } from "@/features/trackFile/trackFileSlice";
import { CustomControlledSelect } from "@/components/form/CustomControlledSelect";
import { PresetContext } from "../context/PresetContext";
import { toaster } from "@/components/ui/toaster";

export default function BasicData({
  goToNextStep,
  hasBeenEdited,
}: {
  goToNextStep: () => void;
  hasBeenEdited: boolean;
}) {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { presetData, setPresetData } = useContext(PresetContext);
  const [isUploading, setIsUploading] = useState({
    mp3: false,
    wav: false,
    zip: false,
  });

  const handleBasicInfoSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = Object.fromEntries(formData.entries());
    let preset = { ...presetData, visibility: +data.visibility };

    if (id || hasBeenEdited) {
      if ((data.artworkFile as File).name !== "") {
        preset = {
          ...preset,
          artworkFile: data.artworkFile,
        };
      }
      preset = {
        ...preset,
        title: data.title as string,
        description: data.description as string,
        visibility: +data.visibility,
      };
    } else {
      preset = {
        ...preset,
        title: data.title as string,
        description: data.description as string,
        artworkFile: data.artworkFile as File,
      };
    }

    if (
      preset.artworkFile === "" ||
      preset.mp3Files[0] === "" ||
      preset.trackStreamFile === ""
    ) {
      toaster.create({
        type: "error",
        title: "File size error",
        description: "Please fix size error first",
      });
      return;
    }

    setPresetData(preset);
    goToNextStep();
  };

  const handleSelectChange = (v: string) => {
    setPresetData((prev) => ({
      ...prev,
      visibility: +v,
    }));
  };

  const handleUploadTrack = async (
    f: FileUploadFileChangeDetails,
    type: string,
    fileSize: number
  ) => {
    if (f.acceptedFiles[0]) {
      if (f.acceptedFiles[0].size / 1024 / 1024 > fileSize) {
        return;
      }
      setIsUploading((prev) => ({ ...prev, [type]: true }));
      await dispatch(
        uploadTrackFile({
          file: f.acceptedFiles[0],
          fileId:
            type === "mp3"
              ? presetData.mp3Files[0]
              : presetData.trackStreamFile,
          name: null,
          // fetchOpt: {
          //   onUploadProgress: (progressEvent: ProgressEvent) => {
          //     console.log(progressEvent.loaded);

          //     const precentage = Math.round(
          //       (progressEvent.loaded * 100) / progressEvent.total
          //     );
          //     setProgress((prev) => ({ ...prev, [type]: precentage }));
          //   },
          // },
        })
      ).then((d) => {
        setIsUploading((prev) => ({ ...prev, [type]: false }));
        if (d.payload.uploadTrackFile) {
          let updatedTrack = {
            ...presetData,
          };
          if (type === "mp3") {
            updatedTrack = {
              ...updatedTrack,
              mp3Files: [d.payload.uploadTrackFile.fileUrl],
            };
            localStorage.setItem(
              TEMP_AUDIO_FILE_MP3_ID,
              d.payload.uploadTrackFile.id
            );
          }
          if (type === "zip") {
            updatedTrack = {
              ...updatedTrack,
              trackStreamFile: d.payload.uploadTrackFile.fileUrl,
            };
            localStorage.setItem(
              TEMP_AUDIO_FILE_ZIP_ID,
              d.payload.uploadTrackFile.id
            );
          }
          setPresetData(updatedTrack);
        }
      });
    }
  };

  return (
    <form onSubmit={handleBasicInfoSubmit} id="baisc-data-form">
      <VStack
        justifyContent={"center"}
        alignItems={"center"}
        rounded={"lg"}
        mx={2}
        gap={4}
      >
        <Flex gap={4} w={"full"}>
          <Box>
            <CustomFileInput
              label="ArtWork Image"
              name="artworkFile"
              defaultValue={
                (presetData as Preset).id
                  ? {
                      name: presetData?.title,
                      url:
                        import.meta.env.VITE_AWS_BUCKET_LINK +
                        presetData?.artworkFile,
                    }
                  : undefined
              }
            />
          </Box>
          <VStack gap={6} w={"full"}>
            <CustomInput
              label="Title"
              name="title"
              placeholder="Enter track title"
              defaultValue={presetData.title}
            />
            <VStack w={"full"} gap={1}>
              <CustomTextArea
                label="Description"
                name="description"
                required={false}
                placeholder="Share the story,vibe,and inspiration..."
                rows={7}
                defaultValue={presetData?.description ?? ""}
              />
            </VStack>
          </VStack>
        </Flex>

        <VStack gap={4} mt={4} w={"full"}>
          <Text alignSelf={"self-start"}>Files for streaming and purchase</Text>
          <Flex gap={4} w={"full"}>
            <Box>
              <CustomFileInput
                accept={["audio-mp3"]}
                label="Mp3 File"
                name="mp3Files"
                maxSize={15}
                isUploading={isUploading.mp3}
                defaultValue={
                  presetData && (presetData as Preset).id
                    ? {
                        name: presetData?.title,
                        url:
                          import.meta.env.VITE_AWS_BUCKET_LINK +
                          presetData?.mp3Files[0],
                      }
                    : undefined
                }
                onChange={(e) => handleUploadTrack(e, "mp3", 15)}
              />
            </Box>
            <CustomFileInput
              accept={["zip"]}
              maxSize={500}
              label="Zip File"
              name="trackSteamFile"
              isUploading={isUploading.zip}
              defaultValue={
                presetData && (presetData as Preset).id
                  ? {
                      name: presetData?.title,
                      url:
                        import.meta.env.VITE_AWS_BUCKET_LINK +
                        presetData?.trackStreamFile,
                    }
                  : undefined
              }
              onChange={(e) => handleUploadTrack(e, "zip", 500)}
            />
          </Flex>
        </VStack>
        <Separator borderColor={"gray.600"} my={4} />
        <Flex w={"full"} gap={4}>
          <CustomControlledSelect
            name="visibility"
            label="Visibility"
            value={presetData.visibility.toString()}
            options={visibility}
            setValue={(v) => handleSelectChange(v)}
          />
        </Flex>
      </VStack>
    </form>
  );
}
