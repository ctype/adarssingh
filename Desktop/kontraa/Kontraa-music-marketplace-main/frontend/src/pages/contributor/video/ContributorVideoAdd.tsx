import React from "react";
import FormWrapper from "@/wrappers/FormWrapper";

import { toaster } from "@/components/ui/toaster";
import { createVideo } from "@/features/video/videoSlice";
import { useAppDispatch, useAppSelector } from "@/app/store";
import ContributorvideoForm from "./_components/ContributorVideoForm";

export default function ContributorVideoAdd() {
  const dispatch = useAppDispatch();
  const { isPending } = useAppSelector((state) => state.videos);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    try {
      await dispatch(
        createVideo({
          videoFile: formData.get("videoFile") as Blob,
          videoTitle: formData.get("videoTitle") as string,
          photoVideoCategory: Number(formData.get("photoVideoCategory")),
        })
      )
        .unwrap()
        .then(() => {
          // e.currentTarget.reset();
          toaster.create({
            title: "Video uploaded successfully",
            type: "success",
          });
        });
    } catch (error) {
      console.error(error);
      toaster.create({
        title: "Error while uploading video",
        type: "error",
      });
    }
  };
  return (
    <FormWrapper
      title="Video"
      handleSubmit={handleSubmit}
      isBtnPending={isPending}
    >
      <ContributorvideoForm errors={{}} />
    </FormWrapper>
  );
}
