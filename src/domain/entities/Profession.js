/**
 * Profession Entity
 * Domain entity representing a profession reference data
 */
class Profession {
  constructor({ id, Lib_Profession, createdAt, updatedAt }) {
    this.id = id;
    this.Lib_Profession = Lib_Profession;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Validates if the entity is valid
   * @returns {Object} validation result with isValid and errors
   */
  validate() {
    const errors = [];

    if (!this.Lib_Profession || this.Lib_Profession.trim() === '') {
      errors.push('Le libellé de la profession est requis');
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
      Lib_Profession: this.Lib_Profession,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Profession;
