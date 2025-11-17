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
  // Check both 'authToken' (used by StorageService) and 'token' (legacy) for compatibility
  const token = localStorage.getItem('authToken') || 
                sessionStorage.getItem('authToken') || 
                localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Fonction générique pour les appels API
export const apiCall = async (url, options = {}) => {
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
      
      // Si c'est une erreur 401 (Token invalide), nettoyer le token
      if (response.status === 401) {
        const errorMessage = error.message || '';
        
        // Détecter les erreurs de signature JWT
        if (errorMessage.includes('Token invalide') || errorMessage.includes('invalide') || errorMessage.includes('manquant')) {
          console.warn('Token invalide ou manquant détecté - nettoyage du localStorage');
          localStorage.removeItem('token');
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          sessionStorage.removeItem('authToken');
          sessionStorage.removeItem('refreshToken');
          
          // Rediriger vers la page de connexion si on est pas déjà dessus
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
      }
      
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
    console.log('Fetching URL:', url);
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

// === Geographic Module ===
export const paysAPI = createCRUDService('/geographic/pays');
export const districtAPI = createCRUDService('/geographic/districts');
export const regionsAPI = createCRUDService('/geographic/regions');
export const departementsAPI = createCRUDService('/geographic/departements');
export const villagesAPI = createCRUDService('/geographic/villages');

// === Agricultural Module ===
export const producteursAPI = createCRUDService('/agricultural/producteur');
export const parcellesAPI = createCRUDService('/agricultural/parcelle');

// === Administrative Module ===
export const sousprefsAPI = createCRUDService('/administrative/souspref');
export const secteursAdministratifsAPI = createCRUDService('/administrative/secteur');
export const zonesdenombreAPI = createCRUDService('/administrative/zone');
export const localitesAPI = createCRUDService('/administrative/localite');
export const menagesAPI = createCRUDService('/administrative/menage');

// === Questionnaire Module ===
export const voletsAPI = createCRUDService('/questionnaire/volets');
export const sectionsAPI = createCRUDService('/questionnaire/sections');
export const questionsAPI = createCRUDService('/questionnaire/questions');
export const questionnairesAPI = createCRUDService('/questionnaire/questionnaires');

// === Reference Data ===
export const zonesInterditesAPI = createCRUDService('/zones-interdites');
export const piecesAPI = createCRUDService('/reference/piece');
export const profilesAPI = createCRUDService('/reference/profile');
export const usersAPI = createCRUDService('/users');
export const nationalitesAPI = createCRUDService('/reference/nationalite');
export const niveauxScolairesAPI = createCRUDService('/reference/niveau-scolaire');
export const professionsAPI = createCRUDService('/reference/profession');

// === Other ===
export const menusAPI = createCRUDService('/menus');
export const interviewsAPI = createCRUDService('/interviews');
export const reponsesAPI = createCRUDService('/reponses');

// Services spécialisés avec méthodes additionnelles

// === Questions Service ===
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

// === Sections Service ===
export const sectionsService = {
  ...sectionsAPI,
  
  // Obtenir les sections par volet
  getByVolet: async (voletId) => {
    return apiCall(`/questionnaire/sections/volet/${voletId}`);
  },
};

// === Producteurs Service ===
export const producteursService = {
  ...producteursAPI,
  
  // Obtenir les statistiques
  getStatistics: async () => {
    return apiCall('/agricultural/producteurs/statistics');
  },
  
  // Recherche avancée
  search: async (params) => {
    const queryParams = new URLSearchParams(params);
    return apiCall(`/agricultural/producteurs/search?${queryParams.toString()}`);
  },
  
  // Par code producteur
  getByCode: async (code) => {
    return apiCall(`/agricultural/producteurs/code/${code}`);
  },
  
  // Mettre à jour le statut
  updateStatus: async (id, sommeil) => {
    return apiCall(`/agricultural/producteurs/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ sommeil }),
    });
  },
};

// === Parcelles Service ===
export const parcellesService = {
  ...parcellesAPI,
  
  // Obtenir les statistiques
  getStatistics: async () => {
    return apiCall('/agricultural/parcelle/statistics');
  },
  
  // Recherche avancée
  search: async (params) => {
    const queryParams = new URLSearchParams(params);
    return apiCall(`/agricultural/parcelle/search?${queryParams.toString()}`);
  },
  
  // Par producteur
  getByProducteur: async (codeProducteur) => {
    return apiCall(`/agricultural/parcelle/producteur/${codeProducteur}`);
  },
  
  // Par localisation
  getByLocation: async (latitude, longitude, radius = 10) => {
    return apiCall(`/agricultural/parcelle/location?latitude=${latitude}&longitude=${longitude}&radius=${radius}`);
  },
  
  // Mettre à jour GPS
  updateGPS: async (id, latitude, longitude) => {
    return apiCall(`/agricultural/parcelle/${id}/gps`, {
      method: 'PATCH',
      body: JSON.stringify({ latitude, longitude }),
    });
  },
};

// === Geographic Services ===
export const paysService = {
  ...paysAPI,
  
  // Recherche par terme
  searchByTerm: async (term) => {
    return apiCall(`/geographic/pays/search/${term}`);
  },
  
  // Statistiques
  getStats: async () => {
    return apiCall('/geographic/pays/stats');
  },
  
  // Mettre à jour le statut
  updateStatut: async (id, actif) => {
    return apiCall(`/geographic/pays/${id}/statut`, {
      method: 'PATCH',
      body: JSON.stringify({ actif }),
    });
  },
};

export const districtsService = {
  ...districtAPI,
  
  // Recherche par terme
  searchByTerm: async (term) => {
    return apiCall(`/geographic/districts/search/${term}`);
  },
  
  // Statistiques
  getStats: async (paysId) => {
    const query = paysId ? `?paysId=${paysId}` : '';
    return apiCall(`/geographic/districts/stats${query}`);
  },
  
  // Par pays
  getByCountry: async (paysId) => {
    return apiCall(`/geographic/pays/${paysId}/districts`);
  },
  
  // Compter par pays
  countByCountry: async (paysId) => {
    return apiCall(`/geographic/pays/${paysId}/districts/count`);
  },
  
  // Mettre à jour le statut
  updateStatut: async (id, actif) => {
    return apiCall(`/geographic/districts/${id}/statut`, {
      method: 'PATCH',
      body: JSON.stringify({ actif }),
    });
  },
};

export const regionsService = {
  ...regionsAPI,
  
  // Recherche par terme
  searchByTerm: async (term) => {
    return apiCall(`/geographic/regions/search/${term}`);
  },
  
  // Statistiques
  getStats: async () => {
    return apiCall('/geographic/regions/stats');
  },
  
  // Mettre à jour le statut
  updateStatut: async (id, actif) => {
    return apiCall(`/geographic/regions/${id}/statut`, {
      method: 'PATCH',
      body: JSON.stringify({ actif }),
    });
  },
};

export const departementsService = {
  ...departementsAPI,
  
  // Recherche par terme
  searchByTerm: async (term) => {
    return apiCall(`/geographic/departements/search/${term}`);
  },
  
  // Statistiques
  getStats: async () => {
    return apiCall('/geographic/departements/stats');
  },
  
  // Par région
  getByRegion: async (regionId) => {
    return apiCall(`/geographic/regions/${regionId}/departements`);
  },
  
  // Compter par région
  countByRegion: async (regionId) => {
    return apiCall(`/geographic/regions/${regionId}/departements/count`);
  },
  
  // Mettre à jour le statut
  updateStatut: async (id, actif) => {
    return apiCall(`/geographic/departements/${id}/statut`, {
      method: 'PATCH',
      body: JSON.stringify({ actif }),
    });
  },
};

export const villagesService = {
  ...villagesAPI,
  
  // Recherche par terme
  searchByTerm: async (term) => {
    return apiCall(`/geographic/villages/search/${term}`);
  },
  
  // Statistiques
  getStats: async () => {
    return apiCall('/geographic/villages/stats');
  },
};

// === Administrative Services ===
export const sousprefsService = {
  ...sousprefsAPI,
  
  // Par département
  getByDepartement: async (departementId) => {
    return apiCall(`/administrative/souspref/departement/${departementId}`);
  },
};

export const secteursService = {
  ...secteursAdministratifsAPI,
  
  // Par sous-préfecture
  getBySouspref: async (sousprefId) => {
    return apiCall(`/administrative/secteur/souspref/${sousprefId}`);
  },
};

export const zonesService = {
  ...zonesdenombreAPI,
  
  // Par secteur administratif
  getBySecteur: async (secteurId) => {
    return apiCall(`/administrative/zone/secteur/${secteurId}`);
  },
};

export const localitesService = {
  ...localitesAPI,
  
  // Par village
  getByVillage: async (villageId) => {
    return apiCall(`/administrative/localite/village/${villageId}`);
  },
};

export const menagesService = {
  ...menagesAPI,
  
  // Par localité
  getByLocalite: async (localiteId) => {
    return apiCall(`/administrative/menage/localite/${localiteId}`);
  },
  
  // Par enquêteur
  getByEnqueteur: async (enqueteurId) => {
    return apiCall(`/administrative/menage/enqueteur/${enqueteurId}`);
  },
  
  // Avec producteurs d'anacarde
  getWithAnacardeProducteurs: async () => {
    return apiCall('/administrative/menage/anacarde');
  },
  
  // Avec hiérarchie complète
  getWithFullHierarchy: async () => {
    return apiCall('/administrative/menage/hierarchy');
  },
};

// === Users Service ===
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

// === Profiles Service ===
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
  const errorMessage = error.message || '';
  
  if (errorMessage.includes('401') || errorMessage.includes('Token invalide')) {
    // Token expiré ou invalide
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
    return 'Session expirée. Veuillez vous reconnecter.';
  }
  
  if (errorMessage.includes('403')) {
    return 'Vous n\'avez pas les permissions nécessaires.';
  }
  
  if (errorMessage.includes('404')) {
    return 'Ressource non trouvée.';
  }
  
  if (errorMessage.includes('500')) {
    return 'Erreur serveur. Veuillez réessayer plus tard.';
  }
  
  return errorMessage || 'Une erreur est survenue.';
};

export default {
  // Geographic
  paysAPI,
  paysService,
  districtAPI,
  districtsService,
  regionsAPI,
  regionsService,
  departementsAPI,
  departementsService,
  villagesAPI,
  villagesService,
  
  // Agricultural
  producteursAPI,
  producteursService,
  parcellesAPI,
  parcellesService,
  
  // Administrative
  sousprefsAPI,
  sousprefsService,
  secteursAdministratifsAPI,
  secteursService,
  zonesdenombreAPI,
  zonesService,
  localitesAPI,
  localitesService,
  menagesAPI,
  menagesService,
  
  // Questionnaire
  voletsAPI,
  sectionsAPI,
  sectionsService,
  questionsAPI,
  questionsService,
  questionnairesAPI,
  
  // Reference
  zonesInterditesAPI,
  piecesAPI,
  profilesAPI,
  profilesService,
  usersAPI,
  usersService,
  nationalitesAPI,
  niveauxScolairesAPI,
  professionsAPI,
  
  // Other
  menusAPI,
  interviewsAPI,
  reponsesAPI,
  authAPI,
  handleApiError,
};