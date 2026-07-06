import { apiRequest } from "./http";
import type { CreateTripRequest, RateTripRequest, Trip } from "../types/trip.types";
import type { User } from "../types/user.types";

export function getPassengerTrips(): Promise<Trip[]> {
  return apiRequest<Trip[]>("/trips");
}

export function getDriverTrips(): Promise<Trip[]> {
  return apiRequest<Trip[]>("/trips/my");
}

export function getPendingTrips(): Promise<Trip[]> {
  return apiRequest<Trip[]>("/trips/pending");
}

export function getAvailableDrivers(): Promise<User[]> {
  return apiRequest<User[]>("/drivers/available");
}

export function createTrip(body: CreateTripRequest): Promise<Trip> {
  return apiRequest<Trip>("/trips", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function getTripById(id: number | string): Promise<Trip> {
  return apiRequest<Trip>(`/trips/${id}`);
}

export function acceptTrip(id: number | string): Promise<Trip> {
  return apiRequest<Trip>(`/trips/${id}/accept`, {
    method: "PATCH",
  });
}

export function completeTrip(id: number | string): Promise<Trip> {
  return apiRequest<Trip>(`/trips/${id}/complete`, {
    method: "PATCH",
  });
}

export function rateTrip(id: number | string, body: RateTripRequest): Promise<Trip> {
  return apiRequest<Trip>(`/trips/${id}/rate`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
