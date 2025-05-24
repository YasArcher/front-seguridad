import { useState, useEffect } from "react";
import { getAllUsers } from "../services/userService";
import type { User } from "../services/Types/User";

export const useUsers = (token: string) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const apiUsers = await getAllUsers(token);
      setUsers(apiUsers);
    } catch (err) {
      setError("Error al cargar usuarios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  const searchUsers = (term: string) =>
    users.filter((user) =>
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(term.toLowerCase()) ||
      user.email.toLowerCase().includes(term.toLowerCase()) ||
      user.role?.toLowerCase().includes(term.toLowerCase())
    );

  return {
    users,
    searchUsers,
    loading,
    error,
    refetch: fetchUsers,
    setUsers,
  };
};