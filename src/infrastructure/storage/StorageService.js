/**
 * Storage Service
 * Service pour la gestion du stockage local et session
 */

export class StorageService {
  constructor() {
    this.localStorage = window.localStorage;
    this.sessionStorage = window.sessionStorage;
  }

  // Méthodes pour les tokens d'authentification
  async setToken(token, remember = false) {
    const storage = remember ? this.localStorage : this.sessionStorage;
    storage.setItem('authToken', token);
  }

  async getToken() {
    return this.localStorage.getItem('authToken') || this.sessionStorage.getItem('authToken');
  }

  async setRefreshToken(token, remember = false) {
    const storage = remember ? this.localStorage : this.sessionStorage;
    storage.setItem('refreshToken', token);
  }

  async getRefreshToken() {
    return this.localStorage.getItem('refreshToken') || this.sessionStorage.getItem('refreshToken');
  }

  async clearTokens() {
    this.localStorage.removeItem('authToken');
    this.localStorage.removeItem('refreshToken');
    this.sessionStorage.removeItem('authToken');
    this.sessionStorage.removeItem('refreshToken');
  }

  // Méthodes pour les préférences utilisateur
  async setRememberMe(remember) {
    this.localStorage.setItem('rememberMe', remember.toString());
  }

  async getRememberMe() {
    return this.localStorage.getItem('rememberMe') === 'true';
  }

  async setUserPreferences(preferences) {
    this.localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }

  async getUserPreferences() {
    const prefs = this.localStorage.getItem('userPreferences');
    return prefs ? JSON.parse(prefs) : {};
  }

  // Méthodes pour le thème
  async setTheme(theme) {
    this.localStorage.setItem('theme', theme);
  }

  async getTheme() {
    return this.localStorage.getItem('theme') || 'light';
  }

  // Méthodes pour la langue
  async setLanguage(language) {
    this.localStorage.setItem('language', language);
  }

  async getLanguage() {
    return this.localStorage.getItem('language') || 'fr';
  }

  // Méthodes génériques pour le stockage
  async setItem(key, value, persistent = true) {
    const storage = persistent ? this.localStorage : this.sessionStorage;
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    storage.setItem(key, stringValue);
  }

  async getItem(key, defaultValue = null) {
    let value = this.localStorage.getItem(key) || this.sessionStorage.getItem(key);
    
    if (value === null) {
      return defaultValue;
    }

    // Essayer de parser en JSON, sinon retourner la chaîne
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  async removeItem(key) {
    this.localStorage.removeItem(key);
    this.sessionStorage.removeItem(key);
  }

  async clear() {
    this.localStorage.clear();
    this.sessionStorage.clear();
  }

  // Méthodes pour le cache de données
  async cacheData(key, data, ttl = 3600000) { // TTL par défaut: 1 heure
    const cacheItem = {
      data,
      timestamp: Date.now(),
      ttl
    };
    this.localStorage.setItem(`cache_${key}`, JSON.stringify(cacheItem));
  }

  async getCachedData(key) {
    const cacheItem = this.localStorage.getItem(`cache_${key}`);
    
    if (!cacheItem) {
      return null;
    }

    try {
      const parsed = JSON.parse(cacheItem);
      const now = Date.now();
      
      // Vérifier si le cache a expiré
      if (now - parsed.timestamp > parsed.ttl) {
        this.localStorage.removeItem(`cache_${key}`);
        return null;
      }

      return parsed.data;
    } catch {
      this.localStorage.removeItem(`cache_${key}`);
      return null;
    }
  }

  async clearCache() {
    const keys = Object.keys(this.localStorage);
    keys.forEach(key => {
      if (key.startsWith('cache_')) {
        this.localStorage.removeItem(key);
      }
    });
  }

  // Méthodes pour les données de formulaires
  async saveFormData(formId, data) {
    this.sessionStorage.setItem(`form_${formId}`, JSON.stringify(data));
  }

  async getFormData(formId) {
    const formData = this.sessionStorage.getItem(`form_${formId}`);
    return formData ? JSON.parse(formData) : {};
  }

  async clearFormData(formId) {
    this.sessionStorage.removeItem(`form_${formId}`);
  }

  // Méthodes utilitaires
  getStorageSize() {
    let localSize = 0;
    let sessionSize = 0;

    for (let key in this.localStorage) {
      if (this.localStorage.hasOwnProperty(key)) {
        localSize += this.localStorage[key].length + key.length;
      }
    }

    for (let key in this.sessionStorage) {
      if (this.sessionStorage.hasOwnProperty(key)) {
        sessionSize += this.sessionStorage[key].length + key.length;
      }
    }

    return {
      localStorage: localSize,
      sessionStorage: sessionSize,
      total: localSize + sessionSize
    };
  }

  isStorageAvailable() {
    try {
      const test = '__storage_test__';
      this.localStorage.setItem(test, test);
      this.localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }
}

// Instance singleton
const storageService = new StorageService();
export default storageService;