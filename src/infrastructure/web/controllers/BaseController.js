/**
 * Base Controller
 * Classe de base pour tous les contrôleurs avec gestion d'erreurs standardisée
 */

const { 
  ValidationError, 
  NotFoundError, 
  DuplicateError, 
  AuthorizationError, 
  AuthenticationError 
} = require('../../../shared/errors/DomainErrors');

class BaseController {
  constructor() {
    // Bind des méthodes pour préserver le contexte
    this.handleSuccess = this.handleSuccess.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  /**
   * Gestion standardisée des réponses de succès
   */
  handleSuccess(res, data, message = 'Opération réussie', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Gestion standardisée des erreurs
   */
  handleError(res, error) {
    // Log de l'erreur pour le debugging
    console.error('[Controller Error]', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    // Mappage des erreurs domaine vers codes HTTP
    const errorMappings = {
      ValidationError: 400,
      NotFoundError: 404,
      DuplicateError: 409,
      AuthenticationError: 401,
      AuthorizationError: 403
    };

    const statusCode = errorMappings[error.constructor.name] || 500;
    
    // Structure de réponse d'erreur standardisée
    const errorResponse = {
      success: false,
      error: {
        type: error.constructor.name,
        message: error.message,
        code: error.code || 'UNKNOWN_ERROR',
        timestamp: new Date().toISOString()
      }
    };

    // Ajouter des détails spécifiques selon le type d'erreur
    if (error instanceof ValidationError && error.field) {
      errorResponse.error.field = error.field;
    }

    if (error instanceof NotFoundError) {
      errorResponse.error.resource = error.resource;
      errorResponse.error.identifier = error.identifier;
    }

    if (error instanceof DuplicateError) {
      errorResponse.error.resource = error.resource;
      errorResponse.error.field = error.field;
      errorResponse.error.value = error.value;
    }

    // En développement, inclure la stack trace
    if (process.env.NODE_ENV === 'development') {
      errorResponse.error.stack = error.stack;
    }

    return res.status(statusCode).json(errorResponse);
  }

  /**
   * Wrapper pour l'exécution sécurisée des méthodes de contrôleur
   */
  asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(error => {
        this.handleError(res, error);
      });
    };
  }

  /**
   * Validation des paramètres de pagination
   */
  getPaginationParams(req) {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    // Pas de limite maximale - si non spécifié, retourne toutes les données
    const limit = parseInt(req.query.limit) || 0; // 0 = pas de limite
    const offset = limit > 0 ? (page - 1) * limit : 0;

    return { page, limit, offset };
  }

  /**
   * Réponse avec pagination
   */
  handlePaginatedSuccess(res, data, pagination, message = 'Données récupérées avec succès') {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        currentPage: pagination.page,
        totalPages: Math.ceil(pagination.total / pagination.limit),
        totalItems: pagination.total,
        itemsPerPage: pagination.limit,
        hasNextPage: pagination.page * pagination.limit < pagination.total,
        hasPrevPage: pagination.page > 1
      },
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Validation des paramètres requis
   */
  validateRequiredParams(req, requiredParams) {
    const missingParams = [];
    
    for (const param of requiredParams) {
      if (req.body[param] === undefined || req.body[param] === null || req.body[param] === '') {
        missingParams.push(param);
      }
    }

    if (missingParams.length > 0) {
      throw new ValidationError(`Paramètres requis manquants: ${missingParams.join(', ')}`);
    }
  }

  /**
   * Extraction sécurisée de l'ID utilisateur depuis le token JWT
   */
  getCurrentUserId(req) {
    if (!req.user || !req.user.id) {
      throw new AuthenticationError('Token utilisateur invalide');
    }
    return req.user.id;
  }

  /**
   * Vérification des permissions utilisateur
   */
  checkPermission(req, requiredPermission) {
    if (!req.user || !req.user.permissions) {
      throw new AuthorizationError('Permissions non définies');
    }

    if (!req.user.permissions.includes(requiredPermission)) {
      throw new AuthorizationError(`Permission requise: ${requiredPermission}`);
    }
  }

  /**
   * Nettoyage des données sensibles avant envoi
   */
  sanitizeOutput(data) {
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeOutput(item));
    }

    if (data && typeof data === 'object') {
      const sanitized = { ...data };
      
      // Supprimer les champs sensibles
      delete sanitized.password;
      delete sanitized.passwordHash;
      delete sanitized.salt;
      delete sanitized.resetToken;
      
      return sanitized;
    }

    return data;
  }
}

module.exports = BaseController;