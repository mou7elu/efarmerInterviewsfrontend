/**
 * Localite Entity
 * Domain entity representing a locality within a village
 */
class Localite {
  constructor({ id, Lib_localite, Cod_localite, VillageId, createdAt, updatedAt }) {
    this.id = id;
    this.Lib_localite = Lib_localite;
    this.Cod_localite = Cod_localite;
    this.VillageId = VillageId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Validates if the entity is valid
   * @returns {Object} validation result with isValid and errors
   */
  validate() {
    const errors = [];

    if (!this.Lib_localite || this.Lib_localite.trim() === '') {
      errors.push('Le libellé de la localité est requis');
    }

    if (!this.Cod_localite || this.Cod_localite.trim() === '') {
      errors.push('Le code de la localité est requis');
    }

    if (!this.VillageId) {
      errors.push('La référence au village est requise');
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
      Lib_localite: this.Lib_localite,
      Cod_localite: this.Cod_localite,
      VillageId: this.VillageId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Localite;
