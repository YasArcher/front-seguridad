import { useState } from 'react';
import { logoutService } from '../services/authService';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });

  const login = (token: string) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await logoutService(token);
      } catch (e) {
        console.warn('Error al cerrar sesión en backend:', e);
        // Aquí puedes manejar un toast o notificación si lo deseas
      }
    }

    // Limpiar sesión en frontend de todas formas
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
};
