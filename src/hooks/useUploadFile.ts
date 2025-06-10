import { calculateSHA256HashHexFromBlob, signHashHex } from "../utils/hash";
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
  const { encrypt, error: aesError } = useAES();

  const uploadFile = async (
    protectedBlob: Blob,   // protectedBlob recién reconstruido del protected_pdf (sin AES todavía)
    fileName: string,      // file_name de /files/protect-dw-pdf
    pdfPassword: string,   // pdf_password de /files/protect-dw-pdf
    token: string
  ): Promise<UploadResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // 1️⃣ Calcular hash del protectedBlob SIN cifrado
      const fileHash = await calculateSHA256HashHexFromBlob(protectedBlob);

      // 2️⃣ Firmar el hash
      const signature = await signHashHex(fileHash);

      // 3️⃣ Aplicar cifrado AES al protectedBlob
      const protectedArrayBuffer = await protectedBlob.arrayBuffer();
      const protectedBytes = new Uint8Array(protectedArrayBuffer);

      const encryptedBytes = await encrypt(protectedBytes);
      if (!encryptedBytes) {
        throw new Error(aesError || "Fallo en cifrado AES personalizado.");
      }

      // 4️⃣ Construir File con el resultado cifrado (doblemente protegido)
      const encryptedBlob = new Blob([new Uint8Array(encryptedBytes)], { type: "application/pdf" });
      const encryptedFile = new File([encryptedBlob], fileName, {
        type: "application/pdf",
      });

      // 5️⃣ Subir al servidor
      const { status, data } = await uploadFileService(
        encryptedFile,
        token,
        logout,
        fileHash,    // hash del PDF protegido (sin AES)
        signature,   // firma de ese hash
        pdfPassword  // contraseña que dio el backend
      );

      if (status >= 200 && status < 300) {
        return { success: true, data };
      } else {
        const errorMessage = data?.error || "Error al subir el archivo.";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Error inesperado al procesar el archivo.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { uploadFile, isLoading, error };
};
