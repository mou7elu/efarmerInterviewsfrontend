/**
 * Region Entity
 * Domain entity representing a region within a district
 */
class Region {
  constructor({ id, Lib_region, Cod_region, DistrictId, createdAt, updatedAt }) {
    this.id = id;
    this.Lib_region = Lib_region;
    this.Cod_region = Cod_region;
    this.DistrictId = DistrictId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Validates if the entity is valid
   * @returns {Object} validation result with isValid and errors
   */
  validate() {
    const errors = [];

    if (!this.Lib_region || this.Lib_region.trim() === '') {
      errors.push('Le libellé de la région est requis');
    }

    if (!this.Cod_region || this.Cod_region.trim() === '') {
      errors.push('Le code de la région est requis');
    }

    if (!this.DistrictId) {
      errors.push('La référence au district est requise');
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
      Lib_region: this.Lib_region,
      Cod_region: this.Cod_region,
      DistrictId: this.DistrictId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Region;
