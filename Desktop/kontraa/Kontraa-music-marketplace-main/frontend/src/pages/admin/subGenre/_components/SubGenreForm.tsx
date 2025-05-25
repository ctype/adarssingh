import { useEffect } from "react";
import { createListCollection, Flex } from "@chakra-ui/react";

import CustomInput from "@/components/form/CustomInput";
import CustomSelect from "@/components/form/CustomSelect";
import { fetchGenres } from "@/features/genre/genreSlice";
import { useAppDispatch, useAppSelector } from "@/app/store";

interface ISubGenreFormDialogProps {
  data?: SubGenre;
  errors: { [key: string]: string } | null;
}

export function SubGenreForm(props: ISubGenreFormDialogProps) {
  const { data, errors } = props;
  const dispatch = useAppDispatch();
  const { genres } = useAppSelector((state) => state.genres);

  const genreOptions = createListCollection({
    items: genres.map((g) => ({
      label: g.name,
      value: g.id.toString(),
    })),
  });

  useEffect(() => {
    dispatch(fetchGenres()).unwrap();
  }, [dispatch]);

  return (
    <>
      <Flex gap={4} direction={"column"}>
        <CustomSelect
          name="genreId"
          label="Genre"
          placeholder="Select Genre"
          options={genreOptions}
          defaultValue={(data?.genreId as Genre)?.id.toString()}
          error={errors && errors["genreId"]}
          required
        />
        <CustomInput
          name="name"
          label="Sub Genre Name"
          defaultValue={data?.name}
          placeholder="Eg. Hip Hop, RnB."
          required
          error={errors && errors["name"]}
        />
      </Flex>
    </>
  );
}
