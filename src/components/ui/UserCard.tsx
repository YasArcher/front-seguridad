import type { FC } from "react";
import { UserCircle, Download, Calendar } from "lucide-react";
import Button from "./Button";
import type { UserCardProps } from "./types/UserCardProps";

const UserCard: FC<UserCardProps> = ({
  name,
  description,
  lastLogin,
  downloadCount,
  lastDownload,
  onRemovePermission,
}) => {
  return (
    <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Avatar o Imagen Placeholder */}
      <div className="flex items-center justify-center md:mr-6 mb-4 md:mb-0">
        <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
          <UserCircle size={48} />
        </div>
      </div>

      {/* Información del Usuario */}
      <div className="flex-1">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-xs text-gray-500 font-medium mb-1">
              Último inicio de sesión
            </div>
            <div className="flex items-center">
              <Calendar size={16} className="text-gray-400 mr-2" />
              <span className="text-gray-700">{lastLogin}</span>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-xs text-gray-500 font-medium mb-1">
              Número de descargas
            </div>
            <div className="flex items-center">
              <Download size={16} className="text-gray-400 mr-2" />
              <span className="text-gray-700">{downloadCount}</span>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-xs text-gray-500 font-medium mb-1">
              Fecha de la última descarga
            </div>
            <div className="flex items-center">
              <Calendar size={16} className="text-gray-400 mr-2" />
              <span className="text-gray-700">{lastDownload}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Botón de Quitar Permiso */}
      <div className="self-center mt-3 md:mt-0 md:ml-4">
        {/* Botón de Quitar Permiso */}
        {onRemovePermission && (
          <Button
            label="Quitar permiso"
            variant="danger"
            size="sm"
            onClick={onRemovePermission}
          />
        )}
      </div>
    </div>
  );
};

export default UserCard;
