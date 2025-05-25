import { FormEvent } from "react";

import FormWrapper from "@/wrappers/FormWrapper";
import { SubGenreForm } from "./_components/SubGenreForm";
import { useAppSelector } from "@/app/store";
import { useCrudResource } from "@/hooks/useCrudResource";
import { createSubGenre } from "@/features/subGenre/subGenreSlice";

export default function SubGenreAdd() {
  const { isUploading } = useAppSelector((state) => state.subGenres);
  const { createResource, validationError } = useCrudResource({
    resourceName: "sub genre",
    dupkeyName: "name",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const genreId = Number(formData.get("genreId"));

    await createResource(createSubGenre, { name, genreId });
  };

  return (
    <FormWrapper
      title="Sub Genre"
      handleSubmit={handleSubmit}
      isBtnPending={isUploading}
    >
      <SubGenreForm errors={validationError} />
    </FormWrapper>
  );
}
