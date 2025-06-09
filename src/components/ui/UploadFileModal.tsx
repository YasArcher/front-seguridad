import type { FC } from "react";
import { useState } from "react";
import type { UploadFileModalProps } from "./types/UploadFileModalProps";
import Modal from "./Modal";
import Button from "./Button";
import { toast } from "react-toastify";

interface GenericUploadFileModalProps extends UploadFileModalProps {
  onUpload: (file: File) => Promise<void>;
}

const UploadFileModal: FC<GenericUploadFileModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      setError(null);

      await onUpload(selectedFile);

      toast.success("Archivo subido exitosamente");
      onClose();
      setSelectedFile(null);
    } catch (err: any) {
      console.error("Error en la subida:", err);
      setError("Error al subir el archivo.");
      toast.error("Error al subir el archivo.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Subir nuevo archivo"
      footer={
        <>
          <Button
            label={isUploading ? "Subiendo..." : "Subir archivo"}
            variant="primary"
            onClick={() => handleSubmit()}
            disabled={isUploading || !selectedFile}
          />
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar archivo
          </label>
          <div className="mt-1 flex items-center">
            <div className="w-full">
              <label
                htmlFor="file-upload"
                className="flex justify-center items-center px-4 py-3 border border-gray-300 
                  border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors
                  duration-200 ease-in-out focus-within:outline-none focus-within:ring-2 
                  focus-within:ring-blue-500 focus-within:border-blue-500"
              >
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <span>
                      {selectedFile
                        ? selectedFile.name
                        : "Arrastra y suelta un archivo aquí, o haz clic para seleccionar"}
                    </span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>
        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>
    </Modal>
  );
};

export default UploadFileModal;
