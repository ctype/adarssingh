import { createContext } from "react";

export const CollaboratorContext = createContext<{
  collaborators: CollaboratorCreateUpdateFields[];
  setCollaborators: React.Dispatch<
    React.SetStateAction<CollaboratorCreateUpdateFields[]>
  >;
}>({
  collaborators: [],
  setCollaborators: () => {},
});
