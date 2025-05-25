import { formatDate } from "date-fns";
import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
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
  TEMP_AUDIO_FILE_WAV_ID,
  TEMP_AUDIO_FILE_ZIP_ID,
  visibility,
} from "../../utils/options";
import { TrackContext } from "../context/TrackContext";
import CustomInput from "@/components/form/CustomInput";
import CustomTextArea from "@/components/form/CustomTextArea";
import CustomFileInput from "@/components/form/CustomFileInput";
import { uploadTrackFile } from "@/features/trackFile/trackFileSlice";
import { CustomControlledSelect } from "@/components/form/CustomControlledSelect";
import { toaster } from "@/components/ui/toaster";

export default function BasicMusicInfoAndfiles({
  goToNextStep,
  hasBeenEdited,
}: {
  goToNextStep: () => void;
  hasBeenEdited: boolean;
}) {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { trackData, setTrackData } = useContext(TrackContext);
  const [isUploading, setIsUploading] = useState({
    mp3: false,
    wav: false,
    zip: false,
  });
  const [error, setError] = useState<dynamicStringObj>({});

  const handleBasicInfoSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = Object.fromEntries(formData.entries());
    let audioData = { ...trackData, visibility: +data.visibility };

    if (id || hasBeenEdited) {
      if ((data.artworkFile as File)?.name !== "") {
        audioData = {
          ...audioData,
          artworkFile: data.artworkFile,
        };
      }
      audioData = {
        ...audioData,
        title: data.title as string,
        description: data.description as string,
        releaseDate: new Date(data.releaseDate as string),
        visibility: +data.visibility,
      };
    } else {
      audioData = {
        ...audioData,
        title: data.title as string,
        description: data.description as string,
        artworkFile: data.artworkFile as File,
      };
    }

    if (
      audioData.wavFile === "" ||
      audioData.trackStreamFile === "" ||
      audioData.mp3File === ""
    ) {
      toaster.create({
        type: "error",
        title: "File sizes",
        description: "Please fix all error before moving",
      });
      return;
    }

    setTrackData(audioData);
    goToNextStep();
  };

  const handleSelectChange = (v: string) => {
    setTrackData((prev) => ({
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
        setError({
          [type === "mp3"
            ? "mp3File"
            : type === "zip"
              ? "trackStreamFile"
              : "wavFile"]: "File size too big",
        });
        return;
      }
      setIsUploading((prev) => ({ ...prev, [type]: true }));
      await dispatch(
        uploadTrackFile({
          file: f.acceptedFiles[0],
          fileId:
            type === "mp3"
              ? trackData.mp3File
              : type === "zip"
                ? trackData.trackStreamFile
                : trackData.wavFile,
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
            ...trackData,
          };
          if (type === "wav") {
            updatedTrack = {
              ...updatedTrack,
              wavFile: d.payload.uploadTrackFile.fileUrl,
            };
            localStorage.setItem(
              TEMP_AUDIO_FILE_WAV_ID,
              d.payload.uploadTrackFile.id
            );
          }
          if (type === "mp3") {
            updatedTrack = {
              ...updatedTrack,
              mp3File: d.payload.uploadTrackFile.fileUrl,
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
          setTrackData(updatedTrack);
        }
      });
    }
  };

  return (
    <form onSubmit={handleBasicInfoSubmit} id="baisc-music-info-form">
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
                (trackData as Track).id
                  ? {
                      name: trackData?.title,
                      url:
                        import.meta.env.VITE_AWS_BUCKET_LINK +
                        trackData?.artworkFile,
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
              defaultValue={trackData.title}
            />
            <VStack w={"full"} gap={1}>
              <CustomTextArea
                label="Description"
                name="description"
                required={false}
                placeholder="Share the story,vibe,and inspiration..."
                rows={7}
                defaultValue={trackData?.description ?? ""}
              />
            </VStack>
          </VStack>
        </Flex>

        <VStack gap={4} mt={4} w={"full"}>
          <Text alignSelf={"self-start"}>Files for download and streaming</Text>
          <Flex gap={4} w={"full"}>
            <CustomFileInput
              accept={["audio-wav"]}
              label="Track"
              name="wavFile"
              maxSize={70}
              isUploading={isUploading.wav}
              defaultValue={
                trackData && (trackData as Track).id
                  ? {
                      name: trackData?.title,
                      url:
                        import.meta.env.VITE_AWS_BUCKET_LINK +
                        trackData?.wavFile,
                    }
                  : undefined
              }
              onChange={(e) => handleUploadTrack(e, "wav", 70)}
              error={error["wavFile"]}
            />
            <CustomFileInput
              accept={["audio-mp3"]}
              label="Mp3 File"
              name="mp3File"
              maxSize={15}
              isUploading={isUploading.mp3}
              defaultValue={
                trackData && (trackData as Track).id
                  ? {
                      name: trackData?.title,
                      url:
                        import.meta.env.VITE_AWS_BUCKET_LINK +
                        trackData?.mp3File,
                    }
                  : undefined
              }
              onChange={(e) => handleUploadTrack(e, "mp3", 15)}
              error={error["mp3File"]}
            />
            <CustomFileInput
              accept={["zip"]}
              label="Zip File"
              name="trackStreamFile"
              maxSize={500}
              isUploading={isUploading.zip}
              defaultValue={
                trackData && (trackData as Track).id
                  ? {
                      name: trackData?.title,
                      url:
                        import.meta.env.VITE_AWS_BUCKET_LINK +
                        trackData?.trackStreamFile,
                    }
                  : undefined
              }
              onChange={(e) => handleUploadTrack(e, "zip", 500)}
              error={error["trackStreamFile"]}
            />
          </Flex>
        </VStack>
        <Separator borderColor={"gray.600"} my={4} />
        <Flex w={"full"} gap={4}>
          {/* <CustomSelect name="trackType" label="Track Type" options={options} /> */}
          <CustomControlledSelect
            name="visibility"
            label="Visibility"
            value={trackData?.visibility?.toString() ?? undefined}
            options={visibility}
            setValue={(v) => handleSelectChange(v)}
          />
          <CustomInput
            label="Release Date"
            name="releaseDate"
            type="date"
            defaultValue={
              trackData?.releaseDate
                ? formatDate(trackData?.releaseDate, "yyyy-MM-dd")
                : undefined
            }
          />
        </Flex>
      </VStack>
    </form>
  );
}
