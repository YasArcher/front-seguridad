import { useEffect, useState, useCallback } from "react";
import {
  getUserPermissionsService,
  getUserSessionsService,
  getUserFilesService,
  getUserLoginAttemptsService,
  getUserDownloadsService,
} from "../services/auditService";
import { useAuth } from "../Context/AuthContext";

interface UseAuditDataParams {
  userId: number;
  email: string;
}

export const useAuditData = ({ userId, email }: UseAuditDataParams) => {
  const { token, logout } = useAuth();
  const [auditLogs, setAuditLogs] = useState<string[]>([]);
  const [activeSessions, setActiveSessions] = useState<
    { ip: string; userAgent: string; lastActivity: string }[]
  >([]);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [loginAttempts, setLoginAttempts] = useState<{ attemptedAt: string }[]>([]);
  const [downloadHistory, setDownloadHistory] = useState<
    { fileId: number; time: string; ip: string; userAgent: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sortLogsByDate = (logs: string[]): string[] => {
    return logs.sort((a, b) => {
      const dateA = new Date(a.substring(1, 20)).getTime();
      const dateB = new Date(b.substring(1, 20)).getTime();
      return dateB - dateA; // Más recientes primero
    });
  };

  const fetchData = useCallback(async () => {
    if (!token) {
      setError("No hay sesión activa.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Lanzamos las 5 peticiones en paralelo con Promise.all
      const [
        permissionsRes,
        sessionsRes,
        filesRes,
        loginsRes,
        downloadsRes
      ] = await Promise.all([
        getUserPermissionsService(userId, token, logout),
        getUserSessionsService(userId, token, logout),
        getUserFilesService(userId, token, logout),
        getUserLoginAttemptsService(email, token, logout),
        getUserDownloadsService(userId, token, logout)
      ]);

      // Procesamos los resultados
      const permissionsLogs = permissionsRes.logs || [];

      const sessionsLogs = sessionsRes.logs || [];
      const sessionsData = sessionsRes.data.map((s) => ({
        ip: s.ip_address,
        userAgent: s.user_agent,
        lastActivity: s.last_activity_at,
      }));

      const filesLogs = filesRes.logs || [];
      const filesData = filesRes.data.map((f) => f.file_name);

      const loginsLogs = loginsRes.logs || [];
      const loginsData = loginsRes.data.map((l) => ({
        attemptedAt: l.attempt_time,
      }));

      const downloadsLogs = downloadsRes.logs || [];
      const downloadsData = downloadsRes.data.map((d: any) => ({
        fileId: d.file_id,
        time: d.download_time,
        ip: d.ip_address,
        userAgent: d.user_agent,
      }));

      // Combinar logs
      const combinedLogs = [
        ...permissionsLogs,
        ...sessionsLogs,
        ...filesLogs,
        ...loginsLogs,
        ...downloadsLogs
      ];
      const sortedLogs = sortLogsByDate(combinedLogs);

      // Actualizar estados
      setAuditLogs(sortedLogs);
      setActiveSessions(sessionsData);
      setUploadedFiles(filesData);
      setLoginAttempts(loginsData);
      setDownloadHistory(downloadsData);
    } catch (err: any) {
      setError(err.message || "Error al cargar datos de auditoría");
    } finally {
      setLoading(false);
    }
  }, [userId, email, token, logout]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    auditLogs,
    activeSessions,
    uploadedFiles,
    loginAttempts,
    downloadHistory,
    loading,
    error,
    refetch: fetchData,
  };
};
