import { useState } from "react";
import { updateUserProfileService } from "../services/userService";
import { useAuth } from "../Context/AuthContext";
import type { User } from "../services/Types/User";

type UpdateProfileData = Pick<User, "first_name" | "last_name" | "email">;

export const useUpdateUserProfile = () => {
  const { token, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (profileData: UpdateProfileData): Promise<boolean> => {
    if (!token) {
      setError("No hay sesión activa.");
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      await updateUserProfileService(profileData, token, logout);
      return true;
    } catch (err: any) {
      const message = err.message || "Error al actualizar el perfil. prueba";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, loading, error };
};
