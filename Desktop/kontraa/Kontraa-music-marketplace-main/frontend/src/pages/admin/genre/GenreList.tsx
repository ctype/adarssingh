import { Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import ListViewWrapper from "@/wrappers/ListViewWrapper";
import { useAppSelector } from "@/app/store";
import {
  createGenre,
  deleteGenre,
  fetchGenres,
  updateGenre,
} from "@/features/genre/genreSlice";
import CustomInput from "@/components/form/CustomInput";
import CustomFileInput from "@/components/form/CustomFileInput";
import { AdminCategoriesCardListView } from "../_components/AdminCategoriesCard";
import { AdminCategoriesFormDialog } from "../_components/AdminCategoriesFormDialog";
import { useCrudResource } from "@/hooks/useCrudResource";

export default function GenreList() {
  const [editId, setEditId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const MAX_IMG_SIZE = 5;

  const { genres, isPending, isUploading } = useAppSelector(
    (state) => state.genres
  );

  const {
    createResource,
    updateResource,
    deleteResource,
    fetchResource,
    validationError,
    setValidationError,
    clearValidationError,
  } = useCrudResource({
    resourceName: "genre",
    dupkeyName: "name",
    onSuccess: () => {
      setEditId(null);
      setIsFormOpen(false);
    },
  });

  const currentGenre = genres.find((g) => g.id === editId);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const genreArtwork = formData.get("genreArtwork") as File;

    if (genreArtwork.size / 1024 / 1024 > MAX_IMG_SIZE) {
      setValidationError({
        genreArtwork: "Image file is too big",
      });
      return;
    }

    await createResource(createGenre, { name, genreArtwork });
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const genreArtwork = formData.get("genreArtwork") as File;
    const id = formData.get("id") as string;

    const toSendData: dynamicObj = { name };
    if (genreArtwork.size > 0) {
      if (genreArtwork.size / 1024 / 1024 > MAX_IMG_SIZE) {
        setValidationError({
          genreArtwork: "Image file is too big",
        });
        return;
      }
      toSendData.genreArtwork = genreArtwork;
    }

    await updateResource(updateGenre, { id: Number(id), data: toSendData });
  };

  const deleteCategory = async (id: number) => {
    deleteResource(deleteGenre, id);
  };

  useEffect(() => {
    if (genres.length <= 0) {
      fetchResource(() => fetchGenres(), []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ListViewWrapper
      title="Genre Mix"
      hasAdd
      onAdd={() => setIsFormOpen(true)}
      isLoading={isPending}
      isEmpty={genres.length <= 0 && !isFormOpen}
    >
      {genres.map((genre) => (
        <AdminCategoriesCardListView
          key={genre.id}
          name={genre.name}
          hasImage
          imgUrl={import.meta.env.VITE_AWS_BUCKET_LINK + genre.genreArtwork}
          handleDelete={() => deleteCategory(genre.id)}
          handleEdit={() => {
            setEditId(genre.id);
            setIsFormOpen(true);
          }}
        />
      ))}

      <AdminCategoriesFormDialog
        open={isFormOpen}
        setOpen={setIsFormOpen}
        title={" Genre Mix"}
        isEdit={editId !== null}
        handleSubmit={(e) => {
          if (editId !== null) {
            handleUpdateCategory(e);
          } else {
            handleCreateCategory(e);
          }
        }}
        isLoading={isUploading}
        data={genres.find((g) => g.id === editId)}
        handleCancel={() => {
          clearValidationError();
          setIsFormOpen(false);
          setEditId(null);
        }}
      >
        <Flex direction="column" gap={4}>
          <CustomFileInput
            name="genreArtwork"
            label="Artwork File"
            maxSize={MAX_IMG_SIZE}
            defaultValue={
              currentGenre
                ? {
                    name: currentGenre.genreArtwork as string,
                    url: (import.meta.env.VITE_AWS_BUCKET_LINK +
                      currentGenre.genreArtwork) as string,
                  }
                : undefined
            }
            required
            error={validationError["genreArtwork"]}
          />
          <CustomInput
            name="name"
            label="Genre Mix Name"
            defaultValue={currentGenre?.name as string}
            placeholder="Add genre mix name "
            required
            error={validationError["name"]}
          />
        </Flex>
      </AdminCategoriesFormDialog>
    </ListViewWrapper>
  );
}
