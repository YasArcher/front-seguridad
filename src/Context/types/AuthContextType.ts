export interface AuthContextType {
  token: string | null;
  role: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
}