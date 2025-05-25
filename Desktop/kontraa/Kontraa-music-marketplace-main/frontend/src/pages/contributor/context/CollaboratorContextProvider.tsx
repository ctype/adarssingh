import { PropsWithChildren, useState } from "react";

import { CollaboratorContext } from "./CollaboratorContext";

export function CollaboratorContextProvider({ children }: PropsWithChildren) {
  const [collaborators, setCollaborators] = useState<
    CollaboratorCreateUpdateFields[]
  >([]);

  return (
    <CollaboratorContext.Provider
      value={{
        collaborators: collaborators,
        setCollaborators: setCollaborators,
      }}
    >
      {children}
    </CollaboratorContext.Provider>
  );
}
