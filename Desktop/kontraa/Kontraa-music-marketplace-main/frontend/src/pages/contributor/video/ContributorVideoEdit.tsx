import React from "react";
import { useParams } from "react-router-dom";

import FormWrapper from "@/wrappers/FormWrapper";
import { toaster } from "@/components/ui/toaster";
import { updateVideo } from "@/features/video/videoSlice";
import { useAppDispatch, useAppSelector } from "@/app/store";
import ContributorvideoForm from "./_components/ContributorVideoForm";

export default function ContributorVideoEdit() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { isPending, myVideos } = useAppSelector((state) => state.videos);
  const currentVideo = myVideos.find((d) => d.id === +id!);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const d: dynamicObj = {};

    const videoFile = formData.get("videoFile") as File;

    if (videoFile.size > 0 && videoFile.name !== currentVideo?.videoFile) {
      d.videoFile = videoFile;
    }
    if (formData.get("videoTitle") !== currentVideo?.videoTitle) {
      d.videoTitle = formData.get("videoTitle");
    }
    if (
      Number(formData.get("photoVideoCategory")) !==
      (currentVideo?.photoVideoCategory as PhotoVideoCategory).id
    ) {
      d.photoVideoCategory = Number(formData.get("photoVideoCategory"));
    }

    try {
      await dispatch(updateVideo({ id: +id!, ...d })).unwrap();

      // e.currentTarget.reset();
      toaster.create({
        title: "Video edited successfully",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      toaster.create({
        title: "Error while editing video",
        type: "error",
      });
    }
  };

  return (
    <FormWrapper
      title="Video"
      isEdit
      handleSubmit={handleSubmit}
      isBtnPending={isPending}
    >
      <ContributorvideoForm data={currentVideo} errors={{}} />
    </FormWrapper>
  );
}
