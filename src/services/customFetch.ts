// customFetch.ts
export const customFetch = async (
  url: string,
  options: RequestInit,
  logout?: () => void
) => {
  try {
    const response = await fetch(url, options);

    if (response.status === 401 && logout) {
      logout(); // Cierre de sesión automático si el token es inválido
    }

    return response;
  } catch (error) {
    throw error;
  }
};
