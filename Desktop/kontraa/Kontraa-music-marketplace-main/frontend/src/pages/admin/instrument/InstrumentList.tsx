import React, { useEffect, useState } from "react";

import ListViewWrapper from "@/wrappers/ListViewWrapper";
import { useAppSelector } from "@/app/store";
import {
  createInstrument,
  deleteInstrument,
  fetchInstruments,
  updateInstrument,
} from "@/features/instrument/instrumentSlice";
import { AdminCategoriesCardListView } from "../_components/AdminCategoriesCard";
import { AdminCategoriesFormDialog } from "../_components/AdminCategoriesFormDialog";
import CustomInput from "@/components/form/CustomInput";
import { useCrudResource } from "@/hooks/useCrudResource";

export default function InstrumentList() {
  const { instruments, isPending } = useAppSelector(
    (state) => state.instruments
  );
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
    resourceName: "instrument",
    dupkeyName: "name",
    onSuccess: () => {
      setEditId(null);
      setIsFormOpen(false);
    },
  });

  const currentInstrument = instruments.find((i) => i.id === editId);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;

    await createResource(createInstrument, name);
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const id = formData.get("id") as string;

    await updateResource(updateInstrument, { id: Number(id), name });
  };

  const deleteCategory = async (id: number) => {
    await deleteResource(deleteInstrument, id);
  };

  useEffect(() => {
    if (instruments.length <= 0) {
      fetchResource(() => fetchInstruments(), []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ListViewWrapper
      title="Instrument"
      hasAdd
      onAdd={() => setIsFormOpen(true)}
      isLoading={isPending}
      isEmpty={instruments.length <= 0 && !isFormOpen}
    >
      {instruments.map((instrument) => (
        <AdminCategoriesCardListView
          key={instrument.id}
          name={instrument.name}
          handleEdit={() => {
            setEditId(instrument.id);
            setIsFormOpen(true);
          }}
          handleDelete={() => deleteCategory(instrument.id)}
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
        data={currentInstrument}
        handleCancel={() => {
          clearValidationError();
          setIsFormOpen(false);
          setEditId(null);
        }}
      >
        <CustomInput
          name="name"
          label="Instrument Name"
          defaultValue={currentInstrument?.name}
          placeholder="Eg. Piano, guitar, etc"
          required
          error={validationError["name"]}
        />
      </AdminCategoriesFormDialog>
    </ListViewWrapper>
  );
}
