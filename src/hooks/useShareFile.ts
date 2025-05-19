import { useState } from "react";
import { shareFileService } from "../services/fileService";
import { useAuth } from "../Context/AuthContext";
import { toast } from "react-toastify";

export const useShareFile = () => {
  const { token, logout } = useAuth(); // 👈 Inyectamos logout
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shareFile = async (
    fileId: string,
    targetUserId: number,
    permissionType: "download" | "view" | "both"
  ): Promise<boolean> => {
    if (!token) {
      setError("Sesión no válida.");
      toast.error("Sesión expirada. Inicia sesión nuevamente.");
      return false;
    }

    setIsSharing(true);
    setError(null);

    try {
      await shareFileService({
        fileId,
        token,
        targetUserId,
        permissionType,
      }, logout);
      toast.success("Archivo compartido exitosamente.");
      return true;
    } catch (err: any) {
      const message = err.message || "Error al compartir el archivo.";
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setIsSharing(false);
    }
  };

  return { shareFile, isSharing, error };
};
