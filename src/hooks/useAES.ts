import { useState, useCallback } from 'react';
import { AES128 } from '../utils/AES128';

export const useAES = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const encrypt = useCallback(async (data: Uint8Array): Promise<Uint8Array | null> => {
    setLoading(true);
    setError(null);
    try {
      // Simulamos trabajo pesado (opcional)
      await new Promise((res) => setTimeout(res, 100));
      return AES128.encrypt(data);
    } catch (e: any) {
      setError(e.message || 'Error al cifrar');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const decrypt = useCallback(async (data: Uint8Array): Promise<Uint8Array | null> => {
    setLoading(true);
    setError(null);
    try {
      return AES128.decrypt(data);
    } catch (e: any) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { encrypt, decrypt, loading, error };
};