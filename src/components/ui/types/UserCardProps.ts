export interface UserCardProps {
  name: string;
  lastLogin: string;
  loginCount: string;
  lastDownload: string;
  onPermissionsChange?: (permissions: { state: boolean }) => void;
  avatarUrl?: string;
}
