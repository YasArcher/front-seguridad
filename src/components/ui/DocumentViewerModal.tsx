import type { FC } from "react";
import { useEffect, useRef } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const isPdf = mimeType === "application/pdf";
  const isImage = mimeType?.startsWith("image/");

useEffect(() => {
  if (!isOpen) return;

  // Crear overlay para oscurecer la pantalla si la pestaña pierde el foco
  const overlay = document.createElement("div");
  overlay.id = "blur-overlay";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.85)";
  overlay.style.zIndex = "9999";
  overlay.style.display = "none";
  overlay.style.color = "white";
  overlay.style.fontSize = "1.8rem";
  overlay.style.fontWeight = "bold";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.textAlign = "center";
  overlay.style.pointerEvents = "none";
  overlay.style.display = "none";
  overlay.style.transition = "opacity 0.3s ease";
  overlay.innerText = "Contenido oculto mientras la pestaña está en segundo plano";

  document.body.appendChild(overlay);

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && ["p", "s", "u"].includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
      alert("Esta acción está deshabilitada para este documento");
      return false;
    }
    if (e.key === "PrintScreen" || e.key === "F12") {
      e.preventDefault();
      e.stopPropagation();
      alert("Esta acción está deshabilitada");
      return false;
    }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "I") {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
  };

  const handleSelectStart = (e: Event) => {
    e.preventDefault();
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      overlay.style.display = "flex";
    } else {
      overlay.style.display = "none";
    }
  };

  const detectDevTools = () => {
    const threshold = 160;
    if (
      window.outerHeight - window.innerHeight > threshold ||
      window.outerWidth - window.innerWidth > threshold
    ) {
      alert("Las herramientas de desarrollador están deshabilitadas");
      onClose();
    }
  };

  document.addEventListener("keydown", handleKeyDown, true);
  document.addEventListener("contextmenu", handleContextMenu);
  document.addEventListener("selectstart", handleSelectStart);
  document.addEventListener("visibilitychange", handleVisibilityChange);
  const devToolsInterval = setInterval(detectDevTools, 500);

  if (containerRef.current) {
    containerRef.current.style.userSelect = "none";
    containerRef.current.style.webkitUserSelect = "none";
  }

  return () => {
    document.removeEventListener("keydown", handleKeyDown, true);
    document.removeEventListener("contextmenu", handleContextMenu);
    document.removeEventListener("selectstart", handleSelectStart);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    clearInterval(devToolsInterval);
    document.getElementById("blur-overlay")?.remove();
  };
}, [isOpen, onClose]);


  const noPrintStyles = `
    @media print {
      .no-print {
        display: none !important;
      }
      body * {
        visibility: hidden;
      }
      .print-message, .print-message * {
        visibility: visible;
      }
      .print-message {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
  `;

  return (
    <>
      <style>{noPrintStyles}</style>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={fileName || "Visualizar Documento"}
        size="lg"
        className="no-print"
      >
        <div
          ref={containerRef}
          className="w-full h-[70vh] overflow-auto no-print relative"
          style={{
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none",
          }}
        >
          {isPdf ? (
            <div>
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer
                  fileUrl={fileUrl}
                  onDocumentLoad={() => {
                    setTimeout(() => {
                      const pdfContainer =
                        document.querySelector(".rpv-core__viewer");
                      if (pdfContainer) {
                        pdfContainer.addEventListener("selectstart", (e) =>
                          e.preventDefault()
                        );
                        pdfContainer.addEventListener("contextmenu", (e) =>
                          e.preventDefault()
                        );
                      }
                    }, 1000);
                  }}
                />
              </Worker>
            </div>
          ) : isImage ? (
            <div>
              <img
                src={fileUrl}
                alt={fileName}
                className="w-full max-h-[70vh] object-contain"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
                style={{
                  userSelect: "none",
                  WebkitUserSelect: "none",
                  pointerEvents: "none",
                }}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full animate-pulse no-print">
              <svg
                className="animate-spin h-10 w-10 text-gray-400 mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              <p className="text-center text-gray-500 text-lg font-medium">
                Cargando...
              </p>
            </div>
          )}
        </div>

        <div className="print-message hidden">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Documento Protegido</h2>
            <p>Este documento está protegido contra impresión.</p>
            <p>Para más información, contacte al administrador.</p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DocumentViewerModal;
