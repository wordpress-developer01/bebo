import axios, { AxiosRequestConfig } from 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    __isRetry?: boolean;
  }
}

export const http = axios.create({
  baseURL: '/api',
  withCredentials: false
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config.__isRetry) {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw error;
        const { data } = await axios.post('/api/auth/refresh', { refreshToken });
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        error.config.__isRetry = true;
        error.config.headers = error.config.headers ?? {};
        error.config.headers.Authorization = `Bearer ${data.accessToken}`;
        return http.request(error.config);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
    return Promise.reject(error);
  }
);
