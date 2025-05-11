import type { FC } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { twMerge } from "tailwind-merge";

// Extendemos las props para incluir el estado de colapso
interface SidebarItemProps {
  id: string;
  path: string;
  icon: FC<{ size?: number }>;
  iconColor: string;
  title: string;
  description: string;
  collapsed?: boolean;
}

const SidebarItem: FC<SidebarItemProps> = ({ 
  id, 
  path, 
  icon: Icon, 
  iconColor, 
  title, 
  description, 
  collapsed = false 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <button
      key={id}
      onClick={() => navigate(path)}
      className={twMerge(
        "flex items-start gap-3 w-full text-left rounded-lg transition-all",
        collapsed ? "px-2 py-3 justify-center" : "px-4 py-3",
        isActive 
          ? "bg-gradient-to-r from-amber-50 to-amber-100 border-l-4 border-amber-500" 
          : "hover:bg-gray-50 border-l-4 border-transparent"
      )}
      title={collapsed ? title : undefined}
    >
      <div className={`${collapsed ? "" : "mt-1"} ${isActive ? "text-amber-600" : iconColor}`}>
        <Icon size={collapsed ? 22 : 20} />
      </div>
      
      {!collapsed && (
        <div className="min-w-0 flex-1">
          <p className={`font-medium truncate ${isActive ? "text-amber-600" : "text-gray-900"}`}>
            {title}
          </p>
          <p className={`text-xs truncate ${isActive ? "text-amber-500" : "text-gray-500"}`}>
            {description}
          </p>
        </div>
      )}
    </button>
  );
};

export default SidebarItem;