import type { Role } from "../types/user.types";

export function dashboardPathByRole(role: Role): string {
  return role === "DRIVER" ? "/driver/dashboard" : "/passenger/dashboard";
}
