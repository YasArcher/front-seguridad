import { useState, useEffect } from "react";
import {
  getFilesService,
  deleteFileService,
  downloadFileService,
} from "../services/fileService";
import type { FileCardProps } from "../components/ui/types/FileCardProps";
import { useAuth } from "../Context/AuthContext";

type ActionType = "basic" | "full";

export const useFiles = (
  actionType: ActionType = "basic",
  onUserPermissionsAction?: (file: FileCardProps) => void
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
      const fetchedFiles = await getFilesService(token, 1, 50, actionType, logout);

      const filteredFiles = actionType === "full"
        ? fetchedFiles.filter((file) => file.accessType === "own")
        : fetchedFiles;

      const filesWithActions = filteredFiles.map((file) => {
        const handleDownload = async () => {
          try {
            const blob = await downloadFileService(String(file.id), token, logout);
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

        if (actionType === "full" && onUserPermissionsAction) {
          return {
            ...file,
            onDownload: handleDownload,
            onViewKey: () => console.log(`Visualizando ${file.title}`),
            onDelete: async () => {
              try {
                await deleteFileService(String(file.id), token, logout);
                fetchFiles(); // ✅ Vuelve a cargar la lista después de borrar
              } catch (e: any) {
                setError(`Error al eliminar el archivo: ${e.message}`);
              }
            },
            onUserPermissions: () => onUserPermissionsAction(file),
          };
        }

        return {
          ...file,
          onDownload: handleDownload,
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
