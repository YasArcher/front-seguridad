
const API_URL = 'httpS://localhost';
import { customFetch } from "./customFetch";
export const loginService = async (email: string, password: string, logout?: () => void) => {
  const response = await customFetch(`${API_URL}/auth/two-factor/request-2fa`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }, logout);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error);
  }

  return response.json();
};


interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export const registerUser = async (data: RegisterData, logout?: () => void) => {
  const response = await customFetch(
    `${API_URL}/register`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    },
    logout
  );

  const responseBody = await response.json();

  if (!response.ok) {
    const errorMessage = responseBody.detail || responseBody.error;
    throw new Error(errorMessage);
  }

  return responseBody;
};


export const logoutService = async (token: string, logout?: () => void) => {
  const response = await customFetch(`${API_URL}/auth/two-factor/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  }, logout);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error);
  }

  return response.json();
};

export const getFileActionsAuditService = async (
  fileId: number | string,
  token: string,
  logout?: () => void
) => {
  const response = await customFetch(`${API_URL}/audit/file-actions?file_id=${fileId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }, logout);

  const responseBody = await response.json();

  return {
    status: response.status,
    data: responseBody,
  };
};