/**
 * Pays Entity
 * Domain entity representing a country in the system
 */
class Pays {
  constructor({ id, Lib_Pays, Cod_Pays, createdAt, updatedAt }) {
    this.id = id;
    this.Lib_Pays = Lib_Pays;
    this.Cod_Pays = Cod_Pays;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Validates if the entity is valid
   * @returns {Object} validation result with isValid and errors
   */
  validate() {
    const errors = [];

    if (!this.Lib_Pays || this.Lib_Pays.trim() === '') {
      errors.push('Le libellé du pays est requis');
    }

    if (!this.Cod_Pays || this.Cod_Pays.trim() === '') {
      errors.push('Le code du pays est requis');
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
      Lib_Pays: this.Lib_Pays,
      Cod_Pays: this.Cod_Pays,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Pays;
