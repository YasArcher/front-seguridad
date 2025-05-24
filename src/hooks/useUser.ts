import { useState, useEffect } from "react";
import { getUserProfile } from "../services/userService";
import { useAuth } from "../Context/AuthContext";
import type { User } from "../services/Types/User";

export const useUserProfile = () => {
  const { token, logout } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!token) {
      setError("No hay sesión activa.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getUserProfile(token, logout);
      setProfile(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar el perfil.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  return { profile, loading, error, refetch: fetchProfile };
};
