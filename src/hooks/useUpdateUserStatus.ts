import { useState } from "react";
import { updateUserStatusService } from "../services/userService";
import { useAuth } from "../Context/AuthContext";

export const useUpdateUserStatus = () => {
  const { token, logout } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUserStatus = async (
    id: number,
    isActive: boolean,
    role: string = "user",
    canUpload: boolean = true
  ): Promise<boolean> => {
    if (!token) {
      setError("Sesión no válida.");
      return false;
    }

    setIsUpdating(true);
    setError(null);

    try {
      await updateUserStatusService(
        { id, is_active: isActive, role, can_upload: canUpload, token },
        logout
      );
      return true;
    } catch (err: any) {
      const message = err.message || "Error al actualizar estado.";
      setError(message);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateUserStatus, isUpdating, error };
};
