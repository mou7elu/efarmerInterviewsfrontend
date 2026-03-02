/**
 * SecteurAdministratif Entity
 * Domain entity representing an administrative sector within a sous-préfecture
 */
class SecteurAdministratif {
  constructor({ id, Lib_SecteurAdministratif, Cod_SecteurAdministratif, SousprefId, createdAt, updatedAt }) {
    this.id = id;
    this.Lib_SecteurAdministratif = Lib_SecteurAdministratif;
    this.Cod_SecteurAdministratif = Cod_SecteurAdministratif;
    this.SousprefId = SousprefId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Validates if the entity is valid
   * @returns {Object} validation result with isValid and errors
   */
  validate() {
    const errors = [];

    if (!this.Lib_SecteurAdministratif || this.Lib_SecteurAdministratif.trim() === '') {
      errors.push('Le libellé du secteur administratif est requis');
    }

    if (!this.Cod_SecteurAdministratif || this.Cod_SecteurAdministratif.trim() === '') {
      errors.push('Le code du secteur administratif est requis');
    }

    if (!this.SousprefId) {
      errors.push('La référence à la sous-préfecture est requise');
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
      Lib_SecteurAdministratif: this.Lib_SecteurAdministratif,
      Cod_SecteurAdministratif: this.Cod_SecteurAdministratif,
      SousprefId: this.SousprefId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = SecteurAdministratif;
