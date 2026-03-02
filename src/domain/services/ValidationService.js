/**
 * Validation Service
 * Service de validation pour les règles métier complexes
 */
class ValidationService {
  /**
   * Valide les coordonnées GPS au format GeoJSON (Point ou Polygon)
   * @param {Object} geoJSON - Objet GeoJSON (Point ou Polygon)
   * @returns {{valid: boolean, errors: string[]}}
   */
  validateCoordinates(geoJSON) {
    return this.validateGeoJSON(geoJSON);
  }

  /**
   * Valide un objet GeoJSON (Point ou Polygon)
   * @param {Object} geoJSON - Objet GeoJSON
   * @returns {{valid: boolean, errors: string[]}}
   */
  validateGeoJSON(geoJSON) {
    const errors = [];

    if (!geoJSON || typeof geoJSON !== 'object') {
      errors.push('Le GeoJSON doit être un objet');
      return { valid: false, errors };
    }

    if (!geoJSON.type) {
      errors.push('Le type GeoJSON est requis');
      return { valid: false, errors };
    }

    switch (geoJSON.type) {
      case 'Point':
        return this.validatePointGeoJSON(geoJSON);
      case 'Polygon':
        return this.validatePolygonGeoJSON(geoJSON);
      default:
        errors.push(`Type GeoJSON non supporté: ${geoJSON.type}. Types supportés: Point, Polygon`);
        return { valid: false, errors };
    }
  }

  /**
   * Valide un Point GeoJSON
   * @param {Object} point - Point GeoJSON
   * @returns {{valid: boolean, errors: string[]}}
   */
  validatePointGeoJSON(point) {
    const errors = [];

    if (!point.coordinates || !Array.isArray(point.coordinates)) {
      errors.push('Les coordonnées du point doivent être un tableau');
      return { valid: false, errors };
    }

    if (point.coordinates.length !== 2) {
      errors.push('Un point GeoJSON doit avoir exactement 2 coordonnées [longitude, latitude]');
      return { valid: false, errors };
    }

    const [longitude, latitude] = point.coordinates;

    // Valider la longitude
    if (typeof longitude !== 'number' || isNaN(longitude)) {
      errors.push('La longitude doit être un nombre');
    } else if (longitude < -180 || longitude > 180) {
      errors.push('La longitude doit être entre -180 et 180');
    }

    // Valider la latitude
    if (typeof latitude !== 'number' || isNaN(latitude)) {
      errors.push('La latitude doit être un nombre');
    } else if (latitude < -90 || latitude > 90) {
      errors.push('La latitude doit être entre -90 et 90');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Valide un Polygon GeoJSON
   * @param {Object} polygon - Polygon GeoJSON
   * @returns {{valid: boolean, errors: string[]}}
   */
  validatePolygonGeoJSON(polygon) {
    const errors = [];

    if (!polygon.coordinates || !Array.isArray(polygon.coordinates)) {
      errors.push('Les coordonnées du polygone doivent être un tableau');
      return { valid: false, errors };
    }

    if (polygon.coordinates.length === 0) {
      errors.push('Le polygone doit avoir au moins un anneau (ring)');
      return { valid: false, errors };
    }

    // Valider chaque anneau (ring) du polygone
    polygon.coordinates.forEach((ring, ringIndex) => {
      if (!Array.isArray(ring)) {
        errors.push(`L'anneau ${ringIndex} doit être un tableau`);
        return;
      }

      if (ring.length < 4) {
        errors.push(`L'anneau ${ringIndex} doit avoir au moins 4 points (minimum pour un polygone fermé)`);
        return;
      }

      // Vérifier que le premier et le dernier point sont identiques (polygone fermé)
      const firstPoint = ring[0];
      const lastPoint = ring[ring.length - 1];
      
      if (!Array.isArray(firstPoint) || !Array.isArray(lastPoint)) {
        errors.push(`Les points de l'anneau ${ringIndex} doivent être des tableaux`);
        return;
      }

      if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
        errors.push(`L'anneau ${ringIndex} doit être fermé (premier et dernier point identiques)`);
      }

      // Valider chaque point du ring
      ring.forEach((point, pointIndex) => {
        if (!Array.isArray(point) || point.length !== 2) {
          errors.push(`Le point ${pointIndex} de l'anneau ${ringIndex} doit avoir exactement 2 coordonnées [longitude, latitude]`);
          return;
        }

        const [longitude, latitude] = point;

        // Valider la longitude
        if (typeof longitude !== 'number' || isNaN(longitude)) {
          errors.push(`Anneau ${ringIndex}, point ${pointIndex}: la longitude doit être un nombre`);
        } else if (longitude < -180 || longitude > 180) {
          errors.push(`Anneau ${ringIndex}, point ${pointIndex}: la longitude doit être entre -180 et 180`);
        }

        // Valider la latitude
        if (typeof latitude !== 'number' || isNaN(latitude)) {
          errors.push(`Anneau ${ringIndex}, point ${pointIndex}: la latitude doit être un nombre`);
        } else if (latitude < -90 || latitude > 90) {
          errors.push(`Anneau ${ringIndex}, point ${pointIndex}: la latitude doit être entre -90 et 90`);
        }
      });
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Valide un email
   * @param {string} email - Email à valider
   * @returns {{valid: boolean, errors: string[]}}
   */
  validateEmail(email) {
    const errors = [];

    if (!email || email.trim() === '') {
      errors.push('L\'email est requis');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push('Format d\'email invalide');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Valide un numéro de téléphone
   * Format international ou local
   * @param {string} telephone - Numéro de téléphone
   * @returns {{valid: boolean, errors: string[]}}
   */
  validateTelephone(telephone) {
    const errors = [];

    if (!telephone || telephone.trim() === '') {
      errors.push('Le numéro de téléphone est requis');
    } else {
      // Retirer les espaces et caractères spéciaux
      const cleanPhone = telephone.replace(/[\s\-\(\)]/g, '');
      
      // Vérifier le format (au moins 8 chiffres, max 15)
      const phoneRegex = /^(\+)?[0-9]{8,15}$/;
      if (!phoneRegex.test(cleanPhone)) {
        errors.push('Le numéro de téléphone doit contenir entre 8 et 15 chiffres');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Valide une date
   * @param {Date|string} date - Date à valider
   * @param {Object} options - Options de validation
   * @param {Date} options.minDate - Date minimum autorisée
   * @param {Date} options.maxDate - Date maximum autorisée
   * @param {boolean} options.futureAllowed - Autoriser les dates futures
   * @returns {{valid: boolean, errors: string[]}}
   */
  validateDate(date, options = {}) {
    const errors = [];
    
    if (!date) {
      errors.push('La date est requise');
      return { valid: false, errors };
    }

    let dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      errors.push('Format de date invalide');
      return { valid: false, errors };
    }

    const now = new Date();
    
    if (options.minDate && dateObj < options.minDate) {
      errors.push(`La date doit être postérieure au ${options.minDate.toLocaleDateString()}`);
    }
    
    if (options.maxDate && dateObj > options.maxDate) {
      errors.push(`La date doit être antérieure au ${options.maxDate.toLocaleDateString()}`);
    }
    
    if (options.futureAllowed === false && dateObj > now) {
      errors.push('Les dates futures ne sont pas autorisées');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Valide un âge
   * @param {number} age - Âge à valider
   * @param {Object} options - Options de validation
   * @param {number} options.min - Âge minimum
   * @param {number} options.max - Âge maximum
   * @returns {{valid: boolean, errors: string[]}}
   */
  validateAge(age, options = {}) {
    const errors = [];
    const { min = 0, max = 150 } = options;

    if (age === undefined || age === null) {
      errors.push('L\'âge est requis');
    } else if (typeof age !== 'number' || isNaN(age)) {
      errors.push('L\'âge doit être un nombre');
    } else if (age < min) {
      errors.push(`L\'âge doit être supérieur ou égal à ${min}`);
    } else if (age > max) {
      errors.push(`L\'âge doit être inférieur ou égal à ${max}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Valide une superficie
   * @param {number} superficie - Superficie à valider (en hectares)
   * @param {Object} options - Options de validation
   * @param {number} options.min - Superficie minimum
   * @param {number} options.max - Superficie maximum
   * @returns {{valid: boolean, errors: string[]}}
   */
  validateSuperficie(superficie, options = {}) {
    const errors = [];
    const { min = 0, max = 10000 } = options;

    if (superficie === undefined || superficie === null) {
      errors.push('La superficie est requise');
    } else if (typeof superficie !== 'number' || isNaN(superficie)) {
      errors.push('La superficie doit être un nombre');
    } else if (superficie < min) {
      errors.push(`La superficie doit être supérieure ou égale à ${min} hectares`);
    } else if (superficie > max) {
      errors.push(`La superficie doit être inférieure ou égale à ${max} hectares`);
    } else if (superficie <= 0) {
      errors.push('La superficie doit être positive');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Valide un montant
   * @param {number} montant - Montant à valider
   * @param {Object} options - Options de validation
   * @param {number} options.min - Montant minimum
   * @param {number} options.max - Montant maximum
   * @param {boolean} options.allowNegative - Autoriser les montants négatifs
   * @returns {{valid: boolean, errors: string[]}}
   */
  validateMontant(montant, options = {}) {
    const errors = [];
    const { min = 0, max = Number.MAX_SAFE_INTEGER, allowNegative = false } = options;

    if (montant === undefined || montant === null) {
      errors.push('Le montant est requis');
    } else if (typeof montant !== 'number' || isNaN(montant)) {
      errors.push('Le montant doit être un nombre');
    } else {
      if (!allowNegative && montant < 0) {
        errors.push('Le montant ne peut pas être négatif');
      }
      if (montant < min) {
        errors.push(`Le montant doit être supérieur ou égal à ${min}`);
      }
      if (montant > max) {
        errors.push(`Le montant doit être inférieur ou égal à ${max}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Valide une année
   * @param {number} annee - Année à valider
   * @param {Object} options - Options de validation
   * @param {number} options.min - Année minimum
   * @param {number} options.max - Année maximum
   * @param {boolean} options.futureAllowed - Autoriser les années futures
   * @returns {{valid: boolean, errors: string[]}}
   */
  validateAnnee(annee, options = {}) {
    const errors = [];
    const currentYear = new Date().getFullYear();
    const { min = 1900, max = currentYear + 10, futureAllowed = true } = options;

    if (annee === undefined || annee === null) {
      errors.push('L\'année est requise');
    } else if (typeof annee !== 'number' || isNaN(annee)) {
      errors.push('L\'année doit être un nombre');
    } else if (annee < min) {
      errors.push(`L\'année doit être supérieure ou égale à ${min}`);
    } else if (annee > max) {
      errors.push(`L\'année doit être inférieure ou égale à ${max}`);
    } else if (!futureAllowed && annee > currentYear) {
      errors.push('Les années futures ne sont pas autorisées');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Valide un mot de passe
   * @param {string} password - Mot de passe à valider
   * @param {Object} options - Options de validation
   * @param {number} options.minLength - Longueur minimum
   * @param {boolean} options.requireUppercase - Exiger une majuscule
   * @param {boolean} options.requireLowercase - Exiger une minuscule
   * @param {boolean} options.requireNumber - Exiger un chiffre
   * @param {boolean} options.requireSpecialChar - Exiger un caractère spécial
   * @returns {{valid: boolean, errors: string[]}}
   */
  validatePassword(password, options = {}) {
    const errors = [];
    const {
      minLength = 8,
      requireUppercase = true,
      requireLowercase = true,
      requireNumber = true,
      requireSpecialChar = false
    } = options;

    if (!password || password.trim() === '') {
      errors.push('Le mot de passe est requis');
      return { valid: false, errors };
    }

    if (password.length < minLength) {
      errors.push(`Le mot de passe doit contenir au moins ${minLength} caractères`);
    }

    if (requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une majuscule');
    }

    if (requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une minuscule');
    }

    if (requireNumber && !/[0-9]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un chiffre');
    }

    if (requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un caractère spécial');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Valide un genre
   * @param {number} genre - Genre (0: Homme, 1: Femme)
   * @returns {{valid: boolean, errors: string[]}}
   */
  validateGenre(genre) {
    const errors = [];

    if (genre === undefined || genre === null) {
      errors.push('Le genre est requis');
    } else if (typeof genre !== 'number') {
      errors.push('Le genre doit être un nombre');
    } else if (![0, 1].includes(genre)) {
      errors.push('Le genre doit être 0 (Homme) ou 1 (Femme)');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Valide les dépenses d'une parcelle
   * @param {Object} depenses - Objet des dépenses
   * @returns {{valid: boolean, errors: string[]}}
   */
  validateDepenses(depenses) {
    const errors = [];

    if (!depenses || typeof depenses !== 'object') {
      errors.push('Les dépenses doivent être un objet');
      return { valid: false, errors };
    }

    const fields = [
      'mainOeuvre', 'engrais', 'pesticides', 'herbicides',
      'insecticides', 'fongicides', 'semences', 'autres'
    ];

    for (const field of fields) {
      if (depenses[field] !== undefined && depenses[field] !== null) {
        const validation = this.validateMontant(depenses[field], { min: 0 });
        if (!validation.valid) {
          errors.push(`${field}: ${validation.errors.join(', ')}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Valide une plage de valeurs
   * @param {number} min - Valeur minimum
   * @param {number} max - Valeur maximum
   * @param {string} label - Libellé de la plage
   * @returns {{valid: boolean, errors: string[]}}
   */
  validateRange(min, max, label = 'plage') {
    const errors = [];

    if (min === undefined || min === null) {
      errors.push(`La valeur minimum de la ${label} est requise`);
    }
    if (max === undefined || max === null) {
      errors.push(`La valeur maximum de la ${label} est requise`);
    }

    if (min !== undefined && max !== undefined) {
      if (typeof min !== 'number' || typeof max !== 'number') {
        errors.push(`Les valeurs de la ${label} doivent être des nombres`);
      } else if (min > max) {
        errors.push(`La valeur minimum ne peut pas être supérieure à la valeur maximum`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Valide un tableau de permissions
   * @param {Array} permissions - Tableau de permissions
   * @returns {{valid: boolean, errors: string[]}}
   */
  validatePermissions(permissions) {
    const errors = [];

    if (!Array.isArray(permissions)) {
      errors.push('Les permissions doivent être un tableau');
      return { valid: false, errors };
    }

    const validPermissions = [
      'CREATE_USER', 'READ_USER', 'UPDATE_USER', 'DELETE_USER',
      'CREATE_PRODUCTEUR', 'READ_PRODUCTEUR', 'UPDATE_PRODUCTEUR', 'DELETE_PRODUCTEUR',
      'CREATE_PARCELLE', 'READ_PARCELLE', 'UPDATE_PARCELLE', 'DELETE_PARCELLE',
      'MANAGE_REFERENCE', 'MANAGE_GEOGRAPHIC', 'MANAGE_ADMINISTRATIVE',
      'VIEW_STATISTICS', 'EXPORT_DATA', 'IMPORT_DATA',
      'GOD_MODE'
    ];

    for (const permission of permissions) {
      if (typeof permission !== 'string') {
        errors.push(`Permission invalide: ${permission}`);
      } else if (!validPermissions.includes(permission)) {
        errors.push(`Permission inconnue: ${permission}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Valide plusieurs champs à la fois
   * @param {Object} data - Objet avec les données à valider
   * @param {Object} rules - Règles de validation pour chaque champ
   * @returns {{valid: boolean, errors: Object}}
   */
  validateMultiple(data, rules) {
    const errors = {};
    let hasErrors = false;

    for (const [field, rule] of Object.entries(rules)) {
      const value = data[field];
      let result = { valid: true, errors: [] };

      switch (rule.type) {
        case 'email':
          result = this.validateEmail(value);
          break;
        case 'telephone':
          result = this.validateTelephone(value);
          break;
        case 'coordinates':
          result = this.validateCoordinates(value.latitude, value.longitude);
          break;
        case 'age':
          result = this.validateAge(value, rule.options);
          break;
        case 'superficie':
          result = this.validateSuperficie(value, rule.options);
          break;
        case 'montant':
          result = this.validateMontant(value, rule.options);
          break;
        case 'annee':
          result = this.validateAnnee(value, rule.options);
          break;
        case 'password':
          result = this.validatePassword(value, rule.options);
          break;
        case 'genre':
          result = this.validateGenre(value);
          break;
        case 'date':
          result = this.validateDate(value, rule.options);
          break;
        default:
          break;
      }

      if (!result.valid) {
        errors[field] = result.errors;
        hasErrors = true;
      }
    }

    return {
      valid: !hasErrors,
      errors
    };
  }
}

module.exports = new ValidationService();
