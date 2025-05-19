import { useState, useEffect } from "react";
import { getAllUsers } from "../services/userService";

interface User {
  id: string;
  name: string;
  description: string;
  lastLogin: string;
  downloadCount: string;
  lastDownload: string;
  is_active?: boolean;
}

export const useUsers = (token: string) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const apiUsers = await getAllUsers(token);
        const transformedUsers = apiUsers.map((user: any) => ({
          id: user.id.toString(),
          name: `${user.first_name} ${user.last_name}`,
          description: user.role === 'admin' ? 'Administrador' : 'Usuario',
          lastLogin: new Date(user.created_at).toLocaleDateString(),
          downloadCount: "0", // No viene en la API, puedes ajustarlo si luego se incluye
          lastDownload: "-",  // Tampoco viene en la API, ajusta si es necesario
        }));

        setUsers(transformedUsers);
      } catch (err) {
        setError("Error al cargar usuarios.");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchUsers();
  }, [token]);

  const searchUsers = (term: string) => 
    users.filter((user) => 
      user.name.toLowerCase().includes(term.toLowerCase()) ||
      user.description.toLowerCase().includes(term.toLowerCase())
    );

  return { users, searchUsers, loading, error };
};
