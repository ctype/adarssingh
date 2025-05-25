import React, { useEffect, useState } from "react";

import ListViewWrapper from "@/wrappers/ListViewWrapper";
import { useAppDispatch, useAppSelector } from "@/app/store";
import CustomInput from "@/components/form/CustomInput";
import { AdminCategoriesCardListView } from "../_components/AdminCategoriesCard";
import { AdminCategoriesFormDialog } from "../_components/AdminCategoriesFormDialog";
import {
  createUpdateSocialAccountType,
  fetchSocialAccountTypes,
  removeSocialAccountType,
} from "@/features/socialMedia/socialMediaSlice";
// import CustomSelect from "@/components/form/CustomSelect";
// import { socialMediaIconList } from "@/utils/social_media_svg";

export default function SocialMediaList() {
  const dispatch = useAppDispatch();
  const { socialAccountTypes, isPending } = useAppSelector(
    (state) => state.socialMedias
  );
  const [editId, setEditId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const currentSocialMediaAccount = socialAccountTypes.find(
    (sat) => sat.id === editId
  );

  const handleCreateUpdateSocialAccountType = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const socialAccountTypeName = formData.get(
      "socialAccountTypeName"
    ) as string;
    const svgIndex = Number(formData.get("svgIndex") as string);

    dispatch(
      createUpdateSocialAccountType({
        socialAccountTypeName,
        svgIndex,
      })
    ).unwrap();
  };

  const deleteCategory = async (id: number) => {
    dispatch(removeSocialAccountType({ id })).unwrap();
  };

  useEffect(() => {
    dispatch(fetchSocialAccountTypes()).unwrap();
  }, [dispatch]);

  return (
    <ListViewWrapper
      title="Social Media Types"
      hasAdd
      onAdd={() => setIsFormOpen(true)}
      isLoading={isPending}
      isEmpty={socialAccountTypes.length <= 0 && !isFormOpen}
    >
      {socialAccountTypes.map((socialMediaAccount) => (
        <AdminCategoriesCardListView
          key={socialMediaAccount.id}
          name={socialMediaAccount.socialAccountTypeName}
          handleEdit={() => {
            setEditId(socialMediaAccount.id);
            setIsFormOpen(true);
          }}
          handleDelete={() => deleteCategory(socialMediaAccount.id)}
        />
      ))}

      <AdminCategoriesFormDialog
        open={isFormOpen}
        setOpen={setIsFormOpen}
        title={" Social Media Type"}
        isEdit={editId !== null}
        handleSubmit={(e) => {
          handleCreateUpdateSocialAccountType(e);
          setIsFormOpen(false);
        }}
        isLoading={isPending}
        data={currentSocialMediaAccount}
        handleCancel={() => {
          setIsFormOpen(false);
          setEditId(null);
        }}
      >
        <CustomInput
          name="name"
          label="Social Media Name"
          defaultValue={currentSocialMediaAccount?.socialAccountTypeName}
          placeholder="E.g: Pixabay, X, Facebook, etc"
          required
        />
        {/* <CustomSelect
          label="Icon"
          name="svgIndex"
          //  error={errors["photoVideoCategory"]}
          options={socialMediaIconList}
          placeholder="Select icon"
          defaultValue={currentSocialMediaAccount?.svgIndex.toString()}
        /> */}
      </AdminCategoriesFormDialog>
    </ListViewWrapper>
  );
}
