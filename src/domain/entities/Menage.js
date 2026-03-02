/**
 * Menage Entity
 * Domain entity representing a household with complete geographic hierarchy
 */
class Menage {
  constructor({
    id, Cod_menage, HasanacProducteur, NomChefMenage, PrenomChefMenage, ContactChefMenage,
    NombreExploitants, ExploitantIsPresent, RepresentantIsPresent, NomRepresentant,
    PrenomRepresentant, ContactRepresentant, CoordonneesGPS, MilieuResidence,
    PaysId, DistrictId, RegionId, DepartementId, SousprefId, SecteurAdministratifId,
    ZonedenombreId, VillageId, LocaliteId, EnqueteurId, createdAt, updatedAt
  }) {
    this.id = id;
    this.Cod_menage = Cod_menage;
    this.HasanacProducteur = HasanacProducteur;
    this.NomChefMenage = NomChefMenage;
    this.PrenomChefMenage = PrenomChefMenage;
    this.ContactChefMenage = ContactChefMenage;
    this.NombreExploitants = NombreExploitants;
    this.ExploitantIsPresent = ExploitantIsPresent;
    this.RepresentantIsPresent = RepresentantIsPresent;
    this.NomRepresentant = NomRepresentant;
    this.PrenomRepresentant = PrenomRepresentant;
    this.ContactRepresentant = ContactRepresentant;
    this.CoordonneesGPS = CoordonneesGPS;
    this.MilieuResidence = MilieuResidence;
    this.PaysId = PaysId;
    this.DistrictId = DistrictId;
    this.RegionId = RegionId;
    this.DepartementId = DepartementId;
    this.SousprefId = SousprefId;
    this.SecteurAdministratifId = SecteurAdministratifId;
    this.ZonedenombreId = ZonedenombreId;
    this.VillageId = VillageId;
    this.LocaliteId = LocaliteId;
    this.EnqueteurId = EnqueteurId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Validates if the entity is valid
   * @returns {Object} validation result with isValid and errors
   */
  validate() {
    const errors = [];

    if (!this.Cod_menage || this.Cod_menage.trim() === '') {
      errors.push('Le code du ménage est requis');
    }

    // NomChefMenage et PrenomChefMenage sont optionnels
    // Ils peuvent être remplis plus tard

    // Validate all geographic references
    if (!this.PaysId) errors.push('La référence au pays est requise');
    if (!this.DistrictId) errors.push('La référence au district est requise');
    if (!this.RegionId) errors.push('La référence à la région est requise');
    if (!this.DepartementId) errors.push('La référence au département est requise');
    if (!this.SousprefId) errors.push('La référence à la sous-préfecture est requise');
    if (!this.SecteurAdministratifId) errors.push('La référence au secteur administratif est requise');
    if (!this.ZonedenombreId) errors.push('La référence à la zone de dénombrement est requise');
    if (!this.VillageId) errors.push('La référence au village est requise');
    if (!this.EnqueteurId) errors.push('La référence à l\'enquêteur est requise');

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
      Cod_menage: this.Cod_menage,
      HasanacProducteur: this.HasanacProducteur,
      NomChefMenage: this.NomChefMenage,
      PrenomChefMenage: this.PrenomChefMenage,
      ContactChefMenage: this.ContactChefMenage,
      NombreExploitants: this.NombreExploitants,
      ExploitantIsPresent: this.ExploitantIsPresent,
      RepresentantIsPresent: this.RepresentantIsPresent,
      NomRepresentant: this.NomRepresentant,
      PrenomRepresentant: this.PrenomRepresentant,
      ContactRepresentant: this.ContactRepresentant,
      CoordonneesGPS: this.CoordonneesGPS,
      MilieuResidence: this.MilieuResidence,
      PaysId: this.PaysId,
      DistrictId: this.DistrictId,
      RegionId: this.RegionId,
      DepartementId: this.DepartementId,
      SousprefId: this.SousprefId,
      SecteurAdministratifId: this.SecteurAdministratifId,
      ZonedenombreId: this.ZonedenombreId,
      VillageId: this.VillageId,
      LocaliteId: this.LocaliteId,
      EnqueteurId: this.EnqueteurId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Menage;
