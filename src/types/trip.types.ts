import type { User } from "./user.types";

export type TripStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

export interface Trip {
  id: number;
  status: TripStatus;
  pickupAddress: string;
  dropoffAddress: string;
  requestedAt: string;
  acceptedAt: string | null;
  completedAt: string | null;
  passenger: User;
  driver: User | null;
  passengerRating: number | null;
  ratingComment: string | null;
}

export interface CreateTripRequest {
  pickupAddress: string;
  dropoffAddress: string;
}

export interface RateTripRequest {
  rating: number;
  comment?: string;
}
