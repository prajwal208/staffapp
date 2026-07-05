import { API_V1 } from '@/constants/api';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

let accessTokenGetter: () => string | null = () => null;
let onUnauthorized: (() => void) | null = null;

export function setAccessTokenGetter(getter: () => string | null) {
  accessTokenGetter = getter;
}

export function setOnUnauthorized(handler: () => void) {
  onUnauthorized = handler;
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  auth?: boolean;
};

function extractMessage(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null;
  const record = data as Record<string, unknown>;
  if (typeof record.message === 'string') return record.message;
  if (Array.isArray(record.message)) return record.message.map(String).join(', ');
  if (typeof record.error === 'string') return record.error;
  return null;
}

function getDefaultErrorMessage(status: number, path: string): string {
  const isAuth = path.includes('/auth/');
  const isCompleteOrder = path.includes('/staff/orders/complete');

  if (isAuth) {
    switch (status) {
      case 400:
        return 'Invalid phone number or OTP.';
      case 401:
        return 'Invalid OTP or not authorized as staff.';
      case 404:
        return 'Staff not found or auth endpoint unavailable.';
      default:
        return `Login request failed (${status}).`;
    }
  }

  if (isCompleteOrder) {
    switch (status) {
      case 400:
        return 'Order is not at your workflow step yet, or already completed.';
      case 404:
        return 'Order not found.';
      default:
        return `Request failed (${status}).`;
    }
  }

  switch (status) {
    case 401:
      return 'Session expired. Please log in again.';
    default:
      return `Request failed (${status}).`;
  }
}

async function parseErrorMessage(response: Response, path: string): Promise<string> {
  let rawBody = '';
  try {
    rawBody = await response.text();
    if (rawBody) {
      const message = extractMessage(JSON.parse(rawBody) as unknown);
      if (message) return message;
    }
  } catch {
    // ignore
  }
  if (__DEV__) {
    console.error('[API] error response', { url: `${API_V1}${path}`, status: response.status, body: rawBody });
  }
  return getDefaultErrorMessage(response.status, path);
}

const REQUEST_TIMEOUT_MS = 30000;

async function fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError(0, 'Request timed out. Check your internet connection and try again.');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = false } = options;
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = accessTokenGetter();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const url = `${API_V1}${path}`;
  if (__DEV__) {
    console.log('[API] request', {
      method,
      url,
      auth,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  let response: Response;
  try {
    response = await fetchWithTimeout(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    if (__DEV__) console.error('[API] network error', { url, error });
    throw new ApiError(0, `Cannot reach server at ${API_V1}.`);
  }

  if (!response.ok) {
    const message = await parseErrorMessage(response, path);
    if (response.status === 401 && auth && onUnauthorized) onUnauthorized();
    throw new ApiError(response.status, message);
  }

  if (response.status === 204) return undefined as T;

  const rawBody = await response.text();
  if (__DEV__) console.log('[API] success response', { status: response.status, body: rawBody || '(empty)' });
  if (!rawBody) return undefined as T;
  try {
    return JSON.parse(rawBody) as T;
  } catch {
    return undefined as T;
  }
}
