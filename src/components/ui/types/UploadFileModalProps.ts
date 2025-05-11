export interface UploadFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, encryptionKey: string) => Promise<void>;
}
