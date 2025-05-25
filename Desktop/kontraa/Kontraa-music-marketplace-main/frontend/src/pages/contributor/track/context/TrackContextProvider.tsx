import { useState } from "react";
import { Outlet } from "react-router-dom";

import { TrackContext } from "./TrackContext";
import { initialTrackFieldsData } from "../utils/trackOptions";
import { CollaboratorContextProvider } from "../../context/CollaboratorContextProvider";
import { LicenseContextProvider } from "../../context/LicenseContextProvider";

export function TrackContextProvider() {
  const [trackData, setTrackData] = useState<TrackCreateUpdateFields>(
    initialTrackFieldsData
  );

  return (
    <TrackContext.Provider value={{ trackData, setTrackData }}>
      <CollaboratorContextProvider>
        <LicenseContextProvider>
          <Outlet />
        </LicenseContextProvider>
      </CollaboratorContextProvider>
    </TrackContext.Provider>
  );
}
