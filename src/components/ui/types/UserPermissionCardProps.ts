export interface UserPermissionCardProps {
  name: string;
  avatarUrl?: string;
  lastDownload?: string;
  downloadCount?: number;
  fileId: string;
  userId: number;
  // Callback para manejar cambios en los switches
  onPermissionChange?: (params: {
    permission: "view" | "download" | "both" | "none";
    state: boolean;
  }) => void;
  permission_type?: "download" | "view" | "both" | "none";
}
