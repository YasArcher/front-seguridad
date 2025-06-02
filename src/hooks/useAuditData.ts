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
      const permissionsRes = await getUserPermissionsService(userId, token, logout);
      const permissionsLogs = permissionsRes.logs || [];

      const sessionsRes = await getUserSessionsService(userId, token, logout);
      const sessionsLogs = sessionsRes.logs || [];
      const sessionsData = sessionsRes.data.map((s) => ({
        ip: s.ip_address,
        userAgent: s.user_agent,
        lastActivity: s.last_activity_at,
      }));

      const filesRes = await getUserFilesService(userId, token, logout);
      const filesLogs = filesRes.logs || [];
      const filesData = filesRes.data.map((f) => f.file_name);

      const loginsRes = await getUserLoginAttemptsService(email, token, logout);
      const loginsLogs = loginsRes.logs || [];
      const loginsData = loginsRes.data.map((l) => ({
        attemptedAt: l.attempt_time,
      }));

      const downloadsRes = await getUserDownloadsService(userId, token, logout);
      const downloadsLogs = downloadsRes.logs || [];
      const downloadsData = downloadsRes.data.map((d:any) => ({
        fileId: d.file_id,
        time: d.download_time,
        ip: d.ip_address,
        userAgent: d.user_agent,
      }));

      const combinedLogs = [...permissionsLogs, ...sessionsLogs, ...filesLogs, ...loginsLogs, ...downloadsLogs];
      const sortedLogs = sortLogsByDate(combinedLogs);

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
