import { useAppDispatch, useAppSelector } from "@/app/store";
import FormWrapper from "@/wrappers/FormWrapper";
import { toaster } from "@/components/ui/toaster";
import ContributorSoundEffectForm from "./_components/ContributorSoundEffectForm";
import { createSoundEffect } from "@/features/sound_effect/soundEffectSlice";
import { useState } from "react";

export default function ContributorSoundEffectAdd() {
  const dispatch = useAppDispatch();
  const { isPending } = useAppSelector((state) => state.soundEffects);
  const [error, setError] = useState<dynamicStringObj>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const artworkFile = formData.get("soundEffectArtworkFile") as File;
    const mp3File = formData.get("soundEffectMp3File") as File;

    if (mp3File.size / 1024 / 1024 > 1) {
      setError({
        soundEffectArtworkFile: "Sound file too big",
      });
      return;
    }
    if (artworkFile.size / 1024 / 1024 > 1) {
      setError({
        soundEffectArtworkFile: "Image file too big",
      });
      return;
    }

    try {
      await dispatch(
        createSoundEffect({
          soundEffectTitle: formData.get("soundEffectTitle") as string,
          genreMix: Number(formData.get("genreMix")),
          soundEffectArtworkFile: artworkFile,
          soundEffectMp3File: mp3File,
        })
      );

      // e.currentTarget.reset();
      toaster.create({
        title: "Sound Effect uploaded successfully",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      toaster.create({
        title: "Error while uploading Sound Effect",
        type: "error",
      });
    }
  };

  return (
    <FormWrapper
      title="Sound Effect"
      handleSubmit={handleSubmit}
      isBtnPending={isPending}
    >
      <ContributorSoundEffectForm errors={error} />
    </FormWrapper>
  );
}
