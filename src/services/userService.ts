const API_URL = "http://localhost:5000";
import { customFetch } from "./customFetch";

// Interfaces
interface UpdateUserStatusParams {
  id: number;
  is_active: boolean;
  token: string;
}

// Servicios

export const getUserProfile = async (token: string, logout?: () => void) => {
  const response = await customFetch(`${API_URL}/users/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }, logout);

  if (!response.ok) {
    throw new Error("No se pudo obtener el perfil del usuario.");
  }

  return response.json();
};

export const getAllUsers = async (token: string, logout?: () => void) => {
  const response = await customFetch(`${API_URL}/auth/admin/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }, logout);

  if (!response.ok) {
    throw new Error("No se pudo obtener la lista de usuarios.");
  }

  const data = await response.json();
  return data.users;
};

export const updateUserStatusService = async (
  { id, is_active, token }: UpdateUserStatusParams,
  logout?: () => void
): Promise<void> => {
  const response = await customFetch(`${API_URL}/auth/admin/update-user`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, is_active }),
  }, logout);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al actualizar el estado del usuario.");
  }
};