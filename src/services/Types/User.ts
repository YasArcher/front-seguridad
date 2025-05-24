export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role?: "admin" | "user";
  is_active?: boolean;
  can_upload?: boolean;

  // Solo cuando se obtiene desde la lista general
  created_at?: string;
  updated_at?: string | null;

  // Solo cuando se obtiene desde historial de descarga
  download_count?: number;
  last_download?: string;

  // Utilidad para mostrar nombre completo
  full_name?: string;

  // Solo para mostrar los permisos que tiene sobre un archivo
  permission_type?: "view" | "download" | "both" | "none";
}
