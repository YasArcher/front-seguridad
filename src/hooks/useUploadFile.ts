import { useState } from "react";
import { uploadFileService } from "../services/fileService";
import { useAuth } from "../Context/AuthContext";
import { useAES } from "./useAES";

interface UploadResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export const useUploadFile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth();
  const { token } = useAuth();
  const { encrypt, error: aesError } = useAES();

  const uploadFile = async (
    protectedBlob: Blob, // protectedBlob reconstruido del protected_pdf
    fileName: string, // file_name de /files/protect-dw-pdf
    pdfPassword: string, // pdf_password de /files/protect-dw-pdf
    fileHash: string, // file_hash de /files/protect-dw-pdf (NO recalculado!)
    signature: string // signature de /files/protect-dw-pdf
  ): Promise<UploadResponse> => {
    setIsLoading(true);
    setError(null);

    if (!token) {
      const errorMessage = "Token de autenticación no disponible.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }

    try {
      // 1️⃣ Aplicar cifrado AES al protectedBlob
      const protectedArrayBuffer = await protectedBlob.arrayBuffer();
      const protectedBytes = new Uint8Array(protectedArrayBuffer);

      const encryptedBytes = await encrypt(protectedBytes);
      if (!encryptedBytes) {
        throw new Error(aesError || "Fallo en cifrado AES personalizado.");
      }

      // 2️⃣ Construir File con el resultado cifrado (doblemente protegido)
      const encryptedBlob = new Blob([new Uint8Array(encryptedBytes)], {
        type: "application/pdf",
      });
      const encryptedFile = new File([encryptedBlob], fileName, {
        type: "application/pdf",
      });

      // 3️⃣ Subir al servidor usando los valores dados por el backend
      const { status, data } = await uploadFileService(
        encryptedFile,
        token,
        logout,
        fileHash,
        signature,
        pdfPassword
      );

      // 4️⃣ Evaluar respuesta de forma robusta
      if (status >= 200 && status < 300 && data?.success !== false) {
        return { success: true, data };
      } else {
        const errorMessage =
          data?.error || `Error al subir el archivo (HTTP ${status})`;
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err: any) {
      // Si ocurre un error inesperado (fetch falla, CORS, red, etc.)
      const errorMessage =
        err?.message || "Error inesperado al procesar el archivo.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { uploadFile, isLoading, error };
};
