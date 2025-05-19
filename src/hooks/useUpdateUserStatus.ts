import { useState } from "react";
import { updateUserStatusService } from "../services/userService";
import { useAuth } from "../Context/AuthContext";
import { toast } from "react-toastify";

export const useUpdateUserStatus = () => {
  const { token, logout } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUserStatus = async (id: number, isActive: boolean): Promise<boolean> => {
    if (!token) {
      setError("Sesión no válida.");
      toast.error("Sesión expirada. Inicia sesión nuevamente.");
      return false;
    }

    setIsUpdating(true);
    setError(null);

    try {
      await updateUserStatusService({ id, is_active: isActive, token }, logout);
      toast.success(`Usuario ${isActive ? "activado" : "desactivado"} correctamente.`);
      return true;
    } catch (err: any) {
      const message = err.message || "Error al actualizar estado.";
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateUserStatus, isUpdating, error };
};
