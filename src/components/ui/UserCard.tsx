import { useState } from "react";
import type { FC } from "react";
import { UserCircle, Calendar, Eye, Shield, UserX } from "lucide-react";
import SwitchToggle from "./SwitchToggle";
import type { UserCardProps } from "./types/UserCardProps";
import InfoBlock from "./InfoBlock";
import { useUpdateUserStatus } from "../../hooks/useUpdateUserStatus";
import Button from "./Button";
import { toast } from "react-toastify";
import UserDetailsModal from "./UserDetailsModal";

const UserCard: FC<UserCardProps> = ({
  id,
  name,
  lastLogin,
  is_active,
  loginCount,
  lastDownload,
  avatarUrl,
  onPermissionsChange,
  can_upload,
  email,
}) => {
  const [stateActive, setStateActive] = useState<boolean>(is_active);
  const [stateUpload, setStateUpload] = useState<boolean>(can_upload ?? false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false); // Estado para el modal
  const { updateUserStatus, error } = useUpdateUserStatus();

  // Función para abrir el modal
  const handleAuditClick = () => {
    setIsAuditModalOpen(true);
  };

  // Función cuando se confirma la auditoría
  const confirmAudit = () => {
    toast.success(`Auditoría de ${name} confirmada.`);
    setIsAuditModalOpen(false);
  };

  // Cambiar el estado de login
  const handleLoginChange = async (newValue: boolean) => {
    const success = await updateUserStatus(id, newValue, stateUpload);
    if (success) {
      setStateActive(newValue);
      toast.success(`Permisos actualizados para ${name}`);
      if (onPermissionsChange) {
        onPermissionsChange({ state: newValue });
      }
    } else {
      toast.error(`Error al actualizar permisos: ${error}`);
    }
  };

  // Cambiar el estado de subida de archivos
  const handleUploadChange = async (newValue: boolean) => {
    const success = await updateUserStatus(id, stateActive, newValue);
    if (success) {
      setStateUpload(newValue);
      toast.success(`Permisos de subida actualizados para ${name}`);
      if (onPermissionsChange) {
        onPermissionsChange({ state: stateActive });
      }
    } else {
      toast.error(`Error al actualizar permisos: ${error}`);
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 transition-all hover:shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-4 p-5 border-b border-gray-100">
        <div className="flex-shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`${name}'s avatar`}
              className="h-14 w-14 rounded-full object-cover border-2 border-blue-100"
            />
          ) : (
            <div className="h-14 w-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <UserCircle size={32} />
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Información del Usuario */}
        <div className="flex-1 p-5">
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
            Información de Usuario
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <InfoBlock
              title="Fecha de creación"
              value={lastLogin}
              icon={<Calendar size={16} className="text-blue-500 mr-2" />}
            />
            <InfoBlock
              title="Última descarga"
              value={lastDownload}
              icon={<Calendar size={16} className="text-blue-500 mr-2" />}
            />
            <Button
              variant="outline"
              size="sm"
              className="w-full md:w-auto"
              label="Ver Auditoría"
              onClick={handleAuditClick}
              iconLeft={<UserX size={16} />}
            />
          </div>
        </div>

        {/* Permisos */}
        <div className="border-t md:border-t-0 md:border-l border-gray-100 p-5 bg-gray-50 md:w-64">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={16} className="text-blue-500" />
            <h4 className="text-sm font-medium text-gray-700">Acceso</h4>
          </div>
          <div className="space-y-1">
            <SwitchToggle
              label="Autorizar Login"
              icon={<Eye size={16} />}
              checked={stateActive}
              onChange={handleLoginChange}
            />
            <SwitchToggle
              label="Autorizar Subida"
              icon={<Eye size={16} />}
              checked={stateUpload}
              onChange={handleUploadChange}
            />
          </div>
        </div>
        <UserDetailsModal
          isOpen={isAuditModalOpen}
          onClose={() => setIsAuditModalOpen(false)}
          email={email}
          userId={id}
        />
      </div>
    </div>
  );
};

export default UserCard;
