export type Role = "PASSENGER" | "DRIVER";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  available: boolean;
  rating: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
}
