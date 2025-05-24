import { useState, useEffect } from "react";
import { getFilePermissionsByUsers } from "../services/userService";
import { useAuth } from "../Context/AuthContext";

interface UserPermission {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  permission_type: "view" | "download" | "both" | "none";
}

export const useFilePermissions = (fileId: string) => {
  const { token } = useAuth();
  const [users, setUsers] = useState<UserPermission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissions = async () => {
    if (!token) {
      setError("Sesión no válida.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getFilePermissionsByUsers(fileId, token);
      setUsers(data.users);
    } catch (err: any) {
      setError(err.message || "Error al cargar permisos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fileId) fetchPermissions();
  }, [fileId]);

  const searchUsers = (term: string) =>
    users.filter((user) =>
      `${user.first_name} ${user.last_name} ${user.email}`
        .toLowerCase()
        .includes(term.toLowerCase())
    );

  return {
    users,
    searchUsers,
    loading,
    error,
    refresh: fetchPermissions,
  };
};