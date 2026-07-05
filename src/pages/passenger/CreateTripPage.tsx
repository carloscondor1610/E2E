import { Link } from "react-router-dom";

export function CreateTripPage() {
  return (
    <main className="page-shell centered-page">
      <section className="simple-card wide-simple-card">
        <p className="eyebrow dark-text">Nuevo viaje</p>
        <h1>Solicitar viaje</h1>
        <p>Esta pantalla quedará conectada en el siguiente avance con conductores disponibles, origen, destino y confirmación del viaje.</p>
        <Link to="/passenger/dashboard" className="primary-link">
          Volver al dashboard
        </Link>
      </section>
    </main>
  );
}
