import { useState, useCallback } from 'react';
import SearchBar from '../components/ui/SearchBar';
import PageHeader from '../components/ui/PageHeader';
import ContentContainer from '../components/ui/ContentContainer';
import UploadFileModal from '../components/ui/UploadFileModal';
import UserPermissionsModal from '../components/ui/UserPermissionsModal';
import Button from '../components/ui/Button';
import StatusMessage from '../components/ui/StatusMessage';
import { useFiles } from '../hooks/useFiles';
import type { FileCardProps } from '../components/ui/types/FileCardProps';
import { mockUsers } from '../services/userService';
import GenericList from '../components/ui/GenericList';
import FileCard from '../components/ui/FileCard';

const ConfiguracionArchivos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUserPermissionsModalOpen, setIsUserPermissionsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileCardProps | null>(null);

  const addCustomActions = useCallback(
    (file: FileCardProps) => ({
      ...file,
      onUserPermissions: () => {
        setSelectedFile(file);
        setIsUserPermissionsModalOpen(true);
      },
    }),
    []
  );

  const { files: filesWithActions, searchFiles, loading, error } = useFiles(addCustomActions);
  const filteredFiles = searchFiles(searchTerm);

  const handleAddUser = (userId: string) => {
    console.log(`Añadiendo usuario ${userId} a ${selectedFile?.title}`);
  };

  const handleRemoveUser = (userId: string) => {
    console.log(`Quitando permiso de usuario ${userId} de ${selectedFile?.title}`);
  };

  const handleGenerateReport = () => {
    console.log(`Generando informe para ${selectedFile?.title}`);
  };

  const handleUploadFile = async (file: File, encryptionKey: string): Promise<void> => {
    console.log('Archivo a subir:', file.name);
    console.log('Clave de cifrado:', encryptionKey);
    await new Promise<void>((resolve) => setTimeout(resolve, 1500));
  };

  return (
    <div className="flex flex-col flex-1">
      <PageHeader title="Configuración de Archivos">
        <div className="flex gap-2 items-center">
          <Button
            label="Añadir"
            onClick={() => setIsUploadModalOpen(true)}
            variant="primary"
            iconLeft={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          />
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Buscar archivos..."
          />
        </div>
      </PageHeader>

      <ContentContainer>
        <StatusMessage
          isLoading={loading}
          error={error}
          empty={filteredFiles.length === 0}
          emptyMessage="No se encontraron archivos en la configuración."
        >
          <GenericList
            items={filteredFiles}
            isLoading={loading}
            emptyMessage="No se encontraron archivos en la configuración."
            renderItem={(file) => <FileCard key={file.id} {...file} />}
          />
        </StatusMessage>
      </ContentContainer>

      <UploadFileModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadFile}
      />

      {selectedFile && (
        <UserPermissionsModal
          isOpen={isUserPermissionsModalOpen}
          onClose={() => setIsUserPermissionsModalOpen(false)}
          fileName={selectedFile.title}
          users={mockUsers}
          onAddUser={handleAddUser}
          onRemoveUser={handleRemoveUser}
          onGenerateReport={handleGenerateReport}
        />
      )}
    </div>
  );
};

export default ConfiguracionArchivos;