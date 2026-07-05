import { apiRequest } from './http';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth.types';
import type { User } from '../types/user.types';

export function login(request: LoginRequest): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: request,
    auth: false,
  });
}

export function register(request: RegisterRequest): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: request,
    auth: false,
  });
}

export function getCurrentUser(): Promise<User> {
  return apiRequest<User>('/users/me');
}
