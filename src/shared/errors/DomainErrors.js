/**
 * Domain Errors
 * Hiérarchie d'erreurs métier pour le frontend
 */

// Erreur de base du domaine
export class DomainError extends Error {
  constructor(message, code = null, details = null) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
    this.timestamp = new Date();
    
    // Maintenir la stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
      timestamp: this.timestamp
    };
  }
}

// Erreur de validation
export class ValidationError extends DomainError {
  constructor(message, field = null, value = null) {
    super(message, 'VALIDATION_ERROR');
    this.field = field;
    this.value = value;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      field: this.field,
      value: this.value
    };
  }
}

// Erreur de logique métier
export class BusinessLogicError extends DomainError {
  constructor(message, rule = null) {
    super(message, 'BUSINESS_LOGIC_ERROR');
    this.rule = rule;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      rule: this.rule
    };
  }
}

// Erreur de ressource non trouvée
export class NotFoundError extends DomainError {
  constructor(entityType, identifier = null) {
    const message = identifier 
      ? `${entityType} avec l'identifiant '${identifier}' non trouvé(e)`
      : `${entityType} non trouvé(e)`;
    
    super(message, 'NOT_FOUND_ERROR');
    this.entityType = entityType;
    this.identifier = identifier;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      entityType: this.entityType,
      identifier: this.identifier
    };
  }
}

// Erreur de duplication
export class DuplicateError extends DomainError {
  constructor(entityType, field = null, value = null) {
    const message = field 
      ? `${entityType} avec ${field} '${value}' existe déjà`
      : `${entityType} existe déjà`;
    
    super(message, 'DUPLICATE_ERROR');
    this.entityType = entityType;
    this.field = field;
    this.value = value;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      entityType: this.entityType,
      field: this.field,
      value: this.value
    };
  }
}

// Erreur d'autorisation
export class AuthorizationError extends DomainError {
  constructor(message = 'Accès non autorisé', resource = null, action = null) {
    super(message, 'AUTHORIZATION_ERROR');
    this.resource = resource;
    this.action = action;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      resource: this.resource,
      action: this.action
    };
  }
}

// Erreur d'authentification
export class AuthenticationError extends DomainError {
  constructor(message = 'Authentification requise') {
    super(message, 'AUTHENTICATION_ERROR');
  }
}

// Erreur de réseau/API
export class NetworkError extends DomainError {
  constructor(message, statusCode = null, endpoint = null) {
    super(message, 'NETWORK_ERROR');
    this.statusCode = statusCode;
    this.endpoint = endpoint;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      statusCode: this.statusCode,
      endpoint: this.endpoint
    };
  }
}

// Erreur de configuration
export class ConfigurationError extends DomainError {
  constructor(message, configKey = null) {
    super(message, 'CONFIGURATION_ERROR');
    this.configKey = configKey;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      configKey: this.configKey
    };
  }
}

// Factory pour créer des erreurs à partir d'erreurs API
export class ErrorFactory {
  static fromApiError(error) {
    const { response } = error;
    
    if (!response) {
      return new NetworkError('Erreur de connexion réseau');
    }

    const { status, data } = response;
    const message = data?.message || 'Erreur inconnue';

    switch (status) {
      case 400:
        return new ValidationError(message);
      case 401:
        return new AuthenticationError(message);
      case 403:
        return new AuthorizationError(message);
      case 404:
        return new NotFoundError('Ressource', data?.identifier);
      case 409:
        return new DuplicateError('Ressource', data?.field, data?.value);
      case 422:
        return new BusinessLogicError(message, data?.rule);
      default:
        return new NetworkError(message, status, error.config?.url);
    }
  }

  static fromGenericError(error) {
    if (error instanceof DomainError) {
      return error;
    }

    return new DomainError(error.message || 'Erreur inconnue');
  }
}