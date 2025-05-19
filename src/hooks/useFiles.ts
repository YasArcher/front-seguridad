import { useState, useEffect } from "react";
import { getFilesService, deleteFileService, downloadFileService } from "../services/fileService";
import type { FileCardProps } from "../components/ui/types/FileCardProps";
import { useAuth } from "../Context/AuthContext";
import { toast } from "react-toastify";

type ActionType = "basic" | "full";

export const useFiles = (
  actionType: ActionType = "basic",
  onUserPermissionsAction?: (file: FileCardProps) => void
) => {
  const [files, setFiles] = useState<FileCardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { token, logout } = useAuth();

  useEffect(() => {
    const fetchFiles = async () => {
      if (!token) {
        setError("No hay sesión activa.");
        return;
      }

      try {
        setLoading(true);
        const fetchedFiles = await getFilesService(token, 1, 50, actionType, logout);

        const filesWithActions = fetchedFiles.map((file) => {
          const handleDownload = async () => {
            try {
              const blob = await downloadFileService(String(file.id), token, logout);
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = file.title; // Usa el nombre original del archivo
              document.body.appendChild(link);
              link.click();
              link.remove();
              window.URL.revokeObjectURL(url);
              toast.success(`Archivo "${file.title}" descargado.`);
            } catch (e: any) {
              toast.error(`Error al descargar: ${e.message}`);
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
                  toast.success("Archivo eliminado correctamente.");
                  fetchFiles(); // Recarga la lista tras eliminar
                } catch (e: any) {
                  toast.error(`Error: ${e.message}`);
                }
              },
              onUserPermissions: () => onUserPermissionsAction(file),
            };
          }

          return {
            ...file,
            onDownload: handleDownload, // ✅ Siempre disponible
          };
        });

        setFiles(filesWithActions);
      } catch (err: any) {
        setError(err.message || "Error al cargar archivos.");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [actionType, token, onUserPermissionsAction, logout]);

  const searchFiles = (term: string): FileCardProps[] =>
    files.filter(
      (file) =>
        file.title.toLowerCase().includes(term.toLowerCase()) ||
        file.type.toLowerCase().includes(term.toLowerCase())
    );

  return { files, searchFiles, loading, error };
};