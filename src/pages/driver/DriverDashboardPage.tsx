import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export function DriverDashboardPage() {
  const { user } = useAuth();

  return (
    <main className="dashboard-page">
      <section className="dashboard-hero black-dashboard-hero">
        <p className="eyebrow">Conductor</p>
        <h1>Hola, {user?.firstName}</h1>
        <p>Tu sesión está activa. En los siguientes bloques conectaremos viajes pendientes, aceptación y finalización.</p>
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card featured-card">
          <h2>Viajes pendientes</h2>
          <p>Próximo avance: lista de solicitudes disponibles para aceptar.</p>
          <button type="button" className="primary-button" disabled>Disponible en el siguiente bloque</button>
        </article>

        <article className="dashboard-card">
          <h2>Estado</h2>
          <p>{user?.available ? "Disponible" : "Ocupado"}</p>
        </article>

        <article className="dashboard-card">
          <h2>Cuenta</h2>
          <p>{user?.email}</p>
          <Link to="/passenger/dashboard" className="small-link">Probar protección de rol</Link>
        </article>
      </section>
    </main>
  );
}
