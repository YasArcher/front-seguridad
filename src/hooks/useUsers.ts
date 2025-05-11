import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  description: string;
  lastLogin: string;
  downloadCount: string;
  lastDownload: string;
}

const mockUsers: User[] = [
  { id: "1", name: "Alexey", description: "Administrador", lastLogin: "09/01/2024", downloadCount: "10", lastDownload: "24/03/2022" },
  { id: "2", name: "Edy Brock", description: "Usuario", lastLogin: "09/01/2024", downloadCount: "5", lastDownload: "15/04/2024" },
  { id: "3", name: "Marlin", description: "Usuario", lastLogin: "09/01/2024", downloadCount: "2", lastDownload: "10/02/2024" },
];

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula API
        setUsers(mockUsers);
      } catch (err) {
        setError("Error al cargar usuarios.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const searchUsers = (term: string) => 
    users.filter((user) => 
      user.name.toLowerCase().includes(term.toLowerCase()) ||
      user.description.toLowerCase().includes(term.toLowerCase())
    );

  return { users, searchUsers, loading, error };
};
