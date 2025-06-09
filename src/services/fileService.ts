import pdfIcon from "../assets/pdf.svg";
import wordIcon from "../assets/word.svg";
import mp3Icon from "../assets/mp3.svg";
import defaultIcon from "../assets/defaultIcon.svg";
import type { FileCardProps } from "../components/ui/types/FileCardProps";
import { customFetch } from "./customFetch";

const API_URL = 'httpS://localhost/files/';

interface ApiFileResponse {
  file_id: number;
  file_name: string;
  user_id: number;
  created_at: string;
  access_type: 'own' | 'shared';
  can_view: boolean;
  can_download: boolean;
  permission_type: 'view' | 'download' | 'both' | 'full';
  lastDownload: string;
  totalDownloads: number;
}

interface FileListResponse {
  total: number;
  page: number;
  per_page: number;
  files: ApiFileResponse[];
}

interface ShareFileParams {
  fileId: string;
  token: string;
  targetUserId: number;
  permissionType: 'download' | 'view' | 'both' | 'none';
  role: string
}

const getFileIcon = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf': return pdfIcon;
    case 'docx': return wordIcon;
    case 'mp3': return mp3Icon;
    default: return defaultIcon;
  }
};

export const getFilesService = async (
  token: string,
  page = 1,
  perPage = 9999,
  actionType: 'basic' | 'full' = 'basic',
  logout?: () => void
): Promise<FileCardProps[]> => {
  const response = await customFetch(`${API_URL}?page=${page}&per_page=${perPage}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  }, logout);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error);
  }

  const data: FileListResponse = await response.json();

  // 🔥 Agregar info de descargas por cada archivo
  const enrichedFiles = await Promise.all(
    data.files.map(async (file) => {
      let downloadStats = { totalDownloads: 0, lastDownload: "-", userDownloadStats: [] };

      try {
        const historyResponse = await customFetch(`${API_URL}${file.file_id}/download-history`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        }, logout);

        if (historyResponse.ok) {
          const historyData = await historyResponse.json();
          const history = historyData.history ?? [];

          const totalDownloads = history.reduce((acc: any, item: any) => acc + (item.download_count || 0), 0);
          const lastDownload = history.reduce((latest: any, item: any) =>
            latest > item.last_download ? latest : item.last_download, "");

          downloadStats = {
            totalDownloads,
            lastDownload,
            userDownloadStats: history,
          };
        }
      } catch (e) {
        console.warn(`Error al obtener historial de descargas para ${file.file_name}:`, e);
      }

      const baseFile: FileCardProps = {
        id: file.file_id,
        icon: getFileIcon(file.file_name),
        title: file.file_name,
        accessType: file.access_type,
        type: file.file_name.split('.').pop()?.toUpperCase() || 'FILE',
        can_view: file.can_view,
        can_download: file.can_download,
        permissionType: file.permission_type,
        ...downloadStats,  // <--- Combina la info,
        lastModified: downloadStats.lastDownload,
        downolad_count: downloadStats.totalDownloads,
      };

      if (actionType === 'full') {
        return {
          ...baseFile,
          onDelete: () => console.log(`Eliminando ${file.file_name}`),
          onUserPermissions: () => console.log(`Permisos de ${file.file_name}`),
        };
      }

      return baseFile;
    })
  );

  return enrichedFiles;
};


export const uploadFileService = async (
  file: File,
  token: string,
  logout?: () => void,
  fileHash?: string,
  signature?: string
) => {
  const formData = new FormData();
  formData.append('file', file);

  // ✅ Agregar nuevos campos si están disponibles
  if (fileHash) formData.append('file_hash', fileHash);
  if (signature) formData.append('signature', signature);

  const response = await customFetch(`${API_URL}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  }, logout);

  const responseBody = await response.json();

  return {
    status: response.status,
    data: responseBody,
  };
};

export const deleteFileService = async (fileId: string, token: string, logout?: () => void): Promise<void> => {
  const response = await customFetch(`${API_URL}${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  }, logout);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error);
  }
};

export const shareFileService = async (
  { fileId, token, targetUserId, permissionType }: ShareFileParams,
  logout?: () => void
): Promise<void> => {
  console.log('Sharing file:', { fileId, targetUserId, permissionType });
  const response = await customFetch(`${API_URL}${fileId}/share`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      target_user_id: targetUserId,
      permission_type: permissionType,
    }),
  }, logout);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error);
  }
};

export const updateShareFileService = async (
  { fileId, token, targetUserId, permissionType, role }: ShareFileParams,
  logout?: () => void
): Promise<void> => {
  const response = await customFetch(`${API_URL}${fileId}/permissions`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      target_user_id: targetUserId,
      permission_type: permissionType,
      user_role: role
    }),
  }, logout);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error);
  }
}

export const downloadFileService = async (
  fileId: string,
  token: string,
  logout?: () => void
): Promise<Blob> => {
  const response = await customFetch(`${API_URL}${fileId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }, logout);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error);
  }

  return response.blob();
};

export const viewFileService = async (
  fileId: string,
  token: string,
  logout?: () => void
): Promise<Blob> => {
  const response = await fetch(`${API_URL}${fileId}/view`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("✅ Headers del archivo:", response.headers.get("Content-Type"));

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (logout) logout();
    throw new Error(errorData.error || "Error al obtener el archivo para ver.");
  }

  return response.blob();
};


export const verifySignatureService = async (
  fileHash: string,
  signature: string,
  token: string,
  logout?: () => void
): Promise<{ valid: boolean; message?: string; error?: string }> => {
  try {
    const response = await customFetch(`${API_URL}verify-signature`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        file_hash: fileHash,
        signature: signature,
      }),
    }, logout);

    const data = await response.json();

    if (!response.ok) {
      return {
        valid: false,
        error: data.error || "Error al verificar firma.",
      };
    }

    return {
      valid: data.valid,
      message: data.message,
    };
  } catch (e: any) {
    // Captura de error de red, error en customFetch, etc.
    console.error("Error en verifySignatureService:", e);
    return {
      valid: false,
      error: e.message || "Error inesperado al verificar firma.",
    };
  }
};
