import PageHeader from "../components/ui/PageHeader";
import ContentContainer from "../components/ui/ContentContainer";
import SearchBar from "../components/ui/SearchBar";
import UserCard from "../components/ui/UserCard";
import GenericList from "../components/ui/GenericList";
import { useState, useEffect } from "react";
import { useUsers } from "../hooks/useUsers";
import { toast } from "react-toastify";

const SuperAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { users, searchUsers, loading, error } = useUsers();

  const filteredUsers = searchUsers(searchTerm);

  // Mostrar toast de error si existe
  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error}`);
    }
  }, [error]);

  // Mostrar toast si no hay usuarios en la búsqueda
  useEffect(() => {
    if (!loading && filteredUsers.length === 0 && searchTerm) {
      toast.info("No se encontraron usuarios.");
    }
  }, [filteredUsers, loading, searchTerm]);

  const handleRemovePermission = (userName: string) => {
    console.log(`Quitando permiso a ${userName}`);
    toast.success(`Permiso eliminado para ${userName}.`);
  };

  return (
    <div className="flex flex-col flex-1">
      <PageHeader title="Auditoría y Seguridad">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Buscar usuarios..."
        />
      </PageHeader>

      <ContentContainer>
        <GenericList
          items={filteredUsers}
          isLoading={loading}
          emptyMessage="No se encontraron usuarios."
          renderItem={(user) => (
            <UserCard
              key={user.id}
              name={user.name}
              description={user.description}
              lastLogin={`Último inicio de sesión: ${user.lastLogin}`}
              downloadCount={`Número de descargas: ${user.downloadCount}`}
              lastDownload={`Última descarga: ${user.lastDownload}`}
              onRemovePermission={() => handleRemovePermission(user.name)}
            />
          )}
        />
      </ContentContainer>
    </div>
  );
};

export default SuperAdmin;
