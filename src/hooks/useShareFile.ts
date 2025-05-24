import { useState } from "react";
import {
  shareFileService,
  updateShareFileService,
} from "../services/fileService";
import { useAuth } from "../Context/AuthContext";

export const useShareFile = () => {
  const { token, logout } = useAuth();
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shareFile = async (
    fileId: string,
    targetUserId: number,
    permissionType: "download" | "view" | "both"
  ): Promise<boolean> => {
    if (!token) {
      setError("Sesión no válida.");
      return false;
    }

    setIsSharing(true);
    setError(null);

    try {
      // Intentar compartir
      await shareFileService({ fileId, token, targetUserId, permissionType }, logout);
      return true;
    } catch (err: any) {
      // Fallback: actualizar permisos si ya está compartido
      try {
        await updateShareFileService({ fileId, token, targetUserId, permissionType }, logout);
        return true;
      } catch (updateErr: any) {
        const message = updateErr.message || "Error al actualizar los permisos.";
        setError(message);
        return false;
      }
    } finally {
      setIsSharing(false);
    }
  };

  return { shareFile, isSharing, error };
};
