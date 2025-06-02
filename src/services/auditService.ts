// src/services/auditService.ts
import { customFetch } from "./customFetch";

const API_URL = "http://localhost:5000/audit/";

interface PermissionResponse {
  logs: string[];
  data: {
    id: number;
    file_id: number;
    granted_user_id: number;
    email: string;
    permission_type: string;
    granted_at: string;
  }[];
}

interface SessionsResponse {
  logs: string[];
  data: {
    id: string;
    user_id: number;
    email: string;
    ip_address: string;
    user_agent: string;
    created_at: string;
    last_activity_at: string;
  }[];
}

interface FilesResponse {
  logs: string[];
  data: {
    id: number;
    user_id: number;
    email: string;
    file_name: string;
    created_at: string;
  }[];
}

interface LoginsResponse {
  logs: string[];
  data: {
    id: number;
    email: string;
    attempt_time: string;
  }[];
}

// 📌 Get User Permissions
export const getUserPermissionsService = async (
  userId: number,
  token: string,
  logout?: () => void
): Promise<PermissionResponse> => {
  const response = await customFetch(`${API_URL}permissions?user_id=${userId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  }, logout);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error);
  }

  return response.json();
};

// 📌 Get Active Sessions
export const getUserSessionsService = async (
  userId: number,
  token: string,
  logout?: () => void
): Promise<SessionsResponse> => {
  const response = await customFetch(`${API_URL}sessions?user_id=${userId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  }, logout);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error);
  }

  return response.json();
};

// 📌 Get Uploaded Files
export const getUserFilesService = async (
  userId: number,
  token: string,
  logout?: () => void
): Promise<FilesResponse> => {
  const response = await customFetch(`${API_URL}files?user_id=${userId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  }, logout);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error);
  }

  return response.json();
};

// 📌 Get Login Attempts
export const getUserLoginAttemptsService = async (
  email: string,
  token: string,
  logout?: () => void
): Promise<LoginsResponse> => {
  const response = await customFetch(`${API_URL}logins?email=${email}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  }, logout);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error);
  }

  return response.json();
};

// 📥 Get User Download History
export const getUserDownloadsService = async (
  userId: number,
  token: string,
  logout?: () => void
): Promise<{
  logs: string[];
  data: {
    id: number;
    user_id: number;
    email: string;
    file_id: number;
    download_time: string;
    ip_address: string;
    user_agent: string;
  }[];
}> => {
  const response = await customFetch(`http://localhost:5000/audit/downloads?user_id=${userId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  }, logout);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error);
  }

  return response.json();
};
