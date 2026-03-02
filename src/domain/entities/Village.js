/**
 * Village Entity
 * Domain entity representing a village within a zone
 */
class Village {
  constructor({ id, Lib_Village, Cod_Village, ZonedenombreId, createdAt, updatedAt }) {
    this.id = id;
    this.Lib_Village = Lib_Village;
    this.Cod_Village = Cod_Village;
    this.ZonedenombreId = ZonedenombreId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Validates if the entity is valid
   * @returns {Object} validation result with isValid and errors
   */
  validate() {
    const errors = [];

    if (!this.Lib_Village || this.Lib_Village.trim() === '') {
      errors.push('Le libellé du village est requis');
    }

    if (!this.Cod_Village || this.Cod_Village.trim() === '') {
      errors.push('Le code du village est requis');
    }

    if (!this.ZonedenombreId) {
      errors.push('La référence à la zone de dénombrement est requise');
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
      Lib_Village: this.Lib_Village,
      Cod_Village: this.Cod_Village,
      ZonedenombreId: this.ZonedenombreId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Village;
