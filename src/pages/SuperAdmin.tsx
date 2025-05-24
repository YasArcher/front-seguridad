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
  const token = localStorage.getItem("token") || "";

  const { users, searchUsers, loading, error, setUsers } = useUsers(token);
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
              id={user.id}
              name={`${user.first_name} ${user.last_name}`}
              is_active={user.is_active ?? false}
              lastLogin={
                user.created_at
                  ? new Date(user.created_at).toLocaleDateString()
                  : "-"
              }
              loginCount={"0"}
              lastDownload={user.last_download ?? "-"}
              avatarUrl={undefined}
              // ✅ Actualiza solo el usuario afectado
              onPermissionsChange={({ state }) => {
                setUsers((prev) =>
                  prev.map((u) =>
                    u.id === user.id ? { ...u, is_active: state } : u
                  )
                );
              }}
            />
          )}
        />
      </ContentContainer>
    </div>
  );
};

export default SuperAdmin;
