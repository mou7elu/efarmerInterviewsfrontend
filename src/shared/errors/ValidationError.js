const { DomainError } = require('./DomainError');

/**
 * Erreur de validation des données
 */
class ValidationError extends DomainError {
  constructor(message, details = null) {
    super(message, 'VALIDATION_ERROR');
    this.details = details;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      details: this.details
    };
  }
}

module.exports = { ValidationError };