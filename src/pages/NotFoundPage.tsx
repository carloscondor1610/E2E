import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="page-shell centered-page">
      <div className="simple-card">
        <p className="eyebrow dark-text">404</p>
        <h1>Página no encontrada</h1>
        <p>La ruta que intentaste abrir no existe.</p>
        <Link to="/login" className="primary-link">Volver al inicio</Link>
      </div>
    </main>
  );
}
