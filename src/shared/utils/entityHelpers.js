/**
 * Utilitaires pour gérer les objets entités avec des Value Objects (Libelle, etc.)
 */

/**
 * Extrait la valeur d'un objet qui peut être un string ou un Value Object (comme Libelle)
 * @param {*} obj - L'objet à traiter
 * @returns {string} - La valeur string
 */
export const getValue = (obj) => {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  if (obj._value) return obj._value;
  if (obj.value) return obj.value;
  return String(obj);
};

/**
 * Obtient un ID sécurisé d'une entité
 * @param {Object} entity - L'entité
 * @returns {string} - L'ID ou un ID temporaire
 */
export const getSafeId = (entity) => {
  if (!entity) return `empty-${Math.random()}`;
  return entity._id || entity.id || `temp-${Math.random()}`;
};

/**
 * Obtient le nom complet d'un producteur de manière sécurisée
 * @param {Object} producteur - L'objet producteur
 * @returns {string} - Le nom complet
 */
export const getProducteurNomComplet = (producteur) => {
  if (!producteur) return '';
  
  const nom = getValue(producteur.nom || producteur.Nom);
  const prenom = getValue(producteur.prenom || producteur.Prenom);
  
  return `${prenom} ${nom}`.trim();
};

/**
 * Obtient le code d'un producteur de manière sécurisée
 * @param {Object} producteur - L'objet producteur
 * @returns {string} - Le code
 */
export const getProducteurCode = (producteur) => {
  if (!producteur) return '';
  return getValue(producteur.code || producteur.Code);
};

/**
 * Obtient le libellé d'une entité de référence (Pays, Region, etc.)
 * @param {Object} entity - L'entité de référence
 * @returns {string} - Le libellé
 */
export const getLibelle = (entity) => {
  if (!entity) return '';
  return getValue(entity.libelle || entity.Libelle || entity.nom || entity.Nom);
};

/**
 * Extrait les données depuis une réponse API (pour un seul objet ou un tableau)
 * @param {Object} apiResponse - La réponse de l'API
 * @returns {Object|Array} - L'objet unique ou le tableau de données
 */
export const extractDataFromApiResponse = (apiResponse) => {
  if (Array.isArray(apiResponse)) {
    return apiResponse;
  }
  
  if (apiResponse?.data) {
    // Si c'est un tableau, retourner le tableau
    if (Array.isArray(apiResponse.data)) {
      return apiResponse.data;
    }
    
    // Si c'est une réponse paginée avec items
    if (apiResponse.data?.items && Array.isArray(apiResponse.data.items)) {
      return apiResponse.data.items;
    }
    
    // Si c'est un objet unique, retourner l'objet
    if (typeof apiResponse.data === 'object') {
      return apiResponse.data;
    }
  }
  
  // Si c'est déjà un objet simple, le retourner
  if (typeof apiResponse === 'object' && apiResponse !== null && !Array.isArray(apiResponse)) {
    return apiResponse;
  }
  
  return [];
};

/**
 * Formate l'affichage d'une superficie à partir d'une entité (gère les objets Libelle)
 * @param {Object|number} entity - L'entité parcelle ou la superficie directe
 * @returns {string} - La superficie formatée
 */
export const getSuperficieDisplay = (entity) => {
  if (!entity) return '0 ha';
  
  // Si c'est un nombre direct
  if (typeof entity === 'number') {
    return `${entity} ha`;
  }
  
  // Si c'est un objet entité, extraire la superficie
  let superficie = null;
  if (entity.Superficie !== undefined) {
    superficie = getValue(entity.Superficie);
  } else if (entity.superficie !== undefined) {
    superficie = getValue(entity.superficie);
  } else if (entity.surface !== undefined) {
    superficie = getValue(entity.surface);
  } else {
    // Si c'est directement un objet Libelle pour la superficie
    superficie = getValue(entity);
  }
  
  // Convertir en nombre si c'est une string
  if (typeof superficie === 'string') {
    const num = parseFloat(superficie);
    if (!isNaN(num)) {
      superficie = num;
    }
  }
  
  if (!superficie || isNaN(superficie)) return '0 ha';
  return `${superficie} ha`;
};

/**
 * Obtient le texte d'un genre
 * @param {number} genre - Le code genre (1=Homme, 2=Femme)
 * @returns {string} - Le texte du genre
 */
export const getGenreTexte = (genre) => {
  switch (genre) {
    case 1: return 'Homme';
    case 2: return 'Femme';
    default: return 'Non défini';
  }
};

/**
 * Transforme les données de parcelle du frontend vers le format API backend
 * @param {Object} formData - Les données du formulaire frontend
 * @param {Array} producteurs - La liste des producteurs pour trouver le code
 * @returns {Object} - Les données formatées pour l'API backend
 */
export const transformParcelleDataForAPI = (formData, producteurs) => {
  const producteur = producteurs.find(p => getSafeId(p) === formData.ProducteurId);
  // On utilise le code producteur pour la clé producteurId
  const producteurId = formData.ProducteurId || (producteur ? getSafeId(producteur) : '');
  return {
    superficie: parseFloat(formData.Superficie) || 0,
    coordonnee: formData.Coordonnee || null,
    producteurId: producteurId,
    code: formData.Code || '',
    cleProdMobi: formData.cleProdMobi || null,
    clePlantMobi: formData.clePlantMobi || null
  };
};