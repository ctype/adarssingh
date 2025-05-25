import { PropsWithChildren, useState } from "react";

import { LicenseContext } from "./LicenseContext";

export function LicenseContextProvider({ children }: PropsWithChildren) {
  const [licenses, setLicenses] = useState<License[]>([]);

  return (
    <LicenseContext.Provider
      value={{
        licenses,
        setLicenses,
      }}
    >
      {children}
    </LicenseContext.Provider>
  );
}
