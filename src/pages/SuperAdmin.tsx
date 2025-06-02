import PageHeader from "../components/ui/PageHeader";
import ContentContainer from "../components/ui/ContentContainer";
import SearchBar from "../components/ui/SearchBar";
import UserCard from "../components/ui/UserCard";
import GenericList from "../components/ui/GenericList";
import { useState, useEffect } from "react";
import { useUsers } from "../hooks/useUsers";
import { toast } from "react-toastify";
import Button from "../components/ui/Button";
import FileAuditModal from "../components/ui/FileAuditModal";

const SuperAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token") || "";
  // @ts-ignore
  const { users, searchUsers, loading, error, setUsers } = useUsers(token);
  const filteredUsers = searchUsers(searchTerm);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
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
        <div className="flex gap-2 items-center">
          <Button
            label="Archivos Auditados"
            onClick={() => setIsAuditModalOpen(true)}
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
                  d="M21 21l-4.35-4.35M16 11a5 5 0 11-10 0 5 5 0 0110 0zM19 7l-5-5H5a2 2 0 00-2 2v14a2 2 0 002 2h6.586a2 2 0 001.414-.586l5.414-5.414A2 2 0 0020 14.414V9a2 2 0 00-.586-1.414L19 7z"
                />
              </svg>
            }
          />

          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Buscar usuarios..."
          />
        </div>
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
              email={user.email}
              can_upload={user.can_upload ?? false}
            />
          )}
        />
      </ContentContainer>
      <FileAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />
    </div>
  );
};

export default SuperAdmin;
