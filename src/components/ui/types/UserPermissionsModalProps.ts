import type { User } from "../../../services/Types/User";
export interface UserPermissionsModalProps {
  fileId: string;
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  users: User[];
  onAddUser: (userId: string) => void;
  onRemoveUser: (userId: string) => void;
  onGenerateReport: () => void;
}
