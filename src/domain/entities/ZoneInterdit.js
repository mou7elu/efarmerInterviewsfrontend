/**
 * Zone_interdit Entity
 * Domain entity representing a forbidden/restricted zone
 */
class ZoneInterdit {
  constructor({ id, Lib_zi, Coordonnee, Sommeil, PaysId, createdAt, updatedAt }) {
    this.id = id;
    this.Lib_zi = Lib_zi;
    this.Coordonnee = Coordonnee || null;
    this.Sommeil = Sommeil || false;
    this.PaysId = PaysId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Validates if the entity is valid
   * @returns {Object} validation result with isValid and errors
   */
  validate() {
    const errors = [];

    if (!this.Lib_zi || this.Lib_zi.trim() === '') {
      errors.push('Le libellé de la zone interdite est requis');
    }

    if (!this.PaysId) {
      errors.push('La référence au pays est requise');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Checks if zone is active
   * @returns {boolean}
   */
  isActive() {
    return !this.Sommeil;
  }

  /**
   * Converts entity to plain object for data transfer
   * @returns {Object} DTO
   */
  toDTO() {
    return {
      id: this.id,
      Lib_zi: this.Lib_zi,
      Coordonnee: this.Coordonnee,
      Sommeil: this.Sommeil,
      PaysId: this.PaysId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = ZoneInterdit;
