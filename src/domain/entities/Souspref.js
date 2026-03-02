/**
 * Souspref Entity
 * Domain entity representing a sous-préfecture within a department
 */
class Souspref {
  constructor({ id, Lib_Souspref, Cod_Souspref, DepartementId, createdAt, updatedAt }) {
    this.id = id;
    this.Lib_Souspref = Lib_Souspref;
    this.Cod_Souspref = Cod_Souspref;
    this.DepartementId = DepartementId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Validates if the entity is valid
   * @returns {Object} validation result with isValid and errors
   */
  validate() {
    const errors = [];

    if (!this.Lib_Souspref || this.Lib_Souspref.trim() === '') {
      errors.push('Le libellé de la sous-préfecture est requis');
    }

    if (!this.Cod_Souspref || this.Cod_Souspref.trim() === '') {
      errors.push('Le code de la sous-préfecture est requis');
    }

    if (!this.DepartementId) {
      errors.push('La référence au département est requise');
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
      Lib_Souspref: this.Lib_Souspref,
      Cod_Souspref: this.Cod_Souspref,
      DepartementId: this.DepartementId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Souspref;
