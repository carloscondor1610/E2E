import type { TripStatus } from "../types/trip.types";

interface StatusBadgeProps {
  status: TripStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`status-badge status-${status.toLowerCase()}`}>{status}</span>;
}
