import type { FC } from "react";
import { useState } from "react";
import type { UploadFileModalProps } from "./types/UploadFileModalProps";
import Modal from "./Modal";
import Button from "./Button";
import { useUploadFile } from "../../hooks/useUploadFile";
import { useAuth } from "../../Context/AuthContext";
import { toast } from "react-toastify";
import { useAES } from "../../hooks/useAES";

const UploadFileModal: FC<UploadFileModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { uploadFile, isLoading, error } = useUploadFile();
  const { token } = useAuth(); // Obtiene el token desde el contexto de Auth
  const { encrypt, error: errorAes, decrypt } = useAES();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!selectedFile || !token) return;

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
//////////////////////////////////////////////////////////////////
      // Codifica la cadena a Uint8Array
      const encoder = new TextEncoder();
      const data = encoder.encode("software123");

      // Cifra los datos (Uint8Array)
      const encryptedData1 = await encrypt(data);

      // 🔸 Mostrar el texto cifrado en HEX (legible)
      const hexString = Array.from(encryptedData1 || new Uint8Array())
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      toast.success("Texto cifrado (hex): " + hexString);
      console.log("Texto cifrado (hex):", hexString);

      // 🔸 Si quieres mostrar en Base64 también (opcional)
      const base64String = btoa(
        String.fromCharCode(...(encryptedData1 || new Uint8Array()))
      );
      console.log("Texto cifrado (base64):", base64String);

      // Descifra los datos
      const decryptedData = await decrypt(encryptedData1 || new Uint8Array());

      // Decodifica el resultado descifrado como texto
      const textDecoder = new TextDecoder();
      const originalText = textDecoder.decode(
        decryptedData || new Uint8Array()
      );
      toast.success("Texto descifrado: " + originalText);
      console.log("Texto descifrado:", originalText);
      
      //////////////////////////////////

      const encryptedData = await encrypt(uint8Array);
      if (!encryptedData) {
        toast.error("Error: " + errorAes);
        return;
      }

      // Crear un nuevo Blob o File cifrado
      const encryptedBlob = new Blob([new Uint8Array(encryptedData)], {
        type: selectedFile.type,
      });
      const encryptedFile = new File([encryptedBlob], selectedFile.name, {
        type: selectedFile.type,
      });

      // Ahora sí, subir el archivo cifrado
      const result = await uploadFile(encryptedFile, token);
      if (result.success) {
        toast.success("Archivo cifrado y subido exitosamente");
        onClose();
        setSelectedFile(null); // Reseteamos estado
      } else {
        toast.error(`Error al subir el archivo: ${error}`);
      }
    } catch (err: any) {
      toast.error("Error procesando el archivo.");
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
            label={isLoading ? "Subiendo..." : "Subir archivo"}
            variant="primary"
            onClick={() => handleSubmit()}
            disabled={isLoading || !selectedFile}
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
