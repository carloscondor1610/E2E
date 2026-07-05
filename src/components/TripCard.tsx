import { Link } from "react-router-dom";
import { StatusBadge } from "./StatusBadge";
import type { Trip } from "../types/trip.types";
import { formatDateTime, formatRating, formatUserName } from "../utils/format";

interface TripCardProps {
  trip: Trip;
}

export function TripCard({ trip }: TripCardProps) {
  const driverName = trip.driver
    ? formatUserName(trip.driver.firstName, trip.driver.lastName)
    : "Buscando conductor";

  return (
    <article className="trip-card">
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
          <span>Origen</span>
          <strong>{trip.pickupAddress}</strong>
        </div>
        <div className="route-line" />
        <div className="route-dot route-dot-end" />
        <div>
          <span>Destino</span>
          <strong>{trip.dropoffAddress}</strong>
        </div>
      </div>

      <div className="trip-meta-grid">
        <div>
          <span>Solicitado</span>
          <strong>{formatDateTime(trip.requestedAt)}</strong>
        </div>
        <div>
          <span>Conductor</span>
          <strong>{driverName}</strong>
        </div>
        <div>
          <span>Rating</span>
          <strong>{trip.driver ? formatRating(trip.driver.rating) : "Pendiente"}</strong>
        </div>
      </div>

      <Link to={`/passenger/trips/${trip.id}`} className="trip-link">
        Ver detalle
      </Link>
    </article>
  );
}
