export interface UserPermissionCardProps {
  name: string;
  avatarUrl?: string;
  lastDownload?: string;
  downloadCount?: number;
  onPermissionChange?: (change: { permission: "view" | "download" | "both"; state: boolean }) => void;
}
