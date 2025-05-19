import type { FC } from "react";
import type { FileCardProps } from "./types/FileCardProps";
import Button from "./Button";

const FileCard: FC<FileCardProps> = ({
  icon,
  title,
  accessType,
  type,
  size,
  lastModified,
  onDownload,
  onDelete,
  onEdit,
  onUserPermissions,
  onViewKey,
  className = "",
}) => {
  // Iconos para los botones (puedes reemplazarlos con tus propios iconos)
  const DownloadIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  );

  const DeleteIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  );

  const EditIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  );

  const UsersIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );

  const EyeIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );

  // Determinar el color del borde según el tipo de archivo
  const getBorderColor = () => {
    switch (type?.toLowerCase()) {
      case "pdf":
        return "border-red-200";
      case "doc":
      case "docx":
        return "border-blue-200";
      case "xls":
      case "xlsx":
        return "border-green-200";
      case "ppt":
      case "pptx":
        return "border-orange-200";
      case "img":
      case "png":
      case "jpg":
      case "jpeg":
        return "border-purple-200";
      default:
        return "border-gray-200";
    }
  };

  return (
    <div
      className={`flex flex-col md:flex-row gap-4 p-5 bg-white border-l-4 ${getBorderColor()} rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}
    >
      <div className="flex-shrink-0 flex items-center justify-center">
        <div className="bg-gray-50 p-3 rounded-lg">
          <img
            src={icon}
            alt={`${type} icon`}
            className="w-14 h-14 object-contain"
          />
        </div>
      </div>

      <div className="flex-grow">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            {/* Agrega este bloque en la sección de encabezado de la tarjeta, justo debajo del título */}
            {accessType && (
              <span
                className={`inline-block px-2 py-1 text-xs font-semibold rounded-full 
    ${
      accessType === "own"
        ? "bg-green-100 text-green-800"
        : "bg-yellow-100 text-yellow-800"
    }`}
              >
                {accessType === "own" ? "Propio" : "Compartido"}
              </span>
            )}

            {/* Info adicional del archivo */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
              {type && (
                <span className="flex items-center">
                  <span className="font-medium">Tipo:</span>
                  <span className="ml-1 uppercase">{type}</span>
                </span>
              )}
              {size && (
                <span className="flex items-center">
                  <span className="font-medium">Tamaño:</span>
                  <span className="ml-1">{size}</span>
                </span>
              )}
              {lastModified && (
                <span className="flex items-center">
                  <span className="font-medium">Modificado:</span>
                  <span className="ml-1">{lastModified}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {/* Grupo de botones principales */}
          <div className="flex flex-wrap gap-2">
            {onDownload && (
              <Button
                label="Descargar"
                variant="primary"
                size="xs"
                onClick={onDownload}
                iconLeft={<DownloadIcon />}
                rounded="md"
              />
            )}
            {onEdit && (
              <Button
                label="Editar"
                variant="light"
                size="xs"
                onClick={onEdit}
                iconLeft={<EditIcon />}
                rounded="md"
              />
            )}
          </div>

          {/* Separador */}
          <div className="hidden md:block mx-1 border-r border-gray-200 h-6 self-center"></div>

          {/* Grupo de botones secundarios */}
          <div className="flex flex-wrap gap-2">
            {onUserPermissions && (
              <Button
                label="Permisos"
                variant="outline"
                size="xs"
                onClick={onUserPermissions}
                iconLeft={<UsersIcon />}
                rounded="md"
              />
            )}
            {onViewKey && (
              <Button
                label="Ver"
                variant="outline"
                size="xs"
                onClick={onViewKey}
                iconLeft={<EyeIcon />}
                rounded="md"
              />
            )}
            {onDelete && (
              <Button
                label="Eliminar"
                variant="danger"
                size="xs"
                onClick={onDelete}
                iconLeft={<DeleteIcon />}
                rounded="md"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileCard;