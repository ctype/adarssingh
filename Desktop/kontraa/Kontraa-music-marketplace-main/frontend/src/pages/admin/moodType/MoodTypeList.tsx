import React, { useEffect, useState } from "react";

import ListViewWrapper from "@/wrappers/ListViewWrapper";
import { useAppSelector } from "@/app/store";
import {
  createMoodType,
  deleteMoodType,
  fetchMoodTypes,
  updateMoodType,
} from "@/features/moodType/moodTypeSlice";
import { AdminCategoriesFormDialog } from "../_components/AdminCategoriesFormDialog";
import CustomInput from "@/components/form/CustomInput";
import { AdminCategoriesCardListView } from "../_components/AdminCategoriesCard";
import { useCrudResource } from "@/hooks/useCrudResource";

export default function MoodTypeList() {
  const { moodTypes, isPending } = useAppSelector((state) => state.moodTypes);
  const [editId, setEditId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const currentMoodType = moodTypes.find((mt) => mt.id === editId);

  const {
    createResource,
    updateResource,
    deleteResource,
    fetchResource,
    validationError,
    clearValidationError,
  } = useCrudResource({
    resourceName: "mood type",
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

    await createResource(createMoodType, name);
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const id = formData.get("id") as string;

    await updateResource(updateMoodType, { id: Number(id), name });
  };

  const deleteCategory = async (id: number) => {
    await deleteResource(deleteMoodType, id);
  };

  useEffect(() => {
    if (moodTypes.length <= 0) {
      fetchResource(() => fetchMoodTypes(), []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ListViewWrapper
      title="Mood Type"
      hasAdd
      onAdd={() => setIsFormOpen(true)}
      isLoading={isPending}
      isEmpty={moodTypes.length <= 0 && !isFormOpen}
    >
      {moodTypes.map((moodType) => (
        <AdminCategoriesCardListView
          key={moodType.id}
          name={moodType.name}
          handleEdit={() => {
            setEditId(moodType.id);
            setIsFormOpen(true);
          }}
          handleDelete={() => {
            deleteCategory(moodType.id);
          }}
        />
      ))}

      <AdminCategoriesFormDialog
        open={isFormOpen}
        setOpen={setIsFormOpen}
        title={"Mood Type"}
        isEdit={editId !== null}
        handleSubmit={(e) => {
          if (editId !== null) {
            handleUpdateCategory(e);
          } else {
            handleCreateCategory(e);
          }
        }}
        isLoading={isPending}
        data={currentMoodType}
        handleCancel={() => {
          clearValidationError();
          setIsFormOpen(false);
          setEditId(null);
        }}
      >
        <CustomInput
          name="name"
          label="Mood Type"
          defaultValue={currentMoodType?.name}
          placeholder="Eg. Happy, Sad"
          required
          error={validationError["name"]}
        />
      </AdminCategoriesFormDialog>
    </ListViewWrapper>
  );
}
