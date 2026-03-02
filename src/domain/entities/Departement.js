/**
 * Departement Entity
 * Domain entity representing a department within a region
 */
class Departement {
  constructor({ id, Lib_Depart, Cod_Depart, RegionId, createdAt, updatedAt }) {
    this.id = id;
    this.Lib_Depart = Lib_Depart;
    this.Cod_Depart = Cod_Depart;
    this.RegionId = RegionId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Validates if the entity is valid
   * @returns {Object} validation result with isValid and errors
   */
  validate() {
    const errors = [];

    if (!this.Lib_Depart || this.Lib_Depart.trim() === '') {
      errors.push('Le libellé du département est requis');
    }

    if (!this.Cod_Depart || this.Cod_Depart.trim() === '') {
      errors.push('Le code du département est requis');
    }

    if (!this.RegionId) {
      errors.push('La référence à la région est requise');
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
      Lib_Depart: this.Lib_Depart,
      Cod_Depart: this.Cod_Depart,
      RegionId: this.RegionId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Departement;
