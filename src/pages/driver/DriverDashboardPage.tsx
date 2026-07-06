import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { acceptTrip, completeTrip, getDriverTrips, getPendingTrips } from "../../api/trips.api";
import { useAuth } from "../../auth/AuthContext";
import { EmptyState } from "../../components/EmptyState";
import { ErrorMessage } from "../../components/ErrorMessage";
import { InlineLoader } from "../../components/InlineLoader";
import { StatusBadge } from "../../components/StatusBadge";
import type { Trip } from "../../types/trip.types";
import { formatDateTime, formatRating, formatUserName } from "../../utils/format";

function orderTrips(trips: Trip[]): Trip[] {
  return [...trips].sort(
    (a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime(),
  );
}

function DriverTripSummaryCard({
  trip,
  action,
  detailPath,
}: {
  trip: Trip;
  action?: React.ReactNode;
  detailPath?: string;
}) {
  return (
    <article className="driver-trip-card">
      <div className="trip-card-header">
        <div>
          <p className="trip-label">Viaje #{trip.id}</p>
          <h3>{trip.pickupAddress}</h3>
        </div>
        <StatusBadge status={trip.status} />
      </div>

      <div className="trip-route">
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

      <div className="trip-meta-grid">
        <div>
          <span>Pasajero</span>
          <strong>{formatUserName(trip.passenger.firstName, trip.passenger.lastName)}</strong>
        </div>
        <div>
          <span>Solicitado</span>
          <strong>{formatDateTime(trip.requestedAt)}</strong>
        </div>
        <div>
          <span>Finalizado</span>
          <strong>{formatDateTime(trip.completedAt)}</strong>
        </div>
      </div>

      <div className="card-actions-row">
        {detailPath ? (
          <Link to={detailPath} className="secondary-button compact-button">
            Ver detalle
          </Link>
        ) : null}
        {action}
      </div>
    </article>
  );
}

export function DriverDashboardPage() {
  const { user, refreshUser } = useAuth();
  const [pendingTrips, setPendingTrips] = useState<Trip[]>([]);
  const [driverTrips, setDriverTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [actingTripId, setActingTripId] = useState<number | null>(null);

  const loadDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const [pendingData, myTripsData] = await Promise.all([getPendingTrips(), getDriverTrips()]);
      setPendingTrips(orderTrips(pendingData));
      setDriverTrips(orderTrips(myTripsData));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar el dashboard del conductor.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const activeTrip = useMemo(
    () => driverTrips.find((trip) => trip.status === "IN_PROGRESS") ?? null,
    [driverTrips],
  );

  const completedTrips = useMemo(
    () => driverTrips.filter((trip) => trip.status === "COMPLETED"),
    [driverTrips],
  );

  const handleAccept = async (tripId: number) => {
    setActionError("");
    setActingTripId(tripId);
    try {
      const accepted = await acceptTrip(tripId);
      setPendingTrips((current) => current.filter((trip) => trip.id !== tripId));
      setDriverTrips((current) => orderTrips([accepted, ...current.filter((trip) => trip.id !== tripId)]));
      await refreshUser();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "No se pudo aceptar el viaje.");
      await loadDashboard();
    } finally {
      setActingTripId(null);
    }
  };

  const handleComplete = async (tripId: number) => {
    setActionError("");
    setActingTripId(tripId);
    try {
      const completed = await completeTrip(tripId);
      setDriverTrips((current) => orderTrips(current.map((trip) => (trip.id === tripId ? completed : trip))));
      await refreshUser();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "No se pudo completar el viaje.");
      await loadDashboard();
    } finally {
      setActingTripId(null);
    }
  };

  return (
    <main className="dashboard-page driver-dashboard-page">
      <section className="dashboard-hero black-dashboard-hero driver-hero">
        <div>
          <p className="eyebrow">Conductor</p>
          <h1>Hola, {formatUserName(user?.firstName, user?.lastName)}</h1>
          <p>Revisa solicitudes pendientes, acepta un viaje y complétalo cuando termines el recorrido.</p>
        </div>
        <div className="driver-rating-card">
          <span>Tu rating</span>
          <strong>{formatRating(user?.rating)}</strong>
          <small>{user?.available ? "Disponible" : "En viaje"}</small>
        </div>
      </section>

      {isLoading ? <InlineLoader message="Cargando solicitudes y tus viajes..." /> : null}
      {error ? <div className="dashboard-error" role="alert">{error}</div> : null}
      <ErrorMessage message={actionError} />

      {!isLoading && !error ? (
        <>
          <section className="content-section active-trip-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow dark-text">Viaje activo</p>
                <h2>En progreso</h2>
              </div>
              <Link to="/history" className="secondary-button">
                Historial
              </Link>
            </div>

            {activeTrip ? (
              <DriverTripSummaryCard
                trip={activeTrip}
                detailPath={`/driver/trips/${activeTrip.id}`}
                action={
                  <button
                    type="button"
                    className="primary-button compact-button"
                    disabled={actingTripId === activeTrip.id}
                    onClick={() => void handleComplete(activeTrip.id)}
                  >
                    {actingTripId === activeTrip.id ? "Completando..." : "Completar viaje"}
                  </button>
                }
              />
            ) : (
              <EmptyState
                title="No tienes viaje activo"
                message="Cuando aceptes una solicitud pendiente, aparecerá destacada aquí."
              />
            )}
          </section>

          <section className="content-section pending-trips-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow dark-text">Solicitudes</p>
                <h2>Viajes pendientes</h2>
              </div>
              <button type="button" className="secondary-button" onClick={() => void loadDashboard()}>
                Actualizar
              </button>
            </div>

            {pendingTrips.length === 0 ? (
              <EmptyState
                title="No hay solicitudes pendientes"
                message="Cuando un pasajero cree un viaje nuevo, aparecerá aquí para que puedas aceptarlo."
              />
            ) : (
              <div className="trips-list">
                {pendingTrips.map((trip) => (
                  <DriverTripSummaryCard
                    key={trip.id}
                    trip={trip}
                    action={
                      <button
                        type="button"
                        className="primary-button compact-button"
                        disabled={Boolean(activeTrip) || actingTripId === trip.id}
                        onClick={() => void handleAccept(trip.id)}
                        title={activeTrip ? "Completa tu viaje activo antes de aceptar otro." : undefined}
                      >
                        {actingTripId === trip.id ? "Aceptando..." : "Aceptar"}
                      </button>
                    }
                  />
                ))}
              </div>
            )}
          </section>

          <section className="content-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow dark-text">Resumen</p>
                <h2>Viajes completados</h2>
              </div>
            </div>
            <div className="dashboard-stats driver-stats">
              <article>
                <span>Total propio</span>
                <strong>{driverTrips.length}</strong>
              </article>
              <article>
                <span>Pendientes globales</span>
                <strong>{pendingTrips.length}</strong>
              </article>
              <article>
                <span>En progreso</span>
                <strong>{activeTrip ? 1 : 0}</strong>
              </article>
              <article>
                <span>Completados</span>
                <strong>{completedTrips.length}</strong>
              </article>
            </div>
          </section>
        </>
      ) : null}
    </main>
  );
}
