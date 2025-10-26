// Application constants

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

// Authentication
export const AUTH = {
  TOKEN_KEY: 'authToken',
  REFRESH_TOKEN_KEY: 'refreshToken',
  USER_KEY: 'user',
  TOKEN_EXPIRY_BUFFER: 300000, // 5 minutes in ms
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  INTERVIEWS: '/interviews',
  INTERVIEW_DETAIL: '/interviews/:id',
  CREATE_INTERVIEW: '/interviews/create',
  PROFILE: '/profile',
  USERS: '/users',
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  INTERVIEWER: 'interviewer',
  VIEWER: 'viewer',
};

// Question Types
export const QUESTION_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  SELECT: 'select',
  MULTIPLE_SELECT: 'multiple_select',
  RADIO: 'radio',
  CHECKBOX: 'checkbox',
  DATE: 'date',
  TIME: 'time',
  DATETIME: 'datetime',
  FILE: 'file',
  SIGNATURE: 'signature',
  GPS: 'gps',
};

// Interview Status
export const INTERVIEW_STATUS = {
  DRAFT: 'draft',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  VALIDATED: 'validated',
  REJECTED: 'rejected',
};

// Response Status
export const RESPONSE_STATUS = {
  EMPTY: 'empty',
  PARTIAL: 'partial',
  COMPLETE: 'complete',
  VALIDATED: 'validated',
};

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: true,
  },
  EMAIL: {
    MAX_LENGTH: 255,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
  PHONE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 15,
  },
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion réseau',
  UNAUTHORIZED: 'Non autorisé',
  FORBIDDEN: 'Accès interdit',
  NOT_FOUND: 'Ressource non trouvée',
  SERVER_ERROR: 'Erreur serveur',
  VALIDATION_ERROR: 'Erreur de validation',
  TOKEN_EXPIRED: 'Session expirée',
  GENERIC_ERROR: 'Une erreur inattendue s\'est produite',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Connexion réussie',
  LOGOUT_SUCCESS: 'Déconnexion réussie',
  SAVE_SUCCESS: 'Sauvegarde réussie',
  UPDATE_SUCCESS: 'Mise à jour réussie',
  DELETE_SUCCESS: 'Suppression réussie',
  CREATE_SUCCESS: 'Création réussie',
};