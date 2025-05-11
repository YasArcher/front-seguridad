export interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode; // Permite pasar cualquier icono externo (ej: react-icons)
}
