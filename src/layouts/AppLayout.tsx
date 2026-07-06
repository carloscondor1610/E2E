import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const dashboardPath = user?.role === "DRIVER" ? "/driver/dashboard" : "/passenger/dashboard";

  return (
    <div className="app-layout">
      <header className="topbar">
        <Link to={dashboardPath} className="brand-link">
          Uber
        </Link>
        <nav className="topbar-nav">
          {user ? (
            <>
              <Link to={dashboardPath}>Dashboard</Link>
              <Link to="/history">Historial</Link>
              <span className="user-chip">{user.firstName} · {user.role === "DRIVER" ? "Conductor" : "Pasajero"}</span>
              <button type="button" className="link-button" onClick={handleLogout}>Salir</button>
            </>
          ) : (
            <>
              <Link to="/login">Iniciar sesión</Link>
              <Link to="/register">Registrarse</Link>
            </>
          )}
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
