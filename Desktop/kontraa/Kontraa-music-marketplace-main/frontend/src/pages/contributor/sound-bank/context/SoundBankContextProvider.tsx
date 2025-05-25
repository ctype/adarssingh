import { useState } from "react";
import { Outlet } from "react-router-dom";

import { SoundBankContext } from "./SoundBankContext";
import { initialSoundBankFieldsData } from "../utils/soundBankOptions";
import { CollaboratorContextProvider } from "../../context/CollaboratorContextProvider";
import { LicenseContextProvider } from "../../context/LicenseContextProvider";

export function SoundBankContextProvider() {
  const [soundBankData, setSoundBankData] =
    useState<SoundBankCreateUpdateFields>(initialSoundBankFieldsData);

  return (
    <SoundBankContext.Provider value={{ soundBankData, setSoundBankData }}>
      <CollaboratorContextProvider>
        <LicenseContextProvider>
          <Outlet />
        </LicenseContextProvider>
      </CollaboratorContextProvider>
    </SoundBankContext.Provider>
  );
}
