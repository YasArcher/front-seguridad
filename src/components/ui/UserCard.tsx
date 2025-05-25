import { useState } from "react";
import type { FC } from "react";
import { UserCircle, Calendar, Eye, Shield, UserX } from "lucide-react";
import SwitchToggle from "./SwitchToggle";
import type { UserCardProps } from "./types/UserCardProps";
import InfoBlock from "./InfoBlock";
import { useUpdateUserStatus } from "../../hooks/useUpdateUserStatus";
import { toast } from "react-toastify";

const UserCard: FC<UserCardProps> = ({
  id,
  name,
  lastLogin,
  is_active,
  loginCount,
  lastDownload,
  avatarUrl,
  onPermissionsChange,
}) => {
  const [state, setState] = useState<boolean>(is_active); // ✅ Inicializa con is_active solo una vez
  const { updateUserStatus, error } = useUpdateUserStatus();

  const handleViewChange = async (newValue: boolean) => {
    const success = await updateUserStatus(id, newValue);
    if (success) {
      setState(newValue); // ✅ actualiza solo el switch
      toast.success(`Permisos actualizados para ${name}`);
      if (onPermissionsChange) {
        onPermissionsChange({ state: newValue }); // solo si necesitas
      }
    }
    else {
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
              title="Último inicio de sesión"
              value={lastLogin}
              icon={<Calendar size={16} className="text-blue-500 mr-2" />}
            />
            <InfoBlock
              title="Número de inicios de sesión"
              value={loginCount}
              icon={<UserX size={16} className="text-blue-500 mr-2" />}
            />
            <InfoBlock
              title="Última descarga"
              value={lastDownload}
              icon={<Calendar size={16} className="text-blue-500 mr-2" />}
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
              label="Autorizar"
              icon={<Eye size={16} />}
              checked={state} // ✅ usa el estado interno
              onChange={handleViewChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
