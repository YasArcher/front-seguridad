import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "./Context/AuthContext";
import PrivateLayout from "./layouts/PrivateLayout";
import GestionArchivos from "./pages/GestionArchivos";
import ConfiguracionArchivos from "./pages/ConfiguracionArchivos";
import SuperAdmin from "./pages/SuperAdmin";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Roles } from "./constants/roles";
import UserProfilePage from "./pages/UserPage";
import VerifySignaturePage from "./pages/VerifySignaturePage";

// Rutas públicas (para usuarios no autenticados)
const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  return token ? <Navigate to="/gestion-archivos" replace /> : <>{children}</>;
};

// Rutas privadas (requieren autenticación)
const ProtectedRoute = () => {
  const { token } = useAuth();
  return token ? <Outlet /> : <Navigate to="/" replace />;
};

// Rutas protegidas por rol
const RoleProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { token, role } = useAuth();
  if (!token) return <Navigate to="/" replace />;
  return role && allowedRoles.includes(role) ? <Outlet /> : <Navigate to="/gestion-archivos" replace />;
};

const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<PublicRoute><LoginPage /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
    <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />

    {/* Private Routes */}
    <Route element={<ProtectedRoute />}>
      {/* Layout privado para rutas autenticadas */}
      <Route element={<PrivateLayout />}>
        <Route path="/gestion-archivos" element={<GestionArchivos />} />
        <Route path="/verificacion-firma" element={<VerifySignaturePage/>} />
        <Route path="/configuracion-archivos" element={<ConfiguracionArchivos />} />
        <Route path="/perfil" element={<UserProfilePage />} />
        

        {/* Rutas anidadas para el layout privado */}
        {/* Rutas protegidas por rol */}

        {/* Ruta solo para ADMIN */}
        <Route element={<RoleProtectedRoute allowedRoles={[Roles.ADMIN]} />}>
          <Route path="/usuarios-permitidos" element={<SuperAdmin />} />
        </Route>
      </Route>
    </Route>

    {/* Catch-all Redirect */}
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

const App = () => (
  <Router>
    <AppRoutes />
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  </Router>
);

export default App;