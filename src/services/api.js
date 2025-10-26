/**
 * Service API central pour toutes les entités
 * Gère les appels HTTP vers le backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

// Configuration axios par défaut
const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Ajouter le token d'authentification si disponible
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Fonction générique pour les appels API
const apiCall = async (url, options = {}) => {
  try {
    const config = {
      ...apiConfig,
      headers: {
        ...apiConfig.headers,
        ...getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${url}`, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erreur réseau' }));
      throw new Error(error.message || `Erreur HTTP ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return response;
  } catch (error) {
    console.error('Erreur API:', error);
    throw error;
  }
};

// Service générique CRUD
const createCRUDService = (endpoint) => ({
  // Lister tous les éléments avec pagination et filtrage
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return apiCall(url);
  },

  // Obtenir un élément par ID
  getById: async (id) => {
    return apiCall(`${endpoint}/${id}`);
  },

  // Créer un nouvel élément
  create: async (data) => {
    return apiCall(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Mettre à jour un élément
  update: async (id, data) => {
    return apiCall(`${endpoint}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Supprimer un élément
  delete: async (id) => {
    return apiCall(`${endpoint}/${id}`, {
      method: 'DELETE',
    });
  },

  // Recherche avec terme
  search: async (searchTerm, params = {}) => {
    const queryParams = new URLSearchParams({
      search: searchTerm,
      ...params,
    });
    
    return apiCall(`${endpoint}/search?${queryParams.toString()}`);
  },
});

// Services spécifiques pour chaque entité - avec les vrais endpoints API
export const voletsAPI = createCRUDService('/questionnaire/volets');
export const sectionsAPI = createCRUDService('/questionnaire/sections');
export const questionsAPI = createCRUDService('/questionnaire/questions');
export const districtAPI = createCRUDService('/geographic/districts');
export const villagesAPI = createCRUDService('/geographic/villages');
export const zonesInterditesAPI = createCRUDService('/zones-interdites');
export const piecesAPI = createCRUDService('/pieces');
export const profilesAPI = createCRUDService('/profiles');
export const usersAPI = createCRUDService('/users');
export const nationalitesAPI = createCRUDService('/nationalites');
export const niveauxScolairesAPI = createCRUDService('/niveaux-scolaires');

// Services pour les données de référence - avec les vrais endpoints API
export const paysAPI = createCRUDService('/geographic/pays');
export const questionnairesAPI = createCRUDService('/questionnaire/questionnaires');
export const menusAPI = createCRUDService('/menus');
export const interviewsAPI = createCRUDService('/interviews');
export const producteursAPI = createCRUDService('/agricultural/producteurs');
export const regionsAPI = createCRUDService('/geographic/regions');
export const departementsAPI = createCRUDService('/geographic/departements');
export const sousprefsAPI = createCRUDService('/sousprefs');
export const parcellesAPI = createCRUDService('/agricultural/parcelles');
export const reponsesAPI = createCRUDService('/reponses');

// Services spécialisés avec méthodes additionnelles
export const questionsService = {
  ...questionsAPI,
  
  // Obtenir les questions par section
  getBySection: async (sectionId) => {
    return apiCall(`/questionnaire/questions/section/${sectionId}`);
  },

  // Obtenir les questions par volet
  getByVolet: async (voletId) => {
    return apiCall(`/questionnaire/questions/volet/${voletId}`);
  },

  // Obtenir les questions avec leurs options
  getWithOptions: async (id) => {
    return apiCall(`/questionnaire/questions/${id}/options`);
  },
};

export const sectionsService = {
  ...sectionsAPI,
  
  // Obtenir les sections par volet
  getByVolet: async (voletId) => {
    return apiCall(`/questionnaire/sections/volet/${voletId}`);
  },
};

export const usersService = {
  ...usersAPI,
  
  // Upload de photo utilisateur
  uploadPhoto: async (userId, formData) => {
    return apiCall(`/users/${userId}/photo`, {
      method: 'POST',
      headers: {}, // Laisser le navigateur gérer le Content-Type pour FormData
      body: formData,
    });
  },

  // Obtenir les utilisateurs par profil
  getByProfile: async (profileId) => {
    return apiCall(`/users/profile/${profileId}`);
  },
};

export const profilesService = {
  ...profilesAPI,
  
  // Obtenir les permissions d'un profil
  getPermissions: async (profileId) => {
    return apiCall(`/profiles/${profileId}/permissions`);
  },

  // Mettre à jour les permissions
  updatePermissions: async (profileId, permissions) => {
    return apiCall(`/profiles/${profileId}/permissions`, {
      method: 'PUT',
      body: JSON.stringify({ permissions }),
    });
  },
};

// Service d'authentification
export const authAPI = {
  login: async (credentials) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  logout: async () => {
    return apiCall('/auth/logout', {
      method: 'POST',
    });
  },

  register: async (userData) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  refreshToken: async () => {
    return apiCall('/auth/refresh', {
      method: 'POST',
    });
  },

  getProfile: async () => {
    return apiCall('/auth/profile');
  },
};

// Utilitaires
export const handleApiError = (error) => {
  if (error.message.includes('401')) {
    // Token expiré ou invalide
    localStorage.removeItem('token');
    window.location.href = '/login';
    return 'Session expirée. Veuillez vous reconnecter.';
  }
  
  if (error.message.includes('403')) {
    return 'Vous n\'avez pas les permissions nécessaires.';
  }
  
  if (error.message.includes('404')) {
    return 'Ressource non trouvée.';
  }
  
  if (error.message.includes('500')) {
    return 'Erreur serveur. Veuillez réessayer plus tard.';
  }
  
  return error.message || 'Une erreur est survenue.';
};

export default {
  voletsAPI,
  sectionsAPI,
  questionsAPI,
  districtAPI,
  villagesAPI,
  zonesInterditesAPI,
  piecesAPI,
  profilesAPI,
  usersAPI,
  nationalitesAPI,
  niveauxScolairesAPI,
  paysAPI,
  questionnairesAPI,
  menusAPI,
  interviewsAPI,
  producteursAPI,
  regionsAPI,
  departementsAPI,
  sousprefsAPI,
  parcellesAPI,
  reponsesAPI,
  questionsService,
  sectionsService,
  usersService,
  profilesService,
  authAPI,
  handleApiError,
};