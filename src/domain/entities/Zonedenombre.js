/**
 * Zonedenombre Entity
 * Domain entity representing a counting zone within an administrative sector
 */
class Zonedenombre {
  constructor({ id, Lib_ZD, Cod_ZD, SecteurAdministratifId, createdAt, updatedAt }) {
    this.id = id;
    this.Lib_ZD = Lib_ZD;
    this.Cod_ZD = Cod_ZD;
    this.SecteurAdministratifId = SecteurAdministratifId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Validates if the entity is valid
   * @returns {Object} validation result with isValid and errors
   */
  validate() {
    const errors = [];

    if (!this.Lib_ZD || this.Lib_ZD.trim() === '') {
      errors.push('Le libellé de la zone de dénombrement est requis');
    }

    if (!this.Cod_ZD || this.Cod_ZD.trim() === '') {
      errors.push('Le code de la zone de dénombrement est requis');
    }

    if (!this.SecteurAdministratifId) {
      errors.push('La référence au secteur administratif est requise');
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
      Lib_ZD: this.Lib_ZD,
      Cod_ZD: this.Cod_ZD,
      SecteurAdministratifId: this.SecteurAdministratifId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Zonedenombre;
