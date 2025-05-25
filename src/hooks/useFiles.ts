import { useState, useEffect } from "react";
import {
  getFilesService,
  deleteFileService,
  downloadFileService,
  viewFileService,
} from "../services/fileService";
import type { FileCardProps } from "../components/ui/types/FileCardProps";
import { useAuth } from "../Context/AuthContext";

type ActionType = "basic" | "full";

export const useFiles = (
  actionType: ActionType = "basic",
  onUserPermissionsAction?: (file: FileCardProps) => void,
  onViewFile?: (blob: Blob, file: FileCardProps, mimeType: string) => void
) => {
  const [files, setFiles] = useState<FileCardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { token, logout } = useAuth();

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
        const handleDownload = async () => {
          try {
            const blob = await downloadFileService(
              String(file.id),
              token,
              logout
            );
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = file.title;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
          } catch (e: any) {
            setError(`Error al descargar el archivo: ${e.message}`);
          }
        };

        const handleView = async () => {
          try {
            const response = await fetch(
              `https://localhost/files/${file.id}/view`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(
                errorData.error || "Error al obtener el archivo para ver."
              );
            }

            const mimeType = response.headers.get("Content-Type") || "";
            const blob = await response.blob();

            if (onViewFile) onViewFile(blob, file, mimeType);
          } catch (e: any) {
            setError(`Error al visualizar el archivo: ${e.message}`);
          }
        };

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
            onViewKey: handleView,
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

  return { files, searchFiles, loading, error, refresh: fetchFiles }; // 👈 Exportamos fetchFiles
};
