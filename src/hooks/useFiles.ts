import { useState, useEffect } from "react";
import { getFilesService, deleteFileService } from "../services/fileService";
import type { FileCardProps } from "../components/ui/types/FileCardProps";
import { useAuth } from "../Context/AuthContext";
import { useAES } from "./useAES";
import { addPasswordToPdf } from "../utils/addPasswordToPdf";

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

      // Determinar qué endpoint usar:
      const endpoint =
        action === "download"
          ? `https://localhost/files/${file.id}`
          : `https://localhost/files/${file.id}/view`;

      const response = await fetch(endpoint, {
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
        // Leer la contraseña del header
        const protectionPassword =
          response.headers.get("X-File-Protection-Password") ||
          "defaultPassword";

        // Convertir Blob a Uint8Array
        const arrayBuffer = await decryptedBlob.arrayBuffer();
        const inputPdfBytes = new Uint8Array(arrayBuffer);

        // Aplicar la contraseña obtenida del header
        // const protectedPdfBytes = await addPasswordToPdf(
        //   inputPdfBytes,
        //   protectionPassword
        // );
        // const protectedBlob = new Blob([new Uint8Array(protectedPdfBytes)], {
        //  type: "application/pdf",
        // });

        // Crear el Blob protegido
        const protectedBlob = new Blob([inputPdfBytes], {
          type: "application/pdf",
        });

        // Descargar el PDF protegido
        const url = window.URL.createObjectURL(protectedBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${file.title}_protegido.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else if (action === "view" && onViewFile) {
        // En visualización no usas la protección, solo el PDF libre
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
