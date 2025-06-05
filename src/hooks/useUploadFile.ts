import { useAES } from "./useAES";
import { calculateSHA256HashHex, signHashHex } from "../utils/hash";
import { useState } from "react";
import { uploadFileService } from "../services/fileService";
import { useAuth } from "../Context/AuthContext";
const keySignature = import.meta.env.VITE_SIGNATURE_SECRET_KEY;

interface UploadResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export const useUploadFile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth();
  const { encrypt, error: aesError } = useAES();

  const uploadFile = async (
    originalFile: File,
    token: string
  ): Promise<UploadResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const originalBuffer = await originalFile.arrayBuffer();

      // 1. Calcular el hash SHA-256 del archivo original
      const fileHash = await calculateSHA256HashHex(originalFile);

      // 2. Firmar el hash (requiere pasar la clave privada)
      const signature = await signHashHex(fileHash, keySignature);

      // 3. Cifrar el archivo con tu AES personalizado
      const encryptedBytes = await encrypt(new Uint8Array(originalBuffer));
      if (!encryptedBytes)
        throw new Error(aesError || "Fallo en cifrado AES personalizado");

      // 4. Crear archivo cifrado como File
      const encryptedBlob = new Blob([new Uint8Array(encryptedBytes)], {
        type: originalFile.type,
      });
      const encryptedFile = new File([encryptedBlob], originalFile.name, {
        type: originalFile.type,
      });

      // 5. Subirlo al servidor
      const { status, data } = await uploadFileService(
        encryptedFile,
        token,
        logout,
        fileHash,
        signature
      );

      if (status >= 200 && status < 300) {
        return { success: true, data };
      } else {
        return {
          success: false,
          error: data?.message || "Error al subir el archivo.",
        };
      }
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Error inesperado al procesar el archivo.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  return { uploadFile, isLoading, error };
};
