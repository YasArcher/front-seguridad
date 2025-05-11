export interface UserCardProps {
  name: string;
  description: string;
  lastLogin: string;
  downloadCount: string;
  lastDownload: string;
  onRemovePermission?: () => void;
}
