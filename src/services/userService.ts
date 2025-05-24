const API_URL = "http://localhost:5000";
import { customFetch } from "./customFetch";
import type { User } from "./Types/User";
// Interfaces
interface UpdateUserStatusParams {
  id: number;
  is_active: boolean;
  token: string;
  role?: string;
  can_upload?: boolean;
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

  const data = await response.json();

  if (!response.ok) {
    console.error("Error en la respuesta del servidor:", data);
    throw new Error(data.error || "Error desconocido al obtener el perfil.");
  }

  return data;
};


export const getAllUsers = async (token: string, logout?: () => void) => {
  const response = await customFetch(`${API_URL}/auth/admin/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }, logout);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "No se pudo obtener la lista de usuarios.");
  }

  return data.users;
};

export const updateUserStatusService = async (
  { id, is_active, token }: UpdateUserStatusParams,
  logout?: () => void
): Promise<void> => {
  const response = await customFetch(`${API_URL}/auth/admin/update-user`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, is_active, role: "user", can_upload: true })
  }, logout);

  const data = await response.json();

  if (!response.ok) {
    console.error("Error en la respuesta del servidor:", data);
    throw new Error(data.error || "Error al actualizar el estado del usuario.");
  }
};


interface FileUserPermission {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  permission_type: "download" | "view" | "both" | "none";
}

interface FilePermissionResponse {
  file_id: number;
  users: FileUserPermission[];
}

export const getFilePermissionsByUsers = async (
  fileId: string,
  token: string
): Promise<FilePermissionResponse> => {
  const response = await fetch(`http://localhost:5000/files/${fileId}/permissions/users`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al obtener los permisos del archivo.");
  }

  return data;
};

export const updateUserProfileService = async (
  { email, first_name, last_name }: { email: string; first_name: string; last_name: string },
  token: string,
  logout?: () => void
): Promise<void> => {
  const response = await customFetch(`${API_URL}/users/profile`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, first_name, last_name }),
  }, logout);

  const data = await response.json();
  
  if (!response.ok) {
    console.error("Error en la respuesta del servidor:", data);
    throw new Error(data.error || "Error al actualizar el perfil.");
  }
};