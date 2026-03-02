const { DomainError } = require('./DomainError');

/**
 * Erreur pour une ressource non trouvée
 */
class NotFoundError extends DomainError {
  constructor(message = 'Ressource non trouvée', resourceType = null, resourceId = null) {
    super(message, 'NOT_FOUND');
    this.resourceType = resourceType;
    this.resourceId = resourceId;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      resourceType: this.resourceType,
      resourceId: this.resourceId
    };
  }
}

module.exports = { NotFoundError };