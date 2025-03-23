import config from '../config';

interface AuthResponse {
  token: string;
  message?: string;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.auth.login}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || 'Login failed');
    }

    localStorage.setItem(config.auth.tokenKey, data.token);
    localStorage.setItem(config.auth.userKey, email);

    return data;
  },

  async signup(email: string, password: string): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.auth.signup}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || 'Signup failed');
    }

    return data;
  },

  logout() {
    localStorage.removeItem(config.auth.tokenKey);
    localStorage.removeItem(config.auth.userKey);
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(config.auth.tokenKey);
  },

  getToken(): string | null {
    return localStorage.getItem(config.auth.tokenKey);
  },

  getUser(): string | null {
    return localStorage.getItem(config.auth.userKey);
  },

  getCurrentUser(): string {
    const userEmail = localStorage.getItem(config.auth.userKey);
    return userEmail ? userEmail.split('@')[0] : 'Guest';
  }
};