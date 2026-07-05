import type { ApiErrorPayload } from "../types/api.types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
const TOKEN_KEY = "uber_e2e_token";

export class HttpError extends Error {
  status: number;
  payload: ApiErrorPayload | null;

  constructor(message: string, status: number, payload: ApiErrorPayload | null = null) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.payload = payload;
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function hasToken(): boolean {
  return Boolean(getToken());
}

function normalizeBaseUrl(): string {
  return API_BASE_URL.replace(/\/$/, "");
}

function buildUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizeBaseUrl()}${cleanPath}`;
}

function extractErrorMessage(payload: ApiErrorPayload | null, status: number): string {
  if (!payload) return `Error ${status}. Inténtalo nuevamente.`;
  if (typeof payload.error === "string") return payload.error;
  if (typeof payload.message === "string") return payload.message;

  const firstValidationMessage = Object.values(payload).find(
    (value) => typeof value === "string" && value.length > 0,
  );

  if (typeof firstValidationMessage === "string") return firstValidationMessage;
  return `Error ${status}. Inténtalo nuevamente.`;
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(buildUrl(path), {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? ((await response.json()) as ApiErrorPayload) : null;

  if (!response.ok) {
    throw new HttpError(extractErrorMessage(payload, response.status), response.status, payload);
  }

  return payload as T;
}
