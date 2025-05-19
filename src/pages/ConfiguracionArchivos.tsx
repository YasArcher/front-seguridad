import { useState, useCallback, useEffect } from "react";
import SearchBar from "../components/ui/SearchBar";
import PageHeader from "../components/ui/PageHeader";
import ContentContainer from "../components/ui/ContentContainer";
import UploadFileModal from "../components/ui/UploadFileModal";
import UserPermissionsModal from "../components/ui/UserPermissionsModal";
import Button from "../components/ui/Button";
import { useFiles } from "../hooks/useFiles";
import type { FileCardProps } from "../components/ui/types/FileCardProps";
import { useUsers } from "../hooks/useUsers";
import GenericList from "../components/ui/GenericList";
import FileCard from "../components/ui/FileCard";
import { toast } from "react-toastify";
import { useAuth } from "../Context/AuthContext";

const ConfiguracionArchivos = () => {
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUserPermissionsModalOpen, setIsUserPermissionsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileCardProps | null>(null);

  // ✅ Memoriza la función para evitar renders infinitos
  const handleUserPermissions = useCallback((file: FileCardProps) => {
    setSelectedFile(file);
    setIsUserPermissionsModalOpen(true);
  }, []);

const { files, searchFiles, loading: loadingFiles, error: filesError } = useFiles("full", handleUserPermissions);
const filteredFiles = searchFiles(searchTerm);

const { users, searchUsers, loading: loadingUsers, error: usersError } = useUsers(token ?? "");
const filteredUsers = searchUsers(searchTerm);


  useEffect(() => {
    if (filesError) toast.error(`Error: ${filesError}`);
  }, [filesError]);

  useEffect(() => {
    if (!loadingFiles && filteredFiles.length === 0 && searchTerm) {
      toast.info("No se encontraron archivos en la configuración.");
    }
  }, [filteredFiles, loadingFiles, searchTerm]);

  const handleAddUser = (userId: string) => {
    console.log(`Añadiendo usuario ${userId} a ${selectedFile?.title}`);
    toast.success(`Usuario ${userId} añadido a ${selectedFile?.title}.`);
  };

  const handleRemoveUser = (userId: string) => {
    console.log(`Quitando permiso de usuario ${userId} de ${selectedFile?.title}`);
    toast.info(`Permiso de usuario ${userId} eliminado de ${selectedFile?.title}.`);
  };

  const handleGenerateReport = () => {
    console.log(`Generando informe para ${selectedFile?.title}`);
    toast.success(`Informe generado para ${selectedFile?.title}.`);
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
        <GenericList
          items={filteredFiles}
          isLoading={loadingFiles}
          emptyMessage="No se encontraron archivos en la configuración."
          renderItem={(file) => <FileCard key={file.id} {...file} />}
        />
      </ContentContainer>

      <UploadFileModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      {selectedFile && (
        <UserPermissionsModal
          isOpen={isUserPermissionsModalOpen}
          onClose={() => setIsUserPermissionsModalOpen(false)}
          fileName={selectedFile.title}
          users={filteredUsers.map(user => ({
            ...user,
            downloadCount: typeof user.downloadCount === "string" ? Number(user.downloadCount) : user.downloadCount
          }))}
          onAddUser={handleAddUser}
          onRemoveUser={handleRemoveUser}
          onGenerateReport={handleGenerateReport}
        />
      )}
    </div>
  );
};

export default ConfiguracionArchivos;
