import { apiClient } from './api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'technician' | 'viewer';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      username: string;
      email: string;
      role: string;
    };
    accessToken: string;
    refreshToken: string;
  };
}

export interface UserResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      username: string;
      email: string;
      role: string;
      lastLogin?: string;
    };
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    if (response.success && response.data.accessToken) {
      apiClient.setToken(response.data.accessToken);
      localStorage.setItem('mp_auth_session', JSON.stringify({
        isLoggedIn: true,
        username: response.data.user.username,
        loggedAt: new Date().toISOString(),
        token: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      }));
    }
    return response;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    if (response.success && response.data.accessToken) {
      apiClient.setToken(response.data.accessToken);
      localStorage.setItem('mp_auth_session', JSON.stringify({
        isLoggedIn: true,
        username: response.data.user.username,
        loggedAt: new Date().toISOString(),
        token: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      }));
    }
    return response;
  },

  async getMe(): Promise<UserResponse> {
    return apiClient.get<UserResponse>('/auth/me');
  },

  logout() {
    apiClient.clearToken();
    localStorage.removeItem('mp_auth_session');
  },
};
