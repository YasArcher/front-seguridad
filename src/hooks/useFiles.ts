import { useState, useEffect } from "react";
import { getFilesService, deleteFileService } from "../services/fileService";
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
  const { token, logout } = useAuth(); // 👈 Inyectamos logout

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
          if (actionType === "full" && onUserPermissionsAction) {
            return {
              ...file,
              onDownload: () => console.log(`Descargando ${file.title}`),
              onViewKey: () => console.log(`Visualizando ${file.title}`),
              onDelete: async () => {
                try {
                  await deleteFileService(String(file.id), token, logout);
                  toast.success("Archivo eliminado correctamente.");
                  fetchFiles(); // Recarga la lista de archivos tras eliminar
                } catch (e: any) {
                  toast.error(`Error: ${e.message}`);
                }
              },
              onUserPermissions: () => onUserPermissionsAction(file),
            };
          }

          return file;
        });

        setFiles(filesWithActions);
      } catch (err: any) {
        setError(err.message || "Error al cargar archivos.");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [actionType, token, onUserPermissionsAction, logout]); // 👈 Incluye logout en dependencias

  const searchFiles = (term: string): FileCardProps[] =>
    files.filter(
      (file) =>
        file.title.toLowerCase().includes(term.toLowerCase()) ||
        file.type.toLowerCase().includes(term.toLowerCase())
    );

  return { files, searchFiles, loading, error };
};