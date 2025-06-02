import { useState } from 'react';
import { getFileActionsAuditService } from '../services/authService';
import { useAuth } from '../Context/AuthContext';

export const useFileActionsAudit = () => {
  const [auditLogs, setAuditLogs] = useState<string[]>([]);
  const [auditData, setAuditData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token, logout } = useAuth();

  const fetchFileActionsAudit = async () => { // ✅ fileId opcional
    if (!token) {
      setError('No hay sesión activa.');
      return;
    }

    try {
      setLoading(true);
      const { status, data } = await getFileActionsAuditService('',token, logout);

      if (status >= 200 && status < 300) {
        setAuditLogs(data.logs || []);
        setAuditData(data.data || []);
        setError(null);
      } else {
        setError(data?.message || 'Error al obtener los registros de auditoría.');
      }
    } catch (e: any) {
      setError('Error de red o servidor no disponible.');
    } finally {
      setLoading(false);
    }
  };

  return { logs: auditLogs, actions: auditData, loading, error, fetchAudit: fetchFileActionsAudit };

};
