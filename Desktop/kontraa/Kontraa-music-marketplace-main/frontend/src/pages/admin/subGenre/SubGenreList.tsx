import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ListViewWrapper from "@/wrappers/ListViewWrapper";
import { useAppSelector } from "@/app/store";
import {
  deleteSubGenre,
  fetchSubGenres,
} from "@/features/subGenre/subGenreSlice";
import { AdminCategoriesCardListView } from "../_components/AdminCategoriesCard";
import { useCrudResource } from "@/hooks/useCrudResource";

export default function SubGenreList() {
  const navigate = useNavigate();
  const { fetchResource, deleteResource } = useCrudResource({
    resourceName: "sub genre",
  });
  const { subGenres, isPending } = useAppSelector((state) => state.subGenres);

  const deleteCategory = async (id: number) => {
    await deleteResource(deleteSubGenre, id);
  };

  useEffect(() => {
    if (subGenres.length <= 0) {
      fetchResource(() => fetchSubGenres(), []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ListViewWrapper
      title="Sub Genre"
      hasAdd
      isLoading={isPending}
      isEmpty={subGenres.length <= 0}
    >
      {subGenres.map((subGenre) => (
        <AdminCategoriesCardListView
          key={subGenre.id}
          name={subGenre.name}
          handleEdit={() => navigate(`edit/${subGenre.id}`)}
          handleDelete={() => {
            deleteCategory(subGenre.id);
          }}
        />
      ))}
    </ListViewWrapper>
  );
}
