import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

interface RoleProtectedRouteProps {
  allowedRoles: string[];
}

const RoleProtectedRoute = ({ allowedRoles }: RoleProtectedRouteProps) => {
  const { token, role } = useAuth();

  if (!token) return <Navigate to="/" replace />;
  if (role && allowedRoles.includes(role)) return <Outlet />;
  return <Navigate to="/gestion-archivos" replace />;
};

export default RoleProtectedRoute;
