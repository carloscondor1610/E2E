import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getDriverTrips, getPassengerTrips } from "../api/trips.api";
import { useAuth } from "../auth/AuthContext";
import { EmptyState } from "../components/EmptyState";
import { InlineLoader } from "../components/InlineLoader";
import { StatusBadge } from "../components/StatusBadge";
import type { Trip, TripStatus } from "../types/trip.types";
import { formatDateTime, formatRating, formatUserName } from "../utils/format";
import { dashboardPathByRole } from "../utils/routes";

const statusOptions: Array<"ALL" | TripStatus> = ["ALL", "PENDING", "IN_PROGRESS", "COMPLETED"];

function detailPathByRole(role: string, tripId: number): string {
  return role === "DRIVER" ? `/driver/trips/${tripId}` : `/passenger/trips/${tripId}`;
}

export function HistoryPage() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [statusFilter, setStatusFilter] = useState<"ALL" | TripStatus>("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadHistory() {
      if (!user) return;

      try {
        setIsLoading(true);
        setError("");
        const data = user.role === "DRIVER" ? await getDriverTrips() : await getPassengerTrips();
        if (!isMounted) return;
        setTrips(
          [...data].sort(
            (a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime(),
          ),
        );
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "No se pudo cargar el historial.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadHistory();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const filteredTrips = useMemo(() => {
    if (statusFilter === "ALL") return trips;
    return trips.filter((trip) => trip.status === statusFilter);
  }, [trips, statusFilter]);

  return (
    <main className="dashboard-page history-page">
      <section className="dashboard-hero history-hero">
        <div>
          <p className="eyebrow dark-text">Historial</p>
          <h1>Tus viajes</h1>
          <p>Consulta tus recorridos y filtra por estado para revisar solicitudes, viajes activos o completados.</p>
        </div>
        <Link to={user ? dashboardPathByRole(user.role) : "/login"} className="hero-action-button">
          Dashboard
        </Link>
      </section>

      <section className="content-section">
        <div className="section-heading history-heading">
          <div>
            <p className="eyebrow dark-text">Filtro</p>
            <h2>Estado</h2>
          </div>
          <div className="filter-group" aria-label="Filtro por estado">
            {statusOptions.map((status) => (
              <button
                key={status}
                type="button"
                className={statusFilter === status ? "filter-button active" : "filter-button"}
                onClick={() => setStatusFilter(status)}
              >
                {status === "ALL" ? "Todos" : status}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? <InlineLoader message="Cargando historial..." /> : null}
        {error ? <div className="dashboard-error" role="alert">{error}</div> : null}

        {!isLoading && !error && filteredTrips.length === 0 ? (
          <EmptyState
            title="No hay viajes para este filtro"
            message="Cambia el estado seleccionado o crea un nuevo viaje para verlo en tu historial."
          />
        ) : null}

        {!isLoading && !error && filteredTrips.length > 0 ? (
          <div className="history-table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Viaje</th>
                  <th>Ruta</th>
                  <th>Participante</th>
                  <th>Estado</th>
                  <th>Fechas</th>
                  <th>Rating</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filteredTrips.map((trip) => {
                  const participant = user?.role === "DRIVER" ? trip.passenger : trip.driver;
                  return (
                    <tr key={trip.id}>
                      <td>#{trip.id}</td>
                      <td>
                        <strong>{trip.pickupAddress}</strong>
                        <span>{trip.dropoffAddress}</span>
                      </td>
                      <td>{participant ? formatUserName(participant.firstName, participant.lastName) : "Sin conductor"}</td>
                      <td><StatusBadge status={trip.status} /></td>
                      <td>
                        <span>Solicitado: {formatDateTime(trip.requestedAt)}</span>
                        <span>Finalizado: {formatDateTime(trip.completedAt)}</span>
                      </td>
                      <td>{trip.passengerRating ?? (trip.driver ? formatRating(trip.driver.rating) : "Pendiente")}</td>
                      <td>
                        <Link to={detailPathByRole(user?.role ?? "PASSENGER", trip.id)} className="table-link">
                          Ver
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </main>
  );
}
