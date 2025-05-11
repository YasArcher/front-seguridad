import { useState, useEffect } from 'react';
import { mockFiles } from '../services/fileService';
import type { FileCardProps } from '../components/ui/types/FileCardProps';

export const useFiles = (
  enhancer?: (file: FileCardProps) => FileCardProps
) => {
  const [files, setFiles] = useState<FileCardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));

        const filesWithActions = mockFiles.map((file) => {
          const baseFile: FileCardProps = {
            ...file,
            onDownload: () => console.log(`Descargando ${file.title}`),
            onDelete: () => console.log(`Eliminando ${file.title}`),
            onEncryptionKey: () => console.log(`Clave de cifrado de ${file.title}`),
          };
          return enhancer ? enhancer(baseFile) : baseFile;
        });

        setFiles(filesWithActions);
      } catch (err) {
        setError('Error al cargar archivos.');
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [enhancer]);

  const searchFiles = (term: string): FileCardProps[] =>
    files.filter((file) =>
      file.title.toLowerCase().includes(term.toLowerCase()) ||
      file.description.toLowerCase().includes(term.toLowerCase()) ||
      file.type.toLowerCase().includes(term.toLowerCase())
    );

  return { files, searchFiles, loading, error };
};