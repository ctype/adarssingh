import { createContext } from "react";
import { initialPresetFieldsData } from "../utils/presetOptions";

export const PresetContext = createContext<{
  presetData: PresetCreateUpdateFields;
  setPresetData: React.Dispatch<React.SetStateAction<PresetCreateUpdateFields>>;
}>({
  presetData: initialPresetFieldsData,
  setPresetData: () => {},
});
