import PageHeader from "../components/ui/PageHeader";
import ContentContainer from "../components/ui/ContentContainer";
import SearchBar from "../components/ui/SearchBar";
import UserCard from "../components/ui/UserCard";
import GenericList from "../components/ui/GenericList";
import StatusMessage from "../components/ui/StatusMessage";
import { useState } from "react";
import { useUsers } from "../hooks/useUsers";

const SuperAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { users, searchUsers, loading, error } = useUsers();

  const filteredUsers = searchUsers(searchTerm);

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
        <StatusMessage
          isLoading={loading}
          error={error}
          empty={filteredUsers.length === 0}
          emptyMessage="No se encontraron usuarios."
        >
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
                onRemovePermission={() =>
                  console.log(`Quitando permiso a ${user.name}`)
                } // Aquí defines la acción del botón
              />
            )}
          />
        </StatusMessage>
      </ContentContainer>
    </div>
  );
};

export default SuperAdmin;