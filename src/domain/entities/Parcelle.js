/**
 * Parcelle Entity
 * Domain entity representing an agricultural plot
 */
class Parcelle {
  constructor(data) {
    this.id = data.id;
    this.Superficie = data.Superficie || 0;
    this.Coordonnee = data.Coordonnee || null;
    this.MenageId = data.MenageId;
    this.ProducteurId = data.ProducteurId;
    this.Code = data.Code;
    this.IsSameLocalitethanExploitant = data.IsSameLocalitethanExploitant !== undefined ? data.IsSameLocalitethanExploitant : true;
    
    // Geographic references
    this.RegionId = data.RegionId;
    this.DepartementId = data.DepartementId;
    this.SousprefId = data.SousprefId;
    this.SecteurAdministratifId = data.SecteurAdministratifId;
    this.ZonedenombreId = data.ZonedenombreId;
    this.LocaliteId = data.LocaliteId;
    this.MilieuResidence = data.MilieuResidence || 0;
    
    // Plot characteristics
    this.yearofcreationParcelle = data.yearofcreationParcelle;
    this.yearofProductionStart = data.yearofProductionStart;
    this.SuperficieProductive = data.SuperficieProductive || 0;
    this.SuperficieNonProductive = data.SuperficieNonProductive || 0;
    this.TypeFaitValoirParcelle = data.TypeFaitValoirParcelle;
    this.TonnageLastYear = data.TonnageLastYear || 0;
    this.PrixVenteLastYear = data.PrixVenteLastYear || 0;
    this.NombreEntretien = data.NombreEntretien || 0;
    this.ProvenanceDesPlants = data.ProvenanceDesPlants || [];
    
    // Certifications and services
    this.HasCertificationProgramme = data.HasCertificationProgramme || false;
    this.HasRecoursServicesConseils = data.HasRecoursServicesConseils || false;
    this.RecoursServices = data.RecoursServices || 0;
    this.HasParcelleRehabilitee = data.HasParcelleRehabilitee || false;
    this.SuperficieRehabilitee = data.SuperficieRehabilitee || 0;
    
    // Inputs
    this.HasUseEngrais = data.HasUseEngrais || false;
    this.HasUsePhytosanitaire = data.HasUsePhytosanitaire || false;
    this.Depenses = data.Depenses || [];
    
    // Crop associations
    this.HasAssociationCulturelle = data.HasAssociationCulturelle || false;
    this.AssociationCulturelle = data.AssociationCulturelle || [];
    this.HasAnarcadePrincipaleCulture = data.HasAnarcadePrincipaleCulture || false;
    
    // Labor
    this.MainOeuvre = data.MainOeuvre || [];
    this.SalaireMainOeuvre = data.SalaireMainOeuvre || 0;
    
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  /**
   * Validates if the entity is valid
   * @returns {Object} validation result with isValid and errors
   */
  validate() {
    const errors = [];

    if (!this.Code || this.Code.trim() === '') {
      errors.push('Le code de la parcelle est requis');
    }

    if (!this.MenageId) {
      errors.push('La référence au ménage est requise');
    }

    if (!this.ProducteurId) {
      errors.push('La référence au producteur est requise');
    }

    if (!this.yearofcreationParcelle) {
      errors.push('L\'année de création de la parcelle est requise');
    }

    if (!this.yearofProductionStart) {
      errors.push('L\'année d\'entrée en production est requise');
    }

    if (!this.TypeFaitValoirParcelle) {
      errors.push('Le type de fait valoir est requis');
    }

    // Validate geographic references if not same locality as exploitant
    if (!this.IsSameLocalitethanExploitant) {
      if (!this.RegionId) errors.push('La référence à la région est requise');
      if (!this.DepartementId) errors.push('La référence au département est requise');
      if (!this.SousprefId) errors.push('La référence à la sous-préfecture est requise');
      if (!this.SecteurAdministratifId) errors.push('La référence au secteur administratif est requise');
      if (!this.ZonedenombreId) errors.push('La référence à la zone de dénombrement est requise');
      if (!this.LocaliteId) errors.push('La référence à la localité est requise');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Calculates total expenses
   * @returns {number}
   */
  getTotalExpenses() {
    return this.Depenses.reduce((total, depense) => total + (depense.Montant || 0), 0);
  }

  /**
   * Converts entity to plain object for data transfer
   * @returns {Object} DTO
   */
  toDTO() {
    return {
      id: this.id,
      Superficie: this.Superficie,
      Coordonnee: this.Coordonnee,
      ProducteurId: this.ProducteurId,
      Code: this.Code,
      IsSameLocalitethanExploitant: this.IsSameLocalitethanExploitant,
      RegionId: this.RegionId,
      DepartementId: this.DepartementId,
      SousprefId: this.SousprefId,
      SecteurAdministratifId: this.SecteurAdministratifId,
      ZonedenombreId: this.ZonedenombreId,
      LocaliteId: this.LocaliteId,
      MilieuResidence: this.MilieuResidence,
      yearofcreationParcelle: this.yearofcreationParcelle,
      yearofProductionStart: this.yearofProductionStart,
      SuperficieProductive: this.SuperficieProductive,
      SuperficieNonProductive: this.SuperficieNonProductive,
      TypeFaitValoirParcelle: this.TypeFaitValoirParcelle,
      TonnageLastYear: this.TonnageLastYear,
      PrixVenteLastYear: this.PrixVenteLastYear,
      NombreEntretien: this.NombreEntretien,
      ProvenanceDesPlants: this.ProvenanceDesPlants,
      HasCertificationProgramme: this.HasCertificationProgramme,
      HasRecoursServicesConseils: this.HasRecoursServicesConseils,
      RecoursServices: this.RecoursServices,
      HasParcelleRehabilitee: this.HasParcelleRehabilitee,
      SuperficieRehabilitee: this.SuperficieRehabilitee,
      HasUseEngrais: this.HasUseEngrais,
      HasUsePhytosanitaire: this.HasUsePhytosanitaire,
      Depenses: this.Depenses,
      HasAssociationCulturelle: this.HasAssociationCulturelle,
      AssociationCulturelle: this.AssociationCulturelle,
      HasAnarcadePrincipaleCulture: this.HasAnarcadePrincipaleCulture,
      MainOeuvre: this.MainOeuvre,
      SalaireMainOeuvre: this.SalaireMainOeuvre,
      MenageId: this.MenageId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Parcelle;
