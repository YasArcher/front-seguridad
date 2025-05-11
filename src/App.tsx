import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
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

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  return token ? <Navigate to="/gestion-archivos" replace /> : <>{children}</>;
};

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/" replace />;
};

const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route
      path="/"
      element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      }
    />
    <Route
      path="/register"
      element={
        <PublicRoute>
          <RegisterPage />
        </PublicRoute>
      }
    />
    <Route
      path="/forgot-password"
      element={
        <PublicRoute>
          <ForgotPasswordPage />
        </PublicRoute>
      }
    />

    {/* Private Routes */}
    <Route
      element={
        <ProtectedRoute>
          <PrivateLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/gestion-archivos" element={<GestionArchivos />} />
      <Route
        path="/configuracion-archivos"
        element={<ConfiguracionArchivos />}
      />
      <Route path="/usuarios-permitidos" element={<SuperAdmin />} />
    </Route>

    {/* Catch-all Redirect */}
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

const App = () => (
  <Router>
    <AppRoutes />
  </Router>
);

export default App;