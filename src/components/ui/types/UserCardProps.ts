export interface UserCardProps {
  id: number;
  name: string;
  is_active: boolean;
  lastLogin: string;
  loginCount: string;
  lastDownload: string;
  onPermissionsChange?: (permissions: { state: boolean }) => void;
  avatarUrl?: string;
}