import React, { useEffect, useState } from "react";

import ListViewWrapper from "@/wrappers/ListViewWrapper";
import { useAppSelector } from "@/app/store";
import {
  createPresetType,
  deletePresetType,
  fetchPresetTypes,
  updatePresetType,
} from "@/features/preset/presetTypeSlice";
import CustomInput from "@/components/form/CustomInput";
import { AdminCategoriesCardListView } from "../_components/AdminCategoriesCard";
import { AdminCategoriesFormDialog } from "../_components/AdminCategoriesFormDialog";
import { useCrudResource } from "@/hooks/useCrudResource";

export default function PresetTypeList() {
  const { presetTypes, isPending } = useAppSelector(
    (state) => state.presetTypes
  );
  const [editId, setEditId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const currentPreset = presetTypes.find((p) => p.id === editId);

  const {
    createResource,
    updateResource,
    deleteResource,
    fetchResource,
    validationError,
    clearValidationError,
  } = useCrudResource({
    resourceName: "preset type",
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

    await createResource(createPresetType, name);
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const id = formData.get("id") as string;

    await updateResource(updatePresetType, { id: Number(id), name });
  };

  const deleteCategory = async (id: number) => {
    await deleteResource(deletePresetType, id);
  };

  useEffect(() => {
    if (presetTypes.length <= 0) {
      fetchResource(() => fetchPresetTypes(), []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ListViewWrapper
      title="Preset Type"
      hasAdd
      onAdd={() => setIsFormOpen(true)}
      isLoading={isPending}
      isEmpty={presetTypes.length <= 0 && !isFormOpen}
    >
      {presetTypes.map((presetType) => (
        <AdminCategoriesCardListView
          key={presetType.id}
          name={presetType.name}
          handleEdit={() => {
            setEditId(presetType.id);
            setIsFormOpen(true);
          }}
          handleDelete={() => {
            deleteCategory(presetType.id);
          }}
        />
      ))}

      <AdminCategoriesFormDialog
        open={isFormOpen}
        setOpen={setIsFormOpen}
        title={"Genre"}
        isEdit={editId !== null}
        handleSubmit={(e) => {
          if (editId !== null) {
            handleUpdateCategory(e);
          } else {
            handleCreateCategory(e);
          }
        }}
        isLoading={isPending}
        data={currentPreset}
        handleCancel={() => {
          clearValidationError();
          setIsFormOpen(false);
          setEditId(null);
        }}
      >
        <CustomInput
          name="name"
          label="Preset Type"
          defaultValue={currentPreset?.name}
          placeholder="Add preset type"
          required
          error={validationError["name"]}
        />
      </AdminCategoriesFormDialog>
    </ListViewWrapper>
  );
}
