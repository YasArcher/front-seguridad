import { useState, useEffect } from "react";
import {
  getFilesService,
  deleteFileService,
} from "../services/fileService";
import type { FileCardProps } from "../components/ui/types/FileCardProps";
import { useAuth } from "../Context/AuthContext";
import { useAES } from "./useAES";

type ActionType = "basic" | "full";

export const useFiles = (
  actionType: ActionType = "basic",
  onUserPermissionsAction?: (file: FileCardProps) => void,
  onViewFile?: (blob: Blob, file: FileCardProps, mimeType: string) => void,
  onBeforeViewFile?: (file: FileCardProps) => void
) => {
  const [files, setFiles] = useState<FileCardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { token, logout } = useAuth();
  const { decrypt, error: errorAES } = useAES();

  // 🎯 Función modular para descargar o visualizar archivos
  const handleFileAction = async (
    file: FileCardProps,
    action: "download" | "view"
  ) => {
    try {
      if (!token) throw new Error("No hay sesión activa.");

      if (onBeforeViewFile && action === "view") onBeforeViewFile(file);

      const response = await fetch(`https://localhost/files/${file.id}/view`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Error al obtener el archivo.");
      }

      const mimeType = response.headers.get("Content-Type") || "";
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      const decryptedBytes = await decrypt(uint8Array);
      if (!decryptedBytes)
        throw new Error(errorAES || "Error al descifrar el archivo.");

      // 🎯 Creamos nuevo blob descifrado

      const decryptedBlob = new Blob([new Uint8Array(decryptedBytes)], {
        type: mimeType,
      });

      if (action === "download") {
        const url = window.URL.createObjectURL(decryptedBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = file.title;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else if (action === "view" && onViewFile) {
        onViewFile(decryptedBlob, file, mimeType);
      }
    } catch (e: any) {
      setError(e.message || "Error inesperado.");
    }
  };

  // 🎯 Función para obtener los archivos y generar sus acciones
  const fetchFiles = async () => {
    if (!token) {
      setError("No hay sesión activa.");
      return;
    }

    try {
      setLoading(true);
      const fetchedFiles = await getFilesService(
        token,
        1,
        50,
        actionType,
        logout
      );

      const filteredFiles =
        actionType === "full"
          ? fetchedFiles.filter((file) => file.accessType === "own")
          : fetchedFiles;

      const filesWithActions = filteredFiles.map((file) => {
        const handleDownload = () => handleFileAction(file, "download");
        const handleView = () => handleFileAction(file, "view");

        const handleDelete = async () => {
          try {
            await deleteFileService(String(file.id), token, logout);
            fetchFiles();
          } catch (e: any) {
            setError(`Error al eliminar el archivo: ${e.message}`);
          }
        };

        if (actionType === "full" && onUserPermissionsAction) {
          return {
            ...file,
            onDownload: handleDownload,
            onDelete: handleDelete,
            onUserPermissions: () => onUserPermissionsAction(file),
          };
        }

        return {
          ...file,
          onDownload: handleDownload,
          onViewKey: handleView,
        };
      });

      setFiles(filesWithActions);
    } catch (err: any) {
      setError(err.message || "Error al cargar archivos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [actionType, token, onUserPermissionsAction, logout]);

  const searchFiles = (term: string): FileCardProps[] =>
    files.filter(
      (file) =>
        file.title.toLowerCase().includes(term.toLowerCase()) ||
        file.type.toLowerCase().includes(term.toLowerCase())
    );

  return { files, searchFiles, loading, error, refresh: fetchFiles };
};
