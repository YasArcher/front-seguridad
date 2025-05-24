import { useState } from "react";
import SidebarItem from "./SidebarItem";
import { useSidebarMenu } from "../../hooks/useSidebarMenu";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarItems = useSidebarMenu();

  return (
    <div
      className={`h-screen bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      } relative`}
    >
      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-12 bg-white border border-gray-200 rounded-full p-1 shadow-md hover:shadow-lg transition-all z-10 text-gray-500 hover:text-gray-700"
        aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-transparent">
        <div className={`transition-all duration-300 ${collapsed ? "items-center" : ""}`}>
          <h2 className={`text-sm font-bold text-amber-500 uppercase tracking-wide ${collapsed ? "text-center" : ""}`}>
            {collapsed ? "Inicio" : "Inicio"}
          </h2>
          <h3 className={`text-gray-900 text-lg font-bold mt-1 ${collapsed ? "hidden" : "block"}`}>Archivos</h3>
        </div>
      </div>
      {/* Menu items */}
      <div className={`${collapsed ? "p-1" : "p-2"} space-y-1 overflow-y-auto sidebar-scroll`}>
        {sidebarItems.map((item) => (
          <SidebarItem key={item.id} {...item} collapsed={collapsed} />
        ))}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
        <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
          <div className={`h-2 w-2 rounded-full bg-green-500 ${collapsed ? "" : "animate-pulse"}`}></div>
          {!collapsed && <span className="text-xs text-gray-500">Conectado</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;