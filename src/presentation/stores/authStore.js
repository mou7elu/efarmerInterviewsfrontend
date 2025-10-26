/**
 * Auth Store
 * Store global pour la gestion de l'authentification avec Zustand
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { LoginUseCase } from '@application/use-cases/LoginUseCase.js';
import { ApiUserRepository } from '@infrastructure/repositories/ApiUserRepository.js';
import httpClient from '@infrastructure/http/HttpClient.js';
import storageService from '@infrastructure/storage/StorageService.js';

// Services et repositories
const userRepository = new ApiUserRepository();

// Token service pour gérer les tokens JWT
const tokenService = {
  decode: (token) => {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  },
  
  isExpired: (token) => {
    const decoded = tokenService.decode(token);
    if (!decoded || !decoded.exp) return true;
    return Date.now() >= decoded.exp * 1000;
  }
};

// Auth repository pour l'authentification
const authRepository = {
  async authenticate(email, password) {
    try {
      const response = await httpClient.post('/auth/login', {
        email,
        password
      });

      if (response.success && response.data) {
        return {
          success: true,
          user: response.data.user,
          token: response.data.token,
          refreshToken: response.data.refreshToken
        };
      }

      return { success: false };
    } catch (error) {
      return { success: false, error };
    }
  },

  async getCurrentUser() {
    try {
      const response = await httpClient.get('/auth/me');
      return response.success ? response.data : null;
    } catch {
      return null;
    }
  },

  async logout() {
    try {
      await httpClient.post('/auth/logout');
    } catch {
      // Ignore les erreurs de logout
    }
  }
};

export const useAuthStore = create(
  subscribeWithSelector((set, get) => ({
    // État
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,

    // Use cases
    loginUseCase: new LoginUseCase(authRepository, tokenService, storageService),

    // Actions
    login: async (credentials) => {
      try {
        set({ isLoading: true, error: null });

        const result = await get().loginUseCase.execute(credentials);
        
        set({
          user: result.user,
          token: result.token,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });

        return result;
      } catch (error) {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: error.message
        });
        throw error;
      }
    },

    logout: async () => {
      try {
        await authRepository.logout();
      } finally {
        await storageService.clearTokens();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
      }
    },

    initializeAuth: async () => {
      try {
        set({ isLoading: true });

        const token = await storageService.getToken();
        
        if (!token || tokenService.isExpired(token)) {
          await storageService.clearTokens();
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false
          });
          return;
        }

        // Récupérer les informations utilisateur
        const user = await authRepository.getCurrentUser();
        
        if (user) {
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } else {
          await storageService.clearTokens();
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      } catch (error) {
        await storageService.clearTokens();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: error.message
        });
      }
    },

    updateUser: (user) => {
      set({ user });
    },

    clearError: () => {
      set({ error: null });
    },

    // Getters
    hasPermission: (resource, action) => {
      const { user } = get();
      if (!user) return false;
      
      // Logique de permissions simplifiée
      // À adapter selon les besoins réels
      if (user.isGodMode) return true;
      
      // Ajouter ici la logique de permissions selon les profils
      return true;
    },

    isAdmin: () => {
      const { user } = get();
      return user?.role === 'admin' || user?.isGodMode;
    }
  }))
);

// Initialiser l'authentification au démarrage
useAuthStore.getState().initializeAuth();