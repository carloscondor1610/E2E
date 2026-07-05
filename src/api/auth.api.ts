import { apiRequest } from "./http";
import type { AuthResponse, LoginRequest, RegisterRequest, User } from "../types/user.types";

export function loginRequest(body: LoginRequest): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function registerRequest(body: RegisterRequest): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function getCurrentUser(): Promise<User> {
  return apiRequest<User>("/users/me");
}
