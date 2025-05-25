import { FormEvent } from "react";
import { useParams } from "react-router-dom";

import FormWrapper from "@/wrappers/FormWrapper";
import { SubGenreForm } from "./_components/SubGenreForm";
import { useAppSelector } from "@/app/store";
import { updateSubGenre } from "@/features/subGenre/subGenreSlice";
import { useCrudResource } from "@/hooks/useCrudResource";

export default function SubGenreEdit() {
  const { id } = useParams();
  const { updateResource, validationError } = useCrudResource({
    resourceName: "sub genre",
    dupkeyName: "name",
  });
  const { isUploading, subGenres } = useAppSelector((state) => state.subGenres);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const genreId = Number(formData.get("genreId"));

    await updateResource(updateSubGenre, { id: Number(id), name, genreId });
  };

  return (
    <FormWrapper
      title="Sub Genre"
      isEdit
      handleSubmit={handleSubmit}
      isBtnPending={isUploading}
    >
      <SubGenreForm
        data={subGenres.find((sg) => sg.id === Number(id))}
        errors={validationError}
      />
    </FormWrapper>
  );
}
