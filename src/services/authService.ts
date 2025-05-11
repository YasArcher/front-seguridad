
const API_URL = 'http://localhost:5000';

export const loginService = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/two-factor/request-2fa`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error en el inicio de sesión.');
  }

  return response.json(); // Aquí esperas que el backend te retorne el token y/o detalles del usuario
};


interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export const registerUser = async (data: RegisterData) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error en el registro');
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error.message);
  }
};
