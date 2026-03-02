/**
 * Nationalite Entity
 * Domain entity representing a nationality reference data
 */
class Nationalite {
  constructor({ id, Lib_Nation, createdAt, updatedAt }) {
    this.id = id;
    this.Lib_Nation = Lib_Nation;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Validates if the entity is valid
   * @returns {Object} validation result with isValid and errors
   */
  validate() {
    const errors = [];

    if (!this.Lib_Nation || this.Lib_Nation.trim() === '') {
      errors.push('Le libellé de la nationalité est requis');
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
      Lib_Nation: this.Lib_Nation,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Nationalite;
