import React from "react";
import { useParams } from "react-router-dom";

import FormWrapper from "@/wrappers/FormWrapper";
import { toaster } from "@/components/ui/toaster";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { updateSoundEffect } from "@/features/sound_effect/soundEffectSlice";
import ContributorSoundEffectForm from "./_components/ContributorSoundEffectForm";

export default function ContributorSoundEffectEdit() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { mySoundEffects, isPending } = useAppSelector(
    (state) => state.soundEffects
  );
  const currentSoundEffect = mySoundEffects.find(
    (soundefct) => soundefct.id === +id!
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const d: dynamicObj = {};

    const soundEffectArtworkFile = formData.get(
      "soundEffectArtworkFile"
    ) as File;
    if (
      soundEffectArtworkFile.size > 0 &&
      soundEffectArtworkFile.name !== currentSoundEffect?.soundEffectArtworkFile
    ) {
      d.soundEffectArtworkFile = soundEffectArtworkFile;
    }
    const soundEffectMp3File = formData.get("soundEffectMp3File") as File;
    if (
      soundEffectMp3File.size > 0 &&
      soundEffectMp3File.name !== currentSoundEffect?.soundEffectMp3File
    ) {
      d.soundEffectMp3File = soundEffectMp3File;
    }
    if (
      formData.get("soundEffectTitle") !== currentSoundEffect?.soundEffectTitle
    ) {
      d.soundEffectTitle = formData.get("soundEffectTitle");
    }
    if (
      Number(formData.get("genreMix")) !==
      (currentSoundEffect?.genreMix as GenreMix).id
    ) {
      d.genreMix = Number(formData.get("genreMix"));
    }

    if (Object.keys(d).length <= 0) {
      return;
    }

    try {
      await dispatch(
        updateSoundEffect({
          id: Number(id),
          data: {
            ...d,
          },
        })
      );

      // e.currentTarget.reset();
      toaster.create({
        title: "Sound Effect updated successfully",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      toaster.create({
        title: "Error while updating Sound Effect",
        type: "error",
      });
    }
  };
  return (
    <FormWrapper
      title="Sound Effect"
      isEdit
      handleSubmit={handleSubmit}
      isBtnPending={isPending}
    >
      <ContributorSoundEffectForm data={currentSoundEffect} errors={{}} />
    </FormWrapper>
  );
}
