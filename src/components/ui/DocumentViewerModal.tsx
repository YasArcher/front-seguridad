import type { FC } from "react";
import Modal from "./Modal";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName?: string;
  mimeType?: string;
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
      <div className="w-full h-[70vh]">
        {isPdf ? (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer fileUrl={fileUrl} />
          </Worker>
        ) : isImage ? (
          <img
            src={fileUrl}
            alt={fileName}
            className="w-full max-h-[70vh] object-contain pointer-events-none select-none"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
          />
        ) : (
          <p className="text-center text-gray-500">
            Este tipo de archivo no es compatible para visualización directa.
          </p>
        )}
      </div>
    </Modal>
  );
};

export default DocumentViewerModal;
