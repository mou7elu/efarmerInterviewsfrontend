/**
 * HTTP Client
 * Client HTTP configuré avec Axios pour les appels API
 */

import axios from 'axios';
import { ErrorFactory } from '@shared/errors/DomainErrors.js';

class HttpClient {
  constructor(config = {}) {
    this.client = axios.create({
      baseURL: config.baseURL || '/api',
      timeout: config.timeout || 10000,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers
      }
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor pour ajouter le token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(ErrorFactory.fromGenericError(error));
      }
    );

    // Response interceptor pour gérer les erreurs
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        // Si le token a expiré, essayer de le renouveler
        if (error.response?.status === 401 && this.getRefreshToken()) {
          try {
            await this.refreshToken();
            // Retry the original request
            return this.client(error.config);
          } catch (refreshError) {
            this.clearAuthTokens();
            window.location.href = '/login';
            return Promise.reject(ErrorFactory.fromApiError(refreshError));
          }
        }

        return Promise.reject(ErrorFactory.fromApiError(error));
      }
    );
  }

  getAuthToken() {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
  }

  setAuthToken(token, remember = false) {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('authToken', token);
  }

  setRefreshToken(token, remember = false) {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('refreshToken', token);
  }

  clearAuthTokens() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('refreshToken');
  }

  async refreshToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post('/api/auth/refresh', {
      refreshToken
    });

    const { token, refreshToken: newRefreshToken } = response.data.data;
    
    this.setAuthToken(token, !!localStorage.getItem('authToken'));
    if (newRefreshToken) {
      this.setRefreshToken(newRefreshToken, !!localStorage.getItem('refreshToken'));
    }

    return token;
  }

  // Méthodes HTTP de base
  async get(url, config = {}) {
    const response = await this.client.get(url, config);
    return response.data;
  }

  async post(url, data = {}, config = {}) {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  async put(url, data = {}, config = {}) {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  async patch(url, data = {}, config = {}) {
    const response = await this.client.patch(url, data, config);
    return response.data;
  }

  async delete(url, config = {}) {
    const response = await this.client.delete(url, config);
    return response.data;
  }

  // Méthodes pour upload de fichiers
  async upload(url, formData, onProgress = null) {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    if (onProgress) {
      config.onUploadProgress = (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      };
    }

    const response = await this.client.post(url, formData, config);
    return response.data;
  }

  // Méthodes pour téléchargement de fichiers
  async download(url, filename = null) {
    const response = await this.client.get(url, {
      responseType: 'blob'
    });

    // Créer un lien de téléchargement
    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    return response.data;
  }
}

// Instance singleton
const httpClient = new HttpClient({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000
});

export default httpClient;