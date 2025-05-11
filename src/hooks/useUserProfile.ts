import { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import { getUserProfile } from '../services/userService';

interface UserProfile {
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  can_upload: boolean;
}

export const useUserProfile = () => {
  const { token } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!token) return;
        const data = await getUserProfile(token);
        setProfile(data);
      } catch (err) {
        setError('Error al cargar el perfil.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  return { profile, loading, error };
};
