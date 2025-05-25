import React, { useEffect, useState } from "react";

import ListViewWrapper from "@/wrappers/ListViewWrapper";
import { useAppSelector } from "@/app/store";
import {
  createKeys,
  deleteKey,
  fetchKeys,
  updateKey,
} from "@/features/key/keySlice";
import { AdminCategoriesFormDialog } from "../_components/AdminCategoriesFormDialog";
import { AdminCategoriesCardListView } from "../_components/AdminCategoriesCard";
import CustomInput from "@/components/form/CustomInput";
import { useCrudResource } from "@/hooks/useCrudResource";

export default function KeyList() {
  const { keys, isPending } = useAppSelector((state) => state.keys);
  const [editId, setEditId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const {
    createResource,
    updateResource,
    deleteResource,
    fetchResource,
    validationError,
    clearValidationError,
  } = useCrudResource({
    resourceName: "key",
    dupkeyName: "name",
    onSuccess: () => {
      setEditId(null);
      setIsFormOpen(false);
    },
  });

  const currentKey = keys.find((p) => p.id === editId);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;

    await createResource(createKeys, name);
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const id = formData.get("id") as string;

    await updateResource(updateKey, { id: Number(id), name });
  };

  const deleteCategory = async (id: number) => {
    await deleteResource(deleteKey, id);
  };

  useEffect(() => {
    if (keys.length <= 0) {
      fetchResource(() => fetchKeys(), []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ListViewWrapper
      title="Key"
      hasAdd
      onAdd={() => setIsFormOpen(true)}
      isLoading={isPending}
      isEmpty={keys.length <= 0 && !isFormOpen}
    >
      {keys.map((key) => (
        <AdminCategoriesCardListView
          key={key.id}
          name={key.name}
          handleDelete={() => {
            deleteCategory(key.id);
          }}
          handleEdit={() => {
            setEditId(key.id);
            setIsFormOpen(true);
          }}
        />
      ))}

      <AdminCategoriesFormDialog
        open={isFormOpen}
        setOpen={setIsFormOpen}
        title={"Key"}
        isEdit={editId !== null}
        handleSubmit={(e) => {
          if (editId !== null) {
            handleUpdateCategory(e);
          } else {
            handleCreateCategory(e);
          }
        }}
        isLoading={isPending}
        data={currentKey}
        handleCancel={() => {
          clearValidationError();
          setIsFormOpen(false);
          setEditId(null);
        }}
      >
        <CustomInput
          name="name"
          label="Key Name"
          defaultValue={currentKey?.name}
          placeholder="Eg. CM, cm, Em."
          required
          error={validationError["name"]}
        />
      </AdminCategoriesFormDialog>
    </ListViewWrapper>
  );
}
