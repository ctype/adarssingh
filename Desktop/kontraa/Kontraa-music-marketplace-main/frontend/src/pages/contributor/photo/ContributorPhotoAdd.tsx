import { useAppDispatch } from "@/app/store";
import FormWrapper from "@/wrappers/FormWrapper";
import { toaster } from "@/components/ui/toaster";
import { createPhoto } from "@/features/photo/photoSlice";

import ContributorPhotoForm from "./_components/ContributorPhotoForm";

export default function ContributorPhotoAdd() {
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    try {
      await dispatch(
        createPhoto({
          photoFile: formData.get("photoFile") as Blob,
          photoTitle: formData.get("photoTitle") as string,
          photoVideoCategory: Number(formData.get("photoVideoCategory")),
        })
      )
        .unwrap()
        .then(() => {
          // e.currentTarget.reset();
          toaster.create({
            title: "Photo uploaded successfully",
            type: "success",
          });
        });
    } catch (error) {
      console.error(error);
      toaster.create({
        title: "Error while uploading photo",
        type: "error",
      });
    }
  };

  return (
    <FormWrapper title="Photo" handleSubmit={handleSubmit}>
      <ContributorPhotoForm errors={{}} />
    </FormWrapper>
  );
}
