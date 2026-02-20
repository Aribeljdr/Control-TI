/**
 * Cliente HTTP para el backend Express.
 * No se usa en modo standalone (IndexedDB).
 * Conservado para reactivar la conexión al servidor cuando se despliegue el backend.
 */

/*
import { authStorage } from '../utils/authStorage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setToken(token: string) { this.token = token; }
  clearToken() { this.token = null; }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.token || authStorage.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${this.baseURL}${endpoint}`, { ...options, headers });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
      if (response.status === 401) {
        authStorage.clear();
        this.token = null;
        window.location.href = '/';
        throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      }
      throw new Error(error.message || 'Error en la petición');
    }

    return response.json();
  }

  get<T>(endpoint: string): Promise<T> { return this.request<T>(endpoint, { method: 'GET' }); }
  post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body: data !== undefined ? JSON.stringify(data) : undefined });
  }
  put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body: JSON.stringify(data) });
  }
  delete<T>(endpoint: string): Promise<T> { return this.request<T>(endpoint, { method: 'DELETE' }); }
}

export const apiClient = new ApiClient(API_URL);
*/

// Stub para que los archivos que aún importen apiClient no rompan el build
export const apiClient = null as never;
