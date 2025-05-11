export const mockUsers = [
    {
      id: "1",
      name: "Anita",
      description:
        "Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.",
      downloadCount: 24,
      lastDownload: "09/01/2024",
    },
    {
      id: "2",
      name: "Carlos",
      description:
        "Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.",
      downloadCount: 10,
      lastDownload: "24/03/2022",
    },
    {
      id: "3",
      name: "Maria",
      description:
        "Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very short story.",
      downloadCount: 15,
      lastDownload: "15/02/2024",
    },
  ];

const API_URL = 'http://localhost:5000';

export const getUserProfile = async (token: string) => {
  const response = await fetch(`${API_URL}/users/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('No se pudo obtener el perfil del usuario.');
  }

  return response.json();
};

export const getAllUsers = async (token: string) => {
  const response = await fetch(`${API_URL}/auth/admin/users`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('No se pudo obtener la lista de usuarios.');
  }

  const data = await response.json();
  return data.users; // Retorna directamente el array de usuarios
};

  