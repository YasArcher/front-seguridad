export interface User {
  id: string;
  name: string;
  description: string;
  downloadCount?: number;
  lastDownload?: string;
}

export interface UserPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  users: User[];
  onAddUser: (userId: string) => void;
  onRemoveUser: (userId: string) => void;
  onGenerateReport: () => void;
}
