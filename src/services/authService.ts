export const loginService = async (email: string, password: string) => {
  const response = await fetch('http://localhost:5000/auth/two-factor/request-2fa', {
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
