import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { dashboardPathByRole } from "../utils/routes";

export function PublicOnlyRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main className="page-shell centered-page">
        <div className="loading-card">Cargando sesión...</div>
      </main>
    );
  }

  if (user) {
    return <Navigate to={dashboardPathByRole(user.role)} replace />;
  }

  return <Outlet />;
}
