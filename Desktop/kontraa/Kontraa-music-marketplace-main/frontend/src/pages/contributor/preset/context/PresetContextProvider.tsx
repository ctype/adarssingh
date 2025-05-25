import { useState } from "react";
import { Outlet } from "react-router-dom";

import { PresetContext } from "./PresetContext";
import { initialPresetFieldsData } from "../utils/presetOptions";
import { CollaboratorContextProvider } from "../../context/CollaboratorContextProvider";
import { LicenseContextProvider } from "../../context/LicenseContextProvider";

export function PresetContextProvider() {
  const [presetData, setPresetData] = useState<PresetCreateUpdateFields>(
    initialPresetFieldsData
  );

  return (
    <PresetContext.Provider value={{ presetData, setPresetData }}>
      <CollaboratorContextProvider>
        <LicenseContextProvider>
          <Outlet />
        </LicenseContextProvider>
      </CollaboratorContextProvider>
    </PresetContext.Provider>
  );
}
