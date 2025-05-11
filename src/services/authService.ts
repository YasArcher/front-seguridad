const API_URL = 'http://localhost:5000';

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
