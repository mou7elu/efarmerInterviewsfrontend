const { DomainError } = require('./DomainError');

/**
 * Erreur pour une duplication de données
 */
class DuplicateError extends DomainError {
  constructor(message = 'Données dupliquées', field = null, value = null) {
    super(message, 'DUPLICATE_ERROR');
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

module.exports = { DuplicateError };