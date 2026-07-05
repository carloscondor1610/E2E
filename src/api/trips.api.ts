import { apiRequest } from "./http";
import type { Trip } from "../types/trip.types";
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
