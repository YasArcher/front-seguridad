import type { IconType } from "react-icons";

export interface SidebarItemProps {
  id: string;
  path: string;
  icon: IconType; // Tipo de React Icons
  iconColor: string;
  title: string;
  description: string;
}