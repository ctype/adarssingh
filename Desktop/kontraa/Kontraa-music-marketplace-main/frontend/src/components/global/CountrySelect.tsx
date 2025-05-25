import { useEffect, useState } from "react";
import { createListCollection } from "@chakra-ui/react";

import CustomSelect from "../form/CustomSelect";

type Country = {
  label: string;
  value: string;
};

const fetchCountries = async () => {
  const response = await fetch("https://restcountries.com/v3.1/all");
  if (!response.ok) {
    throw new Error("Failed to fetch countries");
  }

  const data = await response.json();
  return data.map((country: { name: { common: string }; cca2: string }) => ({
    label: country.name.common,
    value: country.cca2,
  }));
};

export default function CountrySelect() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [error, setError] = useState<string | null>(null);

  const countriesCollection = createListCollection({
    items: countries,
  });

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const data = await fetchCountries();
        setCountries(
          data.sort(
            (
              a: { label: string; value: string },
              b: { label: string; value: string }
            ) => a.label.localeCompare(b.label)
          )
        );
      } catch (err) {
        console.error(err);
        setError("Failed to load countries");
      }
    };

    loadCountries();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <CustomSelect
      label="Select a country"
      name="Country"
      options={countriesCollection}
      placeholder="Select a country"
    />
  );
}
