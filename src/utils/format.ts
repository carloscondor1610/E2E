export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "Sin fecha";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Fecha no disponible";

  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatUserName(firstName?: string | null, lastName?: string | null): string {
  return [firstName, lastName].filter(Boolean).join(" ").trim() || "Usuario";
}

export function formatRating(value?: number | null): string {
  if (typeof value !== "number") return "Sin rating";
  return value.toFixed(1);
}
