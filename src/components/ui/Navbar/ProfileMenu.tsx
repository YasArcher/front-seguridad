import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { useUserProfile } from "../../../hooks/useUserProfile";

// Componente para el menú de perfil mejorado
const ProfileMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { profile, loading } = useUserProfile();

  const userName = profile
    ? `${profile.first_name} ${profile.last_name}`
    : "Usuario";

  // Datos de usuario - En un caso real vendrían de un contexto o API
  const user = {
    avatarUrl: "", // URL de la imagen si existe
  };
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirige al Login
  };

  // Función para alternar el menú
  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) return <div>Cargando perfil...</div>;

  return (
    <div className="relative" ref={menuRef}>
      {/* Botón de perfil */}
      <button
        onClick={toggleMenu}
        className="flex items-center gap-2 p-2 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-expanded={menuOpen}
        aria-haspopup="true"
      >
        {/* Avatar */}
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt="Avatar de usuario"
            className="w-8 h-8 rounded-full object-cover border-2 border-blue-500"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-md">
            {userName.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Nombre del usuario */}
        <span className="font-medium text-sm dark:text-white hidden sm:inline">
          {userName}
        </span>

        {/* Icono de flecha */}
        <ChevronDown
          size={16}
          className={`text-gray-500 transition-transform duration-300 ${
            menuOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Menú desplegable */}
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50 transition-all duration-300 transform origin-top-right">
          {/* Encabezado del menú con avatar */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center space-x-3">
              {/* Avatar en el menú */}
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="Avatar de usuario"
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Nombre de usuario */}
              <span className="font-semibold dark:text-white">{userName}</span>
            </div>
          </div>

          {/* Opciones del menú */}
          <nav className="py-2">
            {/* Mi Perfil */}
            <button
              onClick={() => console.log("Ver Perfil")}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <User
                size={18}
                className="mr-3 text-gray-500 dark:text-gray-400"
              />
              <span>Mi Perfil</span>
            </button>

            {/* Configuración */}
            <button
              onClick={() => console.log("Configuraciones")}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <Settings
                size={18}
                className="mr-3 text-gray-500 dark:text-gray-400"
              />
              <span>Configuración</span>
            </button>

            {/* Separador */}
            <div className="my-2 border-t border-gray-200 dark:border-gray-700"></div>

            {/* Cerrar Sesión */}
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-500 dark:hover:bg-red-900/20 transition-colors duration-200"
            >
              <LogOut size={18} className="mr-3 text-red-500" />
              <span>Cerrar Sesión</span>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;