export interface AuthData {
  isLoggedIn: boolean;
  username: string;
  role?: string;
  loggedAt: string;
  token?: string;
  refreshToken?: string;
}

const AUTH_KEY = 'mp_auth_session';

export const authStorage = {
  get: (): AuthData | null => {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  },

  set: (username: string, token?: string, refreshToken?: string, role?: string) => {
    const data: AuthData = {
      isLoggedIn: true,
      username,
      role,
      loggedAt: new Date().toISOString(),
      token,
      refreshToken,
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(data));
  },

  clear: () => {
    localStorage.removeItem(AUTH_KEY);
  },

  isAuthenticated: (): boolean => {
    const data = authStorage.get();
    return !!(data?.isLoggedIn && data.token);
  },

  getToken: (): string | null => {
    const data = authStorage.get();
    return data?.token || null;
  },

  getRefreshToken: (): string | null => {
    const data = authStorage.get();
    return data?.refreshToken || null;
  },

  updateToken: (token: string) => {
    const data = authStorage.get();
    if (data) {
      data.token = token;
      localStorage.setItem(AUTH_KEY, JSON.stringify(data));
    }
  },
};
