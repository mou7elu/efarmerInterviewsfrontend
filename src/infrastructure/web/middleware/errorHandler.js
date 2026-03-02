const { DomainError } = require('../../../shared/errors/DomainError');
const { ValidationError } = require('../../../shared/errors/ValidationError');
const { NotFoundError } = require('../../../shared/errors/NotFoundError');
const { DuplicateError } = require('../../../shared/errors/DuplicateError');

/**
 * Middleware de gestion des erreurs pour l'API REST
 */
const errorHandler = (error, req, res, next) => {
  // Log de l'erreur pour le débogage
  console.error('API Error:', {
    message: error.message,
    stack: error.stack,
    path: req.originalUrl,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query
  });

  // Erreurs de domaine métier
  if (error instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: error.message,
      details: error.details || null
    });
  }

  if (error instanceof NotFoundError) {
    return res.status(404).json({
      success: false,
      error: 'NOT_FOUND',
      message: error.message
    });
  }

  if (error instanceof DuplicateError) {
    return res.status(409).json({
      success: false,
      error: 'DUPLICATE_ERROR',
      message: error.message
    });
  }

  if (error instanceof DomainError) {
    return res.status(400).json({
      success: false,
      error: 'DOMAIN_ERROR',
      message: error.message
    });
  }

  // Erreurs MongoDB/Mongoose
  if (error.name === 'ValidationError') {
    const details = Object.values(error.errors).map(err => ({
      field: err.path,
      message: err.message
    }));

    return res.status(400).json({
      success: false,
      error: 'MONGOOSE_VALIDATION_ERROR',
      message: 'Erreur de validation des données',
      details
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'INVALID_ID',
      message: 'Format d\'identifiant invalide'
    });
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    const value = error.keyValue[field];
    
    return res.status(409).json({
      success: false,
      error: 'DUPLICATE_KEY',
      message: `La valeur '${value}' existe déjà pour le champ '${field}'`
    });
  }

  // Erreurs JSON
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      success: false,
      error: 'INVALID_JSON',
      message: 'Format JSON invalide'
    });
  }

  // Erreur 404 pour les routes non trouvées
  if (error.status === 404) {
    return res.status(404).json({
      success: false,
      error: 'ROUTE_NOT_FOUND',
      message: 'Endpoint non trouvé'
    });
  }

  // Erreurs de limitation de taux
  if (error.status === 429) {
    return res.status(429).json({
      success: false,
      error: 'RATE_LIMIT_EXCEEDED',
      message: 'Trop de requêtes, veuillez réessayer plus tard'
    });
  }

  // Erreurs de timeout
  if (error.code === 'ETIMEDOUT' || error.timeout) {
    return res.status(504).json({
      success: false,
      error: 'TIMEOUT',
      message: 'Délai d\'attente dépassé'
    });
  }

  // Erreurs de base de données
  if (error.name === 'MongooseError' || error.name === 'MongoError') {
    return res.status(500).json({
      success: false,
      error: 'DATABASE_ERROR',
      message: 'Erreur de base de données'
    });
  }

  // Erreur générique du serveur
  res.status(500).json({
    success: false,
    error: 'INTERNAL_SERVER_ERROR',
    message: 'Erreur interne du serveur',
    ...(process.env.NODE_ENV === 'development' && {
      details: error.message,
      stack: error.stack
    })
  });
};

/**
 * Middleware pour les routes non trouvées
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: 'ROUTE_NOT_FOUND',
    message: 'Endpoint non trouvé',
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: '/api/endpoints'
  });
};

/**
 * Middleware de validation de contenu JSON
 */
const validateJsonContent = (error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      success: false,
      error: 'INVALID_JSON',
      message: 'Format JSON invalide dans le corps de la requête'
    });
  }
  next();
};

module.exports = {
  errorHandler,
  notFoundHandler,
  validateJsonContent
};