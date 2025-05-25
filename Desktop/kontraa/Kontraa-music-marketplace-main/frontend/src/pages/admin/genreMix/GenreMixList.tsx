import React, { useEffect, useState } from "react";

import ListViewWrapper from "@/wrappers/ListViewWrapper";
import { useAppSelector } from "@/app/store";
import {
  createGenreMix,
  deleteGenreMix,
  fetchGenreMixes,
  updateGenreMix,
} from "@/features/genreMix/genreMixSlice";
import CustomInput from "@/components/form/CustomInput";
import { AdminCategoriesCardListView } from "../_components/AdminCategoriesCard";
import { AdminCategoriesFormDialog } from "../_components/AdminCategoriesFormDialog";
import { useCrudResource } from "@/hooks/useCrudResource";

export default function GenreMixList() {
  const {
    createResource,
    updateResource,
    fetchResource,
    deleteResource,
    validationError,
    clearValidationError,
  } = useCrudResource({
    resourceName: "genre mix",
    dupkeyName: "name",
    onSuccess: () => {
      setEditId(null);
      setIsFormOpen(false);
    },
  });
  const { genreMixes, isPending } = useAppSelector((state) => state.genreMixes);
  const [editId, setEditId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const currentGenreMix = genreMixes.find((gm: GenreMix) => gm.id === editId);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;

    await createResource(createGenreMix, name);
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const id = formData.get("id") as string;

    await updateResource(updateGenreMix, { id: Number(id), name });
  };

  const deleteCategory = async (id: number) => {
    await deleteResource(deleteGenreMix, id);
  };

  useEffect(() => {
    fetchResource(() => fetchGenreMixes(), []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ListViewWrapper
      title="Genre"
      hasAdd
      onAdd={() => setIsFormOpen(true)}
      isLoading={isPending}
      isEmpty={genreMixes.length <= 0 && !isFormOpen}
    >
      {genreMixes.map((genreMix) => (
        <AdminCategoriesCardListView
          key={genreMix.id}
          name={genreMix.name}
          handleEdit={() => {
            setEditId(genreMix.id);
            setIsFormOpen(true);
          }}
          handleDelete={() => deleteCategory(genreMix.id)}
        />
      ))}

      <AdminCategoriesFormDialog
        open={isFormOpen}
        setOpen={setIsFormOpen}
        title={" Genre"}
        isEdit={editId !== null}
        handleSubmit={(e) => {
          if (editId !== null) {
            handleUpdateCategory(e);
          } else {
            handleCreateCategory(e);
          }
        }}
        isLoading={isPending}
        data={currentGenreMix}
        handleCancel={() => {
          clearValidationError();
          setIsFormOpen(false);
          setEditId(null);
        }}
      >
        <CustomInput
          name="name"
          label="Genre Name"
          defaultValue={currentGenreMix?.name}
          placeholder="Eg. Hip Hop, RnB."
          required
          error={validationError["name"]}
        />
      </AdminCategoriesFormDialog>
    </ListViewWrapper>
  );
}
