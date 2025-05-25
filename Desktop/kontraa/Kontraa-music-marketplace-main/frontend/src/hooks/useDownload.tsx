import { useNavigate } from "react-router-dom";

import { useAppSelector } from "@/app/store";
import { toaster } from "@/components/ui/toaster";

export const useDownload = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleDownload = async (
    key: string,
    fileName: string,
    fileType: FileType,
    type: DownloadType,
    entityName: string,
    entityId: number,
    licenseId: number | null = null
  ) => {
    if (!user) {
      toaster.create({
        type: "error",
        title: "Please login first",
        action: {
          label: "Login",
          onClick: () => navigate("/auth/login"),
        },
        description: "You need to login inorder to download it",
      });
      return;
    }
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/v1/download`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: key,
        fileName: fileName,
        type, // TODO: make dynamic
        fileType, // TODO: make dynamic
        entityId,
        entityName,
        licenseId,
      }),
    });
    const data = await res.json();

    if (data) {
      if (data.message) {
        toaster.create({
          type: "error",
          title: "Error downloading",
          description: data.message,
        });
        return;
      }
      if (data.signedUrl) {
        const link = document.createElement("a");
        link.href = data.signedUrl;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  const handleLicenseDownload = async (licenseId: number, type: FileType) => {
    if (!user) {
      toaster.create({
        type: "error",
        title: "Please login first",
        action: {
          label: "Login",
          onClick: () => navigate("/auth/login"),
        },
        description: "You need to login inorder to download it",
      });
      return;
    }

    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/v1/download-license`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          licenseId,
          type,
        }),
      }
    );
    const data = await res.arrayBuffer();
    const blob = new Blob([data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "license");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return { handleDownload, handleLicenseDownload };
};
