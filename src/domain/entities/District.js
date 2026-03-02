/**
 * District Entity
 * Domain entity representing a district within a country
 */
class District {
  constructor({ id, Lib_District, Cod_District, PaysId, createdAt, updatedAt }) {
    this.id = id;
    this.Lib_District = Lib_District;
    this.Cod_District = Cod_District;
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

    if (!this.Lib_District || this.Lib_District.trim() === '') {
      errors.push('Le libellé du district est requis');
    }

    if (!this.Cod_District || this.Cod_District.trim() === '') {
      errors.push('Le code du district est requis');
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
   * Converts entity to plain object for data transfer
   * @returns {Object} DTO
   */
  toDTO() {
    return {
      id: this.id,
      Lib_District: this.Lib_District,
      Cod_District: this.Cod_District,
      PaysId: this.PaysId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = District;
