import { useState, useCallback, useEffect } from "react";
import SearchBar from "../components/ui/SearchBar";
import PageHeader from "../components/ui/PageHeader";
import ContentContainer from "../components/ui/ContentContainer";
import UploadFileModal from "../components/ui/UploadFileModal";
import UserPermissionsModal from "../components/ui/UserPermissionsModal";
import Button from "../components/ui/Button";
import { useFiles } from "../hooks/useFiles";
import type { FileCardProps } from "../components/ui/types/FileCardProps";
import { useFilePermissions } from "../hooks/useFilePermissions";
import GenericList from "../components/ui/GenericList";
import FileCard from "../components/ui/FileCard";
import { toast } from "react-toastify";
import type { User } from "../services/Types/User";
import { useUploadFile } from "../hooks/useUploadFile";
import { useAuth } from "../Context/AuthContext";

const ConfiguracionArchivos = () => {
  const { uploadFile, isLoading, error } = useUploadFile();
  const { token } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUserPermissionsModalOpen, setIsUserPermissionsModalOpen] =
    useState(false);
  const [selectedFile, setSelectedFile] = useState<FileCardProps | null>(null);

  const handleUserPermissions = useCallback((file: FileCardProps) => {
    setSelectedFile(file);
    setIsUserPermissionsModalOpen(true);
  }, []);

  const {
    // @ts-ignore
    files,
    searchFiles,
    loading: loadingFiles,
    error: filesError,
    refresh: refreshFiles,
  } = useFiles("full", handleUserPermissions);
  const filteredFiles = searchFiles(searchTerm);

  const fileId =
    isUserPermissionsModalOpen && selectedFile?.id
      ? String(selectedFile.id)
      : null;

  const {
    // @ts-ignore
    users: fileUsers,
    searchUsers,
    // @ts-ignore
    loading: loadingUsers,
    error: usersError,
  } = useFilePermissions(fileId ?? "");
  const [canUpload, setCanUpload] = useState(false);

  const filteredUsers: User[] = searchUsers(searchTerm).map((u) => ({
    id: u.user_id,
    first_name: u.first_name,
    last_name: u.last_name,
    email: u.email,
    permission_type: u.permission_type ?? "none",
    full_name: `${u.first_name} ${u.last_name}`,
    role: "user",
    is_active: true,
    can_upload: false,
  }));

  useEffect(() => {
    if (filesError) toast.error(`Error: ${filesError}`);
  }, [filesError]);

  useEffect(() => {
    if (usersError) toast.error(`Error: ${usersError}`);
  }, [usersError]);

  useEffect(() => {
    if (!loadingFiles && filteredFiles.length === 0 && searchTerm) {
      toast.info("No se encontraron archivos en la configuración.");
    }
  }, [filteredFiles, loadingFiles, searchTerm]);

  useEffect(() => {
    setCanUpload(getCanUploadFromToken());
  }, []);

  const handleAddUser = (userId: string) => {
    toast.success(`Usuario ${userId} añadido a ${selectedFile?.title}.`);
  };

  const handleRemoveUser = (userId: string) => {
    console.log(
      `Quitando permiso de usuario ${userId} de ${selectedFile?.title}`
    );
    toast.info(
      `Permiso de usuario ${userId} eliminado de ${selectedFile?.title}.`
    );
  };

  const handleGenerateReport = () => {
    toast.success(`Informe generado para ${selectedFile?.title}.`);
  };

  const handleUploadFile = async (file: File) => {
    if (!token) {
      toast.error("No hay sesión activa.");
      return;
    }

    try {
      const result = await uploadFile(file, token);

      if (result.success) {
        toast.success("Archivo subido exitosamente.");
        setIsUploadModalOpen(false);
        refreshFiles(); // refrescamos la lista
      } else {
        toast.error(`Error al subir el archivo: ${error}`);
      }
    } catch (err: any) {
      toast.error("Error al subir el archivo.");
    }
  };

  const getCanUploadFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const payloadBase64 = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      return decodedPayload.can_upload === true;
    } catch (error) {
      console.error("Error decodificando el token JWT:", error);
      return false;
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <PageHeader title="Configuración de Archivos">
        <div className="flex gap-2 items-center">
          {canUpload && (
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              }
            />
          )}

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
        onClose={() => {
          setIsUploadModalOpen(false);
          refreshFiles();
        }}
        onUpload={handleUploadFile} // 👈 aquí le pasas la función
      />

      {selectedFile && (
        <UserPermissionsModal
          isOpen={isUserPermissionsModalOpen}
          onClose={() => {
            setIsUserPermissionsModalOpen(false);
            setSelectedFile(null);
          }}
          fileName={selectedFile.title}
          users={filteredUsers}
          onAddUser={handleAddUser}
          onRemoveUser={handleRemoveUser}
          onGenerateReport={handleGenerateReport}
          fileId={String(selectedFile.id)}
          lastDownload={selectedFile.lastModified || "-"}
          downloadCount={selectedFile.downolad_count || 0}
        />
      )}
    </div>
  );
};

export default ConfiguracionArchivos;