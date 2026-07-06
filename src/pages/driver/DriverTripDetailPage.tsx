import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { completeTrip, getTripById } from "../../api/trips.api";
import { useAuth } from "../../auth/AuthContext";
import { ErrorMessage } from "../../components/ErrorMessage";
import { InlineLoader } from "../../components/InlineLoader";
import { StatusBadge } from "../../components/StatusBadge";
import type { Trip } from "../../types/trip.types";
import { formatDateTime, formatUserName } from "../../utils/format";

export function DriverTripDetailPage() {
  const { id } = useParams();
  const { refreshUser } = useAuth();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [isCompleting, setIsCompleting] = useState(false);
  const [completedMessage, setCompletedMessage] = useState("");

  const loadTrip = useCallback(async () => {
    if (!id) {
      setError("No se encontró el identificador del viaje.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const data = await getTripById(id);
      setTrip(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar el viaje.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadTrip();
  }, [loadTrip]);

  const handleComplete = async () => {
    if (!trip) return;

    setActionError("");
    setCompletedMessage("");
    setIsCompleting(true);
    try {
      const completed = await completeTrip(trip.id);
      setTrip(completed);
      setCompletedMessage("Viaje completado correctamente. Ya puedes aceptar nuevas solicitudes.");
      await refreshUser();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "No se pudo completar el viaje.");
    } finally {
      setIsCompleting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="dashboard-page">
        <InlineLoader message="Cargando detalle del viaje..." />
      </main>
    );
  }

  if (error || !trip) {
    return (
      <main className="page-shell centered-page">
        <section className="simple-card wide-simple-card">
          <p className="eyebrow dark-text">Detalle conductor</p>
          <h1>No se pudo abrir el viaje</h1>
          <ErrorMessage message={error || "Viaje no disponible."} />
          <Link to="/driver/dashboard" className="primary-link">
            Volver al dashboard
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-page trip-detail-page driver-trip-detail-page">
      <section className="dashboard-hero trip-detail-hero black-dashboard-hero">
        <div>
          <p className="eyebrow">Viaje #{trip.id}</p>
          <h1>{trip.pickupAddress}</h1>
          <p>{trip.status === "COMPLETED" ? "Este recorrido ya fue completado." : "Revisa los datos antes de finalizar el viaje."}</p>
        </div>
        <StatusBadge status={trip.status} />
      </section>

      <section className="trip-detail-grid">
        <article className="detail-card main-detail-card">
          <div className="section-heading compact-heading">
            <div>
              <p className="eyebrow dark-text">Ruta</p>
              <h2>Recorrido asignado</h2>
            </div>
          </div>

          <div className="trip-route large-route">
            <div className="route-dot route-dot-start" />
            <div>
              <span>Pickup</span>
              <strong>{trip.pickupAddress}</strong>
            </div>
            <div className="route-line" />
            <div className="route-dot route-dot-end" />
            <div>
              <span>Dropoff</span>
              <strong>{trip.dropoffAddress}</strong>
            </div>
          </div>

          <div className="detail-meta-grid">
            <div>
              <span>Solicitado</span>
              <strong>{formatDateTime(trip.requestedAt)}</strong>
            </div>
            <div>
              <span>Aceptado</span>
              <strong>{formatDateTime(trip.acceptedAt)}</strong>
            </div>
            <div>
              <span>Finalizado</span>
              <strong>{formatDateTime(trip.completedAt)}</strong>
            </div>
          </div>
        </article>

        <aside className="detail-card driver-detail-card">
          <p className="eyebrow dark-text">Pasajero</p>
          <h2>{formatUserName(trip.passenger.firstName, trip.passenger.lastName)}</h2>
          <p>{trip.passenger.email}</p>

          {trip.status === "IN_PROGRESS" ? (
            <button type="button" className="primary-button full-width-button" disabled={isCompleting} onClick={() => void handleComplete()}>
              {isCompleting ? "Completando..." : "Completar viaje"}
            </button>
          ) : null}

          {trip.status === "COMPLETED" ? (
            <div className="completion-summary">
              <strong>Resumen</strong>
              <p>Viaje completado el {formatDateTime(trip.completedAt)}.</p>
              <p>El pasajero podrá calificar este recorrido desde su detalle.</p>
            </div>
          ) : null}

          <ErrorMessage message={actionError} />
          {completedMessage ? <div className="success-message">{completedMessage}</div> : null}

          <Link to="/driver/dashboard" className="secondary-button full-width-button">
            Volver al dashboard
          </Link>
        </aside>
      </section>
    </main>
  );
}
