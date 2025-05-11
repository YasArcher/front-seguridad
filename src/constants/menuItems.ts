import { FiFileText, FiSettings, FiShield } from "react-icons/fi";
import type { SidebarItemProps } from "../components/ui/types/SidebarItemProps";

export const menuItems: SidebarItemProps[] = [
  {
    id: "archivos",
    path: "/gestion-archivos",
    icon: FiFileText,
    iconColor: "text-blue-500",
    title: "Gestión de Archivos",
    description: "Sube, organiza y edita archivos",
  },
  {
    id: "configuracion",
    path: "/configuracion-archivos",
    icon: FiSettings,
    iconColor: "text-amber-500",
    title: "Panel de Configuración",
    description: "Control del sistema",
  },
  {
    id: "auditoria",
    path: "/usuarios-permitidos",
    icon: FiShield,
    iconColor: "text-rose-500",
    title: "Auditoría y Seguridad",
    description: "Historial y permisos",
  },
];