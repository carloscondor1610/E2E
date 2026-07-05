import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export function PassengerDashboardPage() {
  const { user } = useAuth();

  return (
    <main className="dashboard-page">
      <section className="dashboard-hero">
        <p className="eyebrow dark-text">Pasajero</p>
        <h1>Hola, {user?.firstName}</h1>
        <p>Tu sesión está activa. En el siguiente bloque conectaremos tus viajes y la solicitud de nuevos recorridos.</p>
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card featured-card">
          <h2>Solicitar viaje</h2>
          <p>Próximo avance: formulario de origen, destino y creación de viaje.</p>
          <button type="button" className="primary-button" disabled>Disponible en el siguiente bloque</button>
        </article>

        <article className="dashboard-card">
          <h2>Mis viajes</h2>
          <p>Aquí aparecerá tu historial como pasajero.</p>
        </article>

        <article className="dashboard-card">
          <h2>Cuenta</h2>
          <p>{user?.email}</p>
          <Link to="/driver/dashboard" className="small-link">Probar protección de rol</Link>
        </article>
      </section>
    </main>
  );
}
