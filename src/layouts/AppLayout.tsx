import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/">
          Uber
        </Link>

        <nav className="topbar-actions">
          {user ? (
            <>
              <span className="user-pill">
                {user.firstName} · {user.role}
              </span>
              <button className="secondary-button" onClick={handleLogout} type="button">
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Iniciar sesión</Link>
              <Link className="nav-cta" to="/register">Registrarse</Link>
            </>
          )}
        </nav>
      </header>

      <Outlet />
    </div>
  );
}
