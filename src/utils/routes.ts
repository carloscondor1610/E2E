import type { Role } from '../types/user.types';

export function getHomePathByRole(role: Role): string {
  return role === 'PASSENGER' ? '/passenger/dashboard' : '/driver/dashboard';
}
