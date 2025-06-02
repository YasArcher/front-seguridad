import { useState } from 'react';
import { uploadFileService } from '../services/fileService';
import { useAuth } from '../Context/AuthContext';

interface UploadResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export const useUploadFile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth();

  const uploadFile = async (file: File, token: string): Promise<UploadResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const { status, data } = await uploadFileService(file, token, logout);

      if (status >= 200 && status < 300) {
        return { success: true, data };
      } else {
        return { success: false, error: data?.message || 'Error al subir el archivo.' };
      }
    } catch {
      return { success: false, error: 'Error de red o servidor no disponible.' };
    } finally {
      setIsLoading(false);
    }
  };

  return { uploadFile, isLoading, error }; // ✅ Retornas progress
};
