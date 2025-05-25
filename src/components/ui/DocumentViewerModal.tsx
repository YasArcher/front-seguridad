import type { FC } from "react";
import Modal from "./Modal";

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName?: string;
  mimeType?: string;  // Nuevo: tipo MIME del archivo
}


const DocumentViewerModal: FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  fileUrl,
  fileName,
mimeType,
}) => {
const isPdf = mimeType === "application/pdf";
const isImage = mimeType?.startsWith("image/");


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={fileName || "Visualizar Documento"}
      size="lg"
    >
      {isPdf ? (
        <iframe
          src={fileUrl}
          title={fileName}
          className="w-full h-[70vh] border rounded"
        />
      ) : isImage ? (
        <img src={fileUrl} alt={fileName} className="w-full max-h-[70vh] object-contain" />
      ) : (
        <p className="text-center text-gray-500">
          Este tipo de archivo no es compatible para visualización directa.
        </p>
      )}
    </Modal>
  );
};

export default DocumentViewerModal;
