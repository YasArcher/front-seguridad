import { createContext, useContext, useState} from 'react';
import type {  ReactNode } from 'react';

// 1. Definir el tipo de Usuario
type User = {
  name: string;
  email: string;
};

// 2. Definir la Interfaz del Contexto
interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

// 3. Crear el Contexto con valores iniciales
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. Proveedor del Contexto
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (user: User) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 5. Hook personalizado para acceder al contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
