import { useState } from "react";
import { protectDownloadPdfService } from "../services/fileService";
import { useAuth } from "../Context/AuthContext";

interface ProtectedResult {
  protectedBlob: Blob;
  pdfPassword: string;
  fileName: string;
  fileHash: string;
  signature: string;
}

export const useProtectPdf = () => {
  const { token, logout } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const protectPdf = async (file: File): Promise<ProtectedResult | null> => {
    if (!token) {
      setError("No hay sesión activa.");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Paso 1️⃣ → proteger PDF (enviar a /files/protect-dw-pdf)
      const { protected_pdf, pdf_password, file_name, file_hash, signature } = await protectDownloadPdfService(file, token, logout);

      // Paso 2️⃣ → reconstruir Blob desde base64
      const byteCharacters = atob(protected_pdf);
      const byteNumbers = Array.from(byteCharacters, (c) => c.charCodeAt(0));
      const byteArray = new Uint8Array(byteNumbers);
      const protectedBlob = new Blob([byteArray], { type: "application/pdf" });

      // Devolver resultado COMPLETO
      return {
        protectedBlob,
        pdfPassword: pdf_password,
        fileName: file_name,
        fileHash: file_hash,
        signature: signature,
      };
    } catch (err: any) {
      console.error("Error en protectPdf:", err);
      setError(err.message || "Error inesperado en protectPdf.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    protectPdf,
    isLoading,
    error,
  };
};
