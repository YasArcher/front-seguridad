import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../Context/AuthContext';
import { getUserProfile } from '../services/userService';
import type { User } from '../services/Types/User';

export const useUserProfile = () => {
  const { token, logout } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchProfile = useCallback(async () => {
    try {
      if (!token) {
        setError("No hay token de sesión.");
        setProfile(null);
        return;
      }
      setLoading(true);
      setError(null);
      const data = await getUserProfile(token, logout);
      setProfile(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar el perfil.');
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, refetch: fetchProfile };
};