import type { FC } from "react";
import { useEffect } from "react"; // Si no está importado
import { useState } from "react";
import type { UserPermissionsModalProps } from "./types/UserPermissionsModalProps";
import Modal from "./Modal";
import SearchBar from "./SearchBar";
import ContentContainer from "./ContentContainer";
import UserPermissionCard from "./UserPermissionCard";
import { useShareFile } from "../../hooks/useShareFile";

const UserPermissionsModal: FC<UserPermissionsModalProps> = ({
  isOpen,
  onClose,
  fileName,
  users,
  fileId,
  lastDownload,
  downloadCount,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { shareFile } = useShareFile();
  const [userPermissions, setUserPermissions] = useState(users);
  const filteredUsers = userPermissions.filter((user) =>
    `${user.first_name} ${user.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  useEffect(() => {
  setUserPermissions(users);
}, [users]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title={fileName}>
      <ContentContainer>
        {/* Header Actions */}
        <div className="flex flex-wrap gap-3 justify-between items-center mb-6">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Buscar usuarios..."
          />
        </div>

        {/* User List */}
        <div className="flex-grow overflow-y-auto space-y-4 max-h-96">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <UserPermissionCard
                key={user.id}
                fileId={fileId}
                userId={user.id}
                name={`${user.first_name} ${user.last_name}`}
                avatarUrl="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png"
                lastDownload={lastDownload}
                downloadCount={downloadCount}
                permission_type={user.permission_type}
                onPermissionChange={async ({ permission }) => {
                  try {
                    await shareFile(fileId, user.id, permission);
                    setUserPermissions((prev) =>
                      prev.map((u) =>
                        u.id === user.id
                          ? { ...u, permission_type: permission }
                          : u
                      )
                    );
                  } catch (error) {
                    console.error("Error al actualizar permisos:", error);
                    // Aquí puedes usar toast para mostrar error
                  }
                }}
              />
            ))
          ) : (
            <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
              <svg
                className="mx-auto h-12 w-12 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="mt-4 text-gray-400">
                No se encontraron usuarios que coincidan con la búsqueda.
              </p>
            </div>
          )}
        </div>
      </ContentContainer>
    </Modal>
  );
};

export default UserPermissionsModal;
