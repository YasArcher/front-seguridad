export interface FileCardProps {
  /** Identificador único del archivo */
  id: string | number;
  
  /** URL o componente del icono del archivo */
  icon: string;
  
  /** Nombre del archivo o título */
  title: string;
  
  /** Tipo de archivo (pdf, doc, xls, etc.) */
  type: string;
  
  /** Descripción corta del archivo */
  description: string;
  
  /** Tamaño del archivo (opcional) */
  size?: string;
  
  /** Fecha de última modificación (opcional) */
  lastModified?: string;
  
  /** Clases personalizadas adicionales */
  className?: string;
  
  /** Función para descargar el archivo */
  onDownload?: () => void;
  
  /** Función para eliminar el archivo */
  onDelete?: () => void;
  
  /** Función para editar el archivo */
  onEdit?: () => void;
  
  /** Función para gestionar usuarios y permisos */
  onUserPermissions?: () => void;
  
  /** Función para gestionar la clave de cifrado */
  onEncryptionKey?: () => void;
}