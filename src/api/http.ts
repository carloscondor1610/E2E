export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';
export const TOKEN_KEY = 'uber_e2e_token';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: RequestMethod;
  body?: unknown;
  auth?: boolean;
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function extractErrorMessage(data: unknown): string {
  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;

    if (typeof record.error === 'string') {
      return record.error;
    }

    const firstValue = Object.values(record)[0];
    if (typeof firstValue === 'string') {
      return firstValue;
    }
  }

  return 'Ocurrió un error al comunicarse con el servidor.';
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true } = options;
  const headers = new Headers();

  if (body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  if (auth) {
    const token = getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const contentType = response.headers.get('content-type');
  const data = contentType?.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    throw new ApiError(extractErrorMessage(data), response.status, data);
  }

  return data as T;
}
