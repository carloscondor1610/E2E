import { Link } from "react-router-dom";

export function PassengerTripDetailPage() {
  return (
    <main className="page-shell centered-page">
      <section className="simple-card wide-simple-card">
        <p className="eyebrow dark-text">Detalle</p>
        <h1>Detalle del viaje</h1>
        <p>La vista detallada del viaje se conectará en el próximo avance del flujo del pasajero.</p>
        <Link to="/passenger/dashboard" className="primary-link">
          Volver al dashboard
        </Link>
      </section>
    </main>
  );
}
