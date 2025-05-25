import React, { useEffect, useState } from "react";

import ListViewWrapper from "@/wrappers/ListViewWrapper";
import { useAppSelector } from "@/app/store";
import {
  fetchPhotoVideoCategories,
  createPhotoVideoCategory,
  updatePhotoVideoCategory,
  deletePhotoVideoCategory,
} from "@/features/category/photoVideoCategorySlice";
import CustomInput from "@/components/form/CustomInput";
import { AdminCategoriesFormDialog } from "../_components/AdminCategoriesFormDialog";
import { AdminCategoriesCardListView } from "../_components/AdminCategoriesCard";
import { useCrudResource } from "@/hooks/useCrudResource";

export default function PhotoVideoCategoryList() {
  const { photoVideoCategories: photoVideoCategoryData, isPending } =
    useAppSelector((state) => state.photoVideoCategories);
  const [editId, setEditId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const currentCategory = photoVideoCategoryData.find((p) => p.id === editId);

  const {
    createResource,
    updateResource,
    deleteResource,
    fetchResource,
    validationError,
    clearValidationError,
  } = useCrudResource({
    resourceName: "photo video category",
    dupkeyName: "name",
    onSuccess: () => {
      setEditId(null);
      setIsFormOpen(false);
    },
  });

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;

    await createResource(createPhotoVideoCategory, name);
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const id = formData.get("id") as string;

    await updateResource(updatePhotoVideoCategory, { id: Number(id), name });
  };

  const deleteCategory = async (id: number) => {
    await deleteResource(deletePhotoVideoCategory, id);
  };

  useEffect(() => {
    if (photoVideoCategoryData.length <= 0) {
      fetchResource(() => fetchPhotoVideoCategories(), []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ListViewWrapper
      title="Category"
      hasAdd
      onAdd={() => setIsFormOpen(true)}
      isLoading={isPending}
      isEmpty={photoVideoCategoryData.length <= 0 && !isFormOpen}
    >
      {photoVideoCategoryData.map((category) => (
        <AdminCategoriesCardListView
          key={category.id}
          name={category.name}
          handleEdit={() => {
            setEditId(category.id);
            setIsFormOpen(true);
          }}
          handleDelete={() => {
            deleteCategory(category.id);
          }}
        />
      ))}

      <AdminCategoriesFormDialog
        open={isFormOpen}
        setOpen={setIsFormOpen}
        title={"Category"}
        isEdit={editId !== null}
        handleSubmit={(e) => {
          if (editId !== null) {
            handleUpdateCategory(e);
          } else {
            handleCreateCategory(e);
          }
        }}
        isLoading={isPending}
        data={currentCategory}
        handleCancel={() => {
          clearValidationError();
          setIsFormOpen(false);
          setEditId(null);
        }}
      >
        <CustomInput
          name="name"
          label="Photo Video category"
          defaultValue={currentCategory?.name}
          placeholder="Eg. Live, Concert, Nature"
          required
          error={validationError["name"]}
        />
      </AdminCategoriesFormDialog>
    </ListViewWrapper>
  );
}
