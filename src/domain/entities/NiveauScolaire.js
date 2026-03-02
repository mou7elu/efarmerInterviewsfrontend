/**
 * NiveauScolaire Entity
 * Domain entity representing an education level reference data
 */
class NiveauScolaire {
  constructor({ id, Lib_NiveauScolaire, createdAt, updatedAt }) {
    this.id = id;
    this.Lib_NiveauScolaire = Lib_NiveauScolaire;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Validates if the entity is valid
   * @returns {Object} validation result with isValid and errors
   */
  validate() {
    const errors = [];

    if (!this.Lib_NiveauScolaire || this.Lib_NiveauScolaire.trim() === '') {
      errors.push('Le libellé du niveau scolaire est requis');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Converts entity to plain object for data transfer
   * @returns {Object} DTO
   */
  toDTO() {
    return {
      id: this.id,
      Lib_NiveauScolaire: this.Lib_NiveauScolaire,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = NiveauScolaire;
