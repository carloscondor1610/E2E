import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getPassengerTrips } from "../../api/trips.api";
import { EmptyState } from "../../components/EmptyState";
import { InlineLoader } from "../../components/InlineLoader";
import { TripCard } from "../../components/TripCard";
import { useAuth } from "../../auth/AuthContext";
import type { Trip } from "../../types/trip.types";
import { formatUserName } from "../../utils/format";

function countByStatus(trips: Trip[], status: Trip["status"]): number {
  return trips.filter((trip) => trip.status === status).length;
}

export function PassengerDashboardPage() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoadingTrips, setIsLoadingTrips] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadTrips() {
      try {
        setIsLoadingTrips(true);
        setError("");
        const data = await getPassengerTrips();
        if (!isMounted) return;

        const orderedTrips = [...data].sort(
          (a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime(),
        );
        setTrips(orderedTrips);
      } catch (err) {
        if (!isMounted) return;
        const message = err instanceof Error ? err.message : "No se pudieron cargar tus viajes.";
        setError(message);
      } finally {
        if (isMounted) setIsLoadingTrips(false);
      }
    }

    void loadTrips();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(
    () => ({
      total: trips.length,
      pending: countByStatus(trips, "PENDING"),
      inProgress: countByStatus(trips, "IN_PROGRESS"),
      completed: countByStatus(trips, "COMPLETED"),
    }),
    [trips],
  );

  return (
    <main className="dashboard-page passenger-dashboard-page">
      <section className="dashboard-hero passenger-hero">
        <div>
          <p className="eyebrow dark-text">Pasajero</p>
          <h1>Hola, {formatUserName(user?.firstName, user?.lastName)}</h1>
          <p>Gestiona tus viajes, revisa su estado y pide un nuevo recorrido cuando lo necesites.</p>
        </div>
        <Link to="/passenger/trips/new" className="hero-action-button">
          Pedir viaje
        </Link>
      </section>

      <section className="dashboard-stats" aria-label="Resumen de viajes">
        <article>
          <span>Total</span>
          <strong>{stats.total}</strong>
        </article>
        <article>
          <span>PENDING</span>
          <strong>{stats.pending}</strong>
        </article>
        <article>
          <span>IN_PROGRESS</span>
          <strong>{stats.inProgress}</strong>
        </article>
        <article>
          <span>COMPLETED</span>
          <strong>{stats.completed}</strong>
        </article>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow dark-text">Mis viajes</p>
            <h2>Actividad reciente</h2>
          </div>
          <Link to="/passenger/trips/new" className="secondary-button">
            Nuevo viaje
          </Link>
        </div>

        {isLoadingTrips ? <InlineLoader message="Cargando tus viajes..." /> : null}

        {!isLoadingTrips && error ? (
          <div className="dashboard-error" role="alert">
            {error}
          </div>
        ) : null}

        {!isLoadingTrips && !error && trips.length === 0 ? (
          <EmptyState
            title="Aún no tienes viajes"
            message="Cuando solicites un recorrido, aparecerá aquí con su estado actualizado."
            action={
              <Link to="/passenger/trips/new" className="primary-button small-primary-button">
                Pedir mi primer viaje
              </Link>
            }
          />
        ) : null}

        {!isLoadingTrips && !error && trips.length > 0 ? (
          <div className="trips-list">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
