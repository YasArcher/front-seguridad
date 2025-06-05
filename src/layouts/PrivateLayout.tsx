import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/ui/Sidebar";
import Navbar from "../components/ui/Navbar";

const rutasConSidebar = [
  "/gestion-archivos",
  "/usuarios-permitidos",
  "/configuracion-archivos",
  "/perfil",
  "/verificacion-firma",
];

const PrivateLayout = () => {
  const location = useLocation();
  const mostrarSidebar = rutasConSidebar.some((ruta) =>
    location.pathname.startsWith(ruta)
  );

  return (
    <div className="flex h-screen">
      {mostrarSidebar && <Sidebar />}
      <div className={`${mostrarSidebar ? "flex-1" : "w-full"} flex flex-col`}>
        {/* Navbar en la parte superior */}
        <Navbar />
        <main
          className="flex-1 overflow-hidden bg-[#1e1e1e]"
          style={{ height: "calc(100vh - 64px)" }} // Ajuste exacto para no desbordar
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PrivateLayout;
