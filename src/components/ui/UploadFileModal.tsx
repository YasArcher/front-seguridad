import type { FC } from 'react';
import { useState } from 'react';
import type { UploadFileModalProps } from './types/UploadFileModalProps';
import Modal from './Modal';
import Button from './Button';

const UploadFileModal: FC<UploadFileModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [encryptionKey, setEncryptionKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!selectedFile || !encryptionKey) return;

    setIsLoading(true);
    try {
      await onUpload(selectedFile, encryptionKey);
      onClose();
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsLoading(false);
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
            label={isLoading ? 'Subiendo...' : 'Subir archivo'}
            variant="primary"
            onClick={() => handleSubmit()}
            disabled={isLoading || !selectedFile || !encryptionKey}
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
                        : "Arrastra y suelta un archivo aquí, o haz clic para seleccionar"
                      }
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Clave de cifrado
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="password"
              value={encryptionKey}
              onChange={(e) => setEncryptionKey(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingrese la clave para cifrar el archivo"
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Esta clave será necesaria para acceder al archivo posteriormente.
          </p>
        </div>
      </form>
    </Modal>
  );
};

export default UploadFileModal;