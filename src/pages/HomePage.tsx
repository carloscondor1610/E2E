import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { getHomePathByRole } from '../utils/routes';

export function HomePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <main className="page-center">Cargando...</main>;
  }

  if (user) {
    return <Navigate to={getHomePathByRole(user.role)} replace />;
  }

  return <Navigate to="/login" replace />;
}
