import React, { useEffect, useState } from "react";

import ListViewWrapper from "@/wrappers/ListViewWrapper";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  deleteTrackFile,
  fetchTrackFiles,
  uploadTrackFile,
} from "@/features/trackFile/trackFileSlice";
import { Box, Flex, Span, Text, VStack } from "@chakra-ui/react";
import DeleteButton from "@/components/afterAuth/DeleteButton";
import { AudioWaveform, FolderKanbanIcon, Music } from "lucide-react";
import { Tag } from "@/components/ui/tag";
import { FormDialog } from "@/components/form/FormDialog";
import CustomFileInput from "@/components/form/CustomFileInput";
import CustomInput from "@/components/form/CustomInput";
import { toaster } from "@/components/ui/toaster";

export default function ContributorTrackFileList() {
  const dispatch = useAppDispatch();
  const { trackFiles, isPending } = useAppSelector((state) => state.trackFiles);

  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;
    const name = formData.get("name") as string;

    await dispatch(uploadTrackFile({ file, name, fileId: null }))
      .unwrap()
      .then(() => {
        toaster.create({
          type: "success",
          title: "File uploaded successfully",
        });
      })
      .finally(() => {
        setOpen(false);
      });
  };

  useEffect(() => {
    dispatch(fetchTrackFiles()).unwrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ListViewWrapper
      title="Track Files"
      onAdd={() => setOpen(true)}
      isLoading={isPending}
      isEmpty={trackFiles.length <= 0}
    >
      {trackFiles.map((trackFile) => (
        <Box
          key={trackFile.id}
          px={6}
          py={4}
          backgroundColor="gray.900"
          mb={4}
          rounded={"md"}
        >
          <Flex justifyContent="space-between" alignItems="center">
            <VStack alignItems="start">
              {(trackFile.audioId ||
                trackFile.soundBankId ||
                trackFile.presetId) && (
                <Tag
                  backgroundColor={
                    trackFile.audioId
                      ? "blue.800"
                      : trackFile.soundBankId
                      ? "teal.900"
                      : "purple.800"
                  }
                  color={"white"}
                  shadowColor={
                    trackFile.audioId
                      ? "blue.800"
                      : trackFile.soundBankId
                      ? "teal.900"
                      : "purple.800"
                  }
                >
                  Attached to{" "}
                  {trackFile.audioId
                    ? "track"
                    : trackFile.soundBankId
                    ? "sound bank"
                    : "preset"}
                </Tag>
              )}
              <Flex gap={2} alignItems={"center"} maxW="300px">
                <Span backgroundColor={"gray.700"} p={2} rounded={"md"}>
                  {trackFile.fileType === "mp3" ? (
                    <Music />
                  ) : trackFile.fileType === "wav" ? (
                    <AudioWaveform />
                  ) : (
                    <FolderKanbanIcon />
                  )}
                </Span>
                <Text isTruncated>{trackFile.fileName}</Text>
              </Flex>
            </VStack>
            <Flex gap={2} alignItems={"center"}>
              {!trackFile.audioId &&
                !trackFile.presetId &&
                !trackFile.soundBankId && (
                  <DeleteButton
                    handleDelete={() => {
                      dispatch(deleteTrackFile({ id: trackFile.id })).unwrap();
                    }}
                    onlyIcon={false}
                    p={2}
                  />
                )}
            </Flex>
          </Flex>
        </Box>
      ))}

      <FormDialog
        title="Upload file"
        open={open}
        setOpen={setOpen}
        handleCancel={() => {
          setOpen(false);
        }}
        handleSubmit={handleSubmit}
        yesText="Upload"
      >
        <VStack gap={4}>
          <CustomFileInput
            label="File"
            name="file"
            accept={[".wav", ".mp3", ".zip"]}
          />
          <CustomInput label="File Name" name="name" />
        </VStack>
      </FormDialog>
    </ListViewWrapper>
  );
}
