import type { FC } from "react";
import { UserCircle, Calendar, Download, Eye, Shield } from "lucide-react";
import SwitchToggle from "./SwitchToggle";
import InfoBlock from "./InfoBlock";
import type { UserPermissionCardProps } from "./types/UserPermissionCardProps";

const UserPermissionCard: FC<UserPermissionCardProps> = ({
  name,
  avatarUrl,
  lastDownload,
  downloadCount,
  onPermissionChange,
  permission_type = "none",
}) => {
  const isViewEnabled =
    permission_type === "view" || permission_type === "both";
  const isDownloadEnabled =
    permission_type === "download" || permission_type === "both";

  const calculatePermission = (
    view: boolean,
    download: boolean
  ): "view" | "download" | "both" | "none" => {
    if (view && download) return "both";
    if (view) return "view";
    if (download) return "download";
    return "none";
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 transition-all hover:shadow-lg">
      <div className="flex items-center p-4 border-b border-gray-100 bg-gray-50">
        <div className="flex-shrink-0 mr-4">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`${name}'s avatar`}
              className="h-14 w-14 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="h-14 w-14 bg-gray-700 text-gray-300 rounded-full flex items-center justify-center">
              <UserCircle size={30} />
            </div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-800">{name}</h3>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="flex-grow p-4">
          {(typeof downloadCount !== "undefined" || lastDownload) && (
            <>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                Información de actividad
              </h4>

              <div className="flex flex-wrap gap-4">
                {typeof downloadCount !== "undefined" && (
                  <InfoBlock
                    title="Total de descargas"
                    value={String(downloadCount)}
                    icon={<Download className="w-4 h-4 text-blue-500 mr-2" />}
                  />
                )}

                {lastDownload && (
                  <InfoBlock
                    title="Última descarga"
                    value={lastDownload}
                    icon={<Calendar className="w-4 h-4 text-green-500 mr-2" />}
                  />
                )}
              </div>
            </>
          )}
        </div>

        <div className="border-t md:border-t-0 md:border-l border-gray-100 bg-gray-50 p-4 md:min-w-56">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={16} className="text-blue-500" />
            <h4 className="text-sm font-medium text-gray-700">Permisos</h4>
          </div>

          <div className="space-y-2">
            <SwitchToggle
              label="Visualizar"
              icon={<Eye size={16} />}
              checked={isViewEnabled}
              onChange={(state) => {
                const newPermission = calculatePermission(
                  state,
                  isDownloadEnabled
                );
                onPermissionChange?.({
                  permission: newPermission,
                  state: true,
                });
              }}
            />
            <SwitchToggle
              label="Descargar"
              icon={<Download size={16} />}
              checked={isDownloadEnabled}
              onChange={(state) => {
                const newPermission = calculatePermission(isViewEnabled, state);
                onPermissionChange?.({
                  permission: newPermission,
                  state: true,
                });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPermissionCard;
