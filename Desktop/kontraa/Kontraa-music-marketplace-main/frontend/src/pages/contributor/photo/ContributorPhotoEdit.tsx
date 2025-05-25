import { useParams } from "react-router-dom";

import { toaster } from "@/components/ui/toaster";
import FormWrapper from "@/wrappers/FormWrapper";
import { updatePhoto } from "@/features/photo/photoSlice";
import { useAppDispatch, useAppSelector } from "@/app/store";

import ContributorPhotoForm from "./_components/ContributorPhotoForm";

export default function ContributorPhotoEdit() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { myPhotos } = useAppSelector((state) => state.photos);
  const currentPhoto = myPhotos.find((d) => d.id === +id!);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const d: dynamicObj = {};

    const photoFile = formData.get("photoFile") as File;

    if (photoFile.size > 0 && photoFile.name !== currentPhoto?.photoFile) {
      d.photoFile = photoFile;
    }
    if (formData.get("photoTitle") !== currentPhoto?.photoTitle) {
      d.photoTitle = formData.get("photoTitle");
    }
    if (
      Number(formData.get("photoVideoCategory")) !==
      (currentPhoto?.photoVideoCategory as PhotoVideoCategory).id
    ) {
      d.photoVideoCategory = Number(formData.get("photoVideoCategory"));
    }

    try {
      await dispatch(updatePhoto({ id: +id!, ...d })).unwrap();

      // e.currentTarget.reset();
      toaster.create({
        title: "Photo edited successfully",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      toaster.create({
        title: "Error while editing photo",
        type: "error",
      });
    }
  };

  return (
    <FormWrapper title="Photo" isEdit handleSubmit={handleSubmit}>
      <ContributorPhotoForm data={currentPhoto} errors={{}} />
    </FormWrapper>
  );
}
