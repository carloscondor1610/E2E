import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTripById, rateTrip } from "../../api/trips.api";
import { ErrorMessage } from "../../components/ErrorMessage";
import { InlineLoader } from "../../components/InlineLoader";
import { RatingForm } from "../../components/RatingForm";
import { StatusBadge } from "../../components/StatusBadge";
import type { Trip } from "../../types/trip.types";
import { formatDateTime, formatRating, formatUserName } from "../../utils/format";

const POLLING_MS = 4000;

export function PassengerTripDetailPage() {
  const { id } = useParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [ratingSuccess, setRatingSuccess] = useState("");
  const [isRatingSubmitting, setIsRatingSubmitting] = useState(false);

  const loadTrip = useCallback(
    async (showLoader = false) => {
      if (!id) {
        setError("No se encontró el identificador del viaje.");
        setIsLoading(false);
        return;
      }

      try {
        if (showLoader) setIsLoading(true);
        const data = await getTripById(id);
        setTrip(data);
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo cargar el viaje.");
      } finally {
        setIsLoading(false);
      }
    },
    [id],
  );

  useEffect(() => {
    void loadTrip(true);
  }, [loadTrip]);

  useEffect(() => {
    if (!trip || trip.status === "COMPLETED") return undefined;

    const intervalId = window.setInterval(() => {
      void loadTrip(false);
    }, POLLING_MS);

    return () => window.clearInterval(intervalId);
  }, [loadTrip, trip]);

  const driverName = useMemo(() => {
    if (!trip?.driver) return "Buscando conductor...";
    return formatUserName(trip.driver.firstName, trip.driver.lastName);
  }, [trip]);

  const canRate = trip?.status === "COMPLETED" && trip.passengerRating === null;

  const handleRate = async (rating: number, comment: string) => {
    if (!trip) return;

    setIsRatingSubmitting(true);
    setRatingSuccess("");
    try {
      const updatedTrip = await rateTrip(trip.id, { rating, comment: comment || undefined });
      setTrip(updatedTrip);
      setRatingSuccess("Calificación enviada correctamente.");
    } finally {
      setIsRatingSubmitting(false);
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
          <p className="eyebrow dark-text">Detalle</p>
          <h1>No se pudo abrir el viaje</h1>
          <ErrorMessage message={error || "Viaje no disponible."} />
          <Link to="/passenger/dashboard" className="primary-link">
            Volver al dashboard
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-page trip-detail-page">
      <section className="dashboard-hero trip-detail-hero">
        <div>
          <p className="eyebrow dark-text">Viaje #{trip.id}</p>
          <h1>{trip.pickupAddress}</h1>
          <p>{trip.status === "COMPLETED" ? "Tu viaje ha finalizado." : "Seguimos actualizando el estado de tu solicitud."}</p>
        </div>
        <StatusBadge status={trip.status} />
      </section>

      <section className="trip-detail-grid">
        <article className="detail-card main-detail-card">
          <div className="section-heading compact-heading">
            <div>
              <p className="eyebrow dark-text">Ruta</p>
              <h2>Detalle del recorrido</h2>
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
          <p className="eyebrow dark-text">Conductor</p>
          <h2>{driverName}</h2>
          {trip.driver ? (
            <p>Rating {formatRating(trip.driver.rating)} · {trip.driver.email}</p>
          ) : (
            <p>Buscando conductor disponible. Esta pantalla se actualiza automáticamente cada 4 segundos.</p>
          )}
          <Link to="/passenger/dashboard" className="secondary-button full-width-button">
            Volver al dashboard
          </Link>
        </aside>
      </section>

      <section className="content-section rating-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow dark-text">Calificación</p>
            <h2>Tu experiencia</h2>
          </div>
        </div>

        {canRate ? (
          <RatingForm onSubmit={handleRate} isSubmitting={isRatingSubmitting} />
        ) : null}

        {!canRate && trip.passengerRating !== null ? (
          <div className="rated-card">
            <strong>Ya calificaste este viaje con {trip.passengerRating} estrella{trip.passengerRating === 1 ? "" : "s"}.</strong>
            {trip.ratingComment ? <p>{trip.ratingComment}</p> : null}
          </div>
        ) : null}

        {!canRate && trip.passengerRating === null && trip.status !== "COMPLETED" ? (
          <div className="rated-card muted-rated-card">
            La calificación estará disponible cuando el conductor complete el viaje.
          </div>
        ) : null}

        {ratingSuccess ? <div className="success-message">{ratingSuccess}</div> : null}
      </section>
    </main>
  );
}
