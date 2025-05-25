import React, { useEffect, useState } from "react";

import ListViewWrapper from "@/wrappers/ListViewWrapper";
import { useAppSelector } from "@/app/store";
import {
  createLanguage,
  deleteLanguage,
  fetchLanguages,
  updateLanguage,
} from "@/features/language/languageSlice";
import CustomInput from "@/components/form/CustomInput";
import { AdminCategoriesCardListView } from "../_components/AdminCategoriesCard";
import { AdminCategoriesFormDialog } from "../_components/AdminCategoriesFormDialog";
import { useCrudResource } from "@/hooks/useCrudResource";

export default function LanguageList() {
  const { languages, isPending } = useAppSelector((state) => state.languages);
  const [editId, setEditId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const currentLanguage = languages.find((l) => l.id === editId);

  const {
    createResource,
    updateResource,
    deleteResource,
    fetchResource,
    validationError,
    clearValidationError,
  } = useCrudResource({
    resourceName: "language",
    onSuccess: () => {
      setEditId(null);
      setIsFormOpen(false);
    },
  });

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;

    await createResource(createLanguage, name);
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const id = formData.get("id") as string;

    await updateResource(updateLanguage, { id: Number(id), name });
  };

  const deleteCategory = async (id: number) => {
    await deleteResource(deleteLanguage, id);
  };

  useEffect(() => {
    if (languages.length <= 0) {
      fetchResource(() => fetchLanguages(), []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ListViewWrapper
      title="Language"
      hasAdd
      onAdd={() => setIsFormOpen(true)}
      isLoading={isPending}
      isEmpty={languages.length <= 0 && !isFormOpen}
    >
      {languages.map((language) => (
        <AdminCategoriesCardListView
          key={language.id}
          handleEdit={() => {
            setEditId(language.id);
            setIsFormOpen(true);
          }}
          handleDelete={() => {
            deleteCategory(language.id);
          }}
          name={language.name}
        />
      ))}

      <AdminCategoriesFormDialog
        open={isFormOpen}
        setOpen={setIsFormOpen}
        title={"Language"}
        isEdit={editId !== null}
        handleSubmit={(e) => {
          if (editId !== null) {
            handleUpdateCategory(e);
          } else {
            handleCreateCategory(e);
          }
        }}
        isLoading={isPending}
        data={currentLanguage}
        handleCancel={() => {
          clearValidationError();
          setIsFormOpen(false);
          setEditId(null);
        }}
      >
        <CustomInput
          name="name"
          label="Language"
          defaultValue={currentLanguage?.name}
          placeholder="Eg. English, Nepali"
          required
          error={validationError["name"]}
        />
      </AdminCategoriesFormDialog>
    </ListViewWrapper>
  );
}
