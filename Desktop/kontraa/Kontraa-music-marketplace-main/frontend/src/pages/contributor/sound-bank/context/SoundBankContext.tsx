import { createContext } from "react";
import { initialSoundBankFieldsData } from "../utils/soundBankOptions";

export const SoundBankContext = createContext<{
  soundBankData: SoundBankCreateUpdateFields;
  setSoundBankData: React.Dispatch<
    React.SetStateAction<SoundBankCreateUpdateFields>
  >;
}>({
  soundBankData: initialSoundBankFieldsData,
  setSoundBankData: () => {},
});
