import { createContext } from "react";
import { initialTrackFieldsData } from "../utils/trackOptions";

export const TrackContext = createContext<{
  trackData: TrackCreateUpdateFields;
  setTrackData: React.Dispatch<React.SetStateAction<TrackCreateUpdateFields>>;
}>({
  trackData: initialTrackFieldsData,
  setTrackData: () => {},
});
