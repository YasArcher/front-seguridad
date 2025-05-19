import { menuItems } from "../constants/menuItems";
import { useAuth } from "../Context/AuthContext";
import type { SidebarItemProps } from "../components/ui/types/SidebarItemProps";

export const useSidebarMenu = (): SidebarItemProps[] => {
  const { role } = useAuth();

  return menuItems.filter(item => {
    // Oculta la opción de Auditoría si no es admin
    if (item.id === "auditoria" && role !== "admin") {
      return false;
    }
    return true;
  });
};
