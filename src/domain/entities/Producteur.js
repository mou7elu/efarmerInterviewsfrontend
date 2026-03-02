/**
 * Producteur Entity
 * Domain entity representing a farmer/producer with comprehensive information
 */
class Producteur {
  constructor(data) {
    // Basic identification
    this.id = data.id;
    this.Code = data.Code;
    this.MenageId = data.MenageId;
    this.EnqueteurId = data.EnqueteurId;
    this.IsExploitant = data.IsExploitant || false;
    
    // Representative information (if IsExploitant is false)
    this.LienRepresentExploitant = data.LienRepresentExploitant;
    this.NomRepresentant = data.NomRepresentant;
    this.PrenomRepresentant = data.PrenomRepresentant;
    this.DateNaissRepresentant = data.DateNaissRepresentant;
    this.PaysNaissRepresentant = data.PaysNaissRepresentant;
    this.LieuNaissRepresentant = data.LieuNaissRepresentant;
    this.GenreRepresentant = data.GenreRepresentant;
    this.NiveauScolaireRepresentant = data.NiveauScolaireRepresentant;
    this.HasFormationAgricole = data.HasFormationAgricole || false;
    this.ProfessionRepresentant = data.ProfessionRepresentant;
    this.NatioliteRepresentant = data.NatioliteRepresentant;
    this.PaysdorigineRepresentant = data.PaysdorigineRepresentant;
    this.ContactPrincipalRepresentant = data.ContactPrincipalRepresentant;
    this.ContactSecondaireRepresentant = data.ContactSecondaireRepresentant;

    // Exploitant information (if IsExploitant is true)
    this.NomExploitant = data.NomExploitant;
    this.PrenomExploitant = data.PrenomExploitant;
    this.DateNaissExploitant = data.DateNaissExploitant;
    this.PaysNaissExploitant = data.PaysNaissExploitant;
    this.LieuNaissExploitant = data.LieuNaissExploitant;
    this.GenreExploitant = data.GenreExploitant;
    this.NiveauScolaireExploitant = data.NiveauScolaireExploitant;
    this.ProfessionExploitant = data.ProfessionExploitant;
    this.NationaliteExploitant = data.NationaliteExploitant;
    this.PaysdorigineExploitant = data.PaysdorigineExploitant;
    this.ContactPrincipalExploitant = data.ContactPrincipalExploitant;
    this.ContactSecondaireExploitant = data.ContactSecondaireExploitant;
    this.PhotoExploitant = data.PhotoExploitant;
    this.PhotoJustificative = data.PhotoJustificative;
    this.PieceExploitant = data.PieceExploitant;
    this.NumeroPieceExploitant = data.NumeroPieceExploitant;
    this.PrecisionPieceExploitant = data.PrecisionPieceExploitant;
    this.SituationMatrimonialeExploitant = data.SituationMatrimonialeExploitant;
    this.PrecisionSituationMatrimoniale = data.PrecisionSituationMatrimoniale;

    // Household composition
    this.NombreMembresMenage = data.NombreMembresMenage || 0;
    this.NombreEnfants = data.NombreEnfants || 0;
    this.NombreEnfantsScolarisés = data.NombreEnfantsScolarisés || 0;
    this.NombrePersonnesChargeHorMenage = data.NombrePersonnesChargeHorMenage || 0;
    this.NombreEpouse = data.NombreEpouse || 0;

    // Housing characteristics
    this.TypeBatimentResidence = data.TypeBatimentResidence || [];
    this.PreciserTypeBatiment = data.PreciserTypeBatiment;
    this.PrincipalMateriauBatiment = data.PrincipalMateriauBatiment || 0;
    this.PreciserMateriauBatiment = data.PreciserMateriauBatiment;
    this.PrincipalMateriauToit = data.PrincipalMateriauToit || 0;
    this.PreciserMateriauToit = data.PreciserMateriauToit;
    this.PrincipaleSourceEclairage = data.PrincipaleSourceEclairage || 0;
    this.PreciserSourceEclairage = data.PreciserSourceEclairage;
    this.PrincipaleSourceEau = data.PrincipaleSourceEau || 0;
    this.PreciserSourceEau = data.PreciserSourceEau;
    this.PrincipaleInstallationSanitaire = data.PrincipaleInstallationSanitaire || 0;
    this.PreciserInstallationSanitaire = data.PreciserInstallationSanitaire;
    this.PrincipaleSourceCombustible = data.PrincipaleSourceCombustible || 0;
    this.PreciserSourceCombustible = data.PreciserSourceCombustible;
    this.PrincipalMoyenMobilite = data.PrincipalMoyenMobilite || 0;

    // Infrastructure and equipment
    this.HasStockageBatimentAgricole = data.HasStockageBatimentAgricole || false;
    this.CapaciteStockageKg = data.CapaciteStockageKg || 0;
    this.HasMachineAgricole = data.HasMachineAgricole || false;
    this.MachineAgricole = data.MachineAgricole || [];
    this.PreciserMachineAgricole = data.PreciserMachineAgricole;
    this.EquipementSechageAgricole = data.EquipementSechageAgricole || 0;
    this.PreciserEquipementSechage = data.PreciserEquipementSechage;

    // Access to services
    this.ReseauxMobile = data.ReseauxMobile || [];
    this.HasInternet = data.HasInternet || false;
    this.HasInfastructureSante = data.HasInfastructureSante || false;
    this.distanceInfastructureSanteKm = data.distanceInfastructureSanteKm || 0;
    this.PraticienSante = data.PraticienSante || 0;
    this.DepenseSanteAnnuel = data.DepenseSanteAnnuel || 0;
    this.InfrastructueEducation = data.InfrastructueEducation || [];
    this.DistanceInfrastructureEducationKm = data.DistanceInfrastructureEducationKm || [];
    this.HasCompteBancaire = data.HasCompteBancaire || false;
    this.StructureBancaire = data.StructureBancaire || [];
    this.WhyPasCompteBancaire = data.WhyPasCompteBancaire || [];
    this.HasMobileMoney = data.HasMobileMoney || false;
    this.StructureMobileMoney = data.StructureMobileMoney || [];
    this.WhyPasMobileMoney = data.WhyPasMobileMoney || [];
    this.HasUseMobileMoneyService = data.HasUseMobileMoneyService || false;
    this.TypeServiceMobileMoney = data.TypeServiceMobileMoney || [];
    this.MontantMensuelMobileMoney = data.MontantMensuelMobileMoney || 0;
    this.MontantMaximumTransaction = data.MontantMaximumTransaction || 0;

    // Social and cultural aspects
    this.HasAppartenanceGroupe = data.HasAppartenanceGroupe || false;
    this.TypeGroupe = data.TypeGroupe || 0;
    this.SpecialiteGroupe = data.SpecialiteGroupe;
    this.HasAppartenanceTontine = data.HasAppartenanceTontine || false;
    this.TypeTontine = data.TypeTontine || [];
    this.MontantTontine = data.MontantTontine || 0;
    this.BienNatureTontine = data.BienNatureTontine || [];

    // Agricultural surface
    this.SurfaceAgricoleTotaleUseHa = data.SurfaceAgricoleTotaleUseHa || 0;
    this.SurfaceAgricoleTotaleJachèreHa = data.SurfaceAgricoleTotaleJachèreHa || 0;
    this.SurfaceAgricoleTotaleHa = data.SurfaceAgricoleTotaleHa || 0;

    // Cashew exploitation
    this.NombreParcellesAnacarde = data.NombreParcellesAnacarde || 1;
    this.OutillageExploitationAnacarde = data.OutillageExploitationAnacarde || [];
    this.PetitOutillageExploitationAnacarde = data.PetitOutillageExploitationAnacarde || [];
    this.MaterielTransportExploitationAnacarde = data.MaterielTransportExploitationAnacarde || [];
    this.HasPratiqueOtherSpeculation = data.HasPratiqueOtherSpeculation || false;

    // Other speculations
    this.OtherSpeculations = data.OtherSpeculations || [];
    this.HasPratiqueCulturesVivrier = data.HasPratiqueCulturesVivrier || false;
    this.CultureVivriers = data.CultureVivriers || [];
    this.TypeElevages = data.TypeElevages || [];

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
      errors.push('Le code du producteur est requis');
    }

    if (!this.MenageId) {
      errors.push('La référence au ménage est requise');
    }

    if (!this.EnqueteurId) {
      errors.push('La référence à l\'enquêteur est requise');
    }

    if (!this.IsExploitant) {
      if (this.LienRepresentExploitant === undefined || this.LienRepresentExploitant === null || this.LienRepresentExploitant === '') {
        errors.push('Le lien avec l\'exploitant est requis');
      }
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
      Code: this.Code,
      IsExploitant: this.IsExploitant,
      LienRepresentExploitant: this.LienRepresentExploitant,
      NomRepresentant: this.NomRepresentant,
      PrenomRepresentant: this.PrenomRepresentant,
      DateNaissRepresentant: this.DateNaissRepresentant,
      PaysNaissRepresentant: this.PaysNaissRepresentant,
      LieuNaissRepresentant: this.LieuNaissRepresentant,
      GenreRepresentant: this.GenreRepresentant,
      NiveauScolaireRepresentant: this.NiveauScolaireRepresentant,
      HasFormationAgricole: this.HasFormationAgricole,
      ProfessionRepresentant: this.ProfessionRepresentant,
      NatioliteRepresentant: this.NatioliteRepresentant,
      PaysdorigineRepresentant: this.PaysdorigineRepresentant,
      ContactPrincipalRepresentant: this.ContactPrincipalRepresentant,
      ContactSecondaireRepresentant: this.ContactSecondaireRepresentant,
      NomExploitant: this.NomExploitant,
      PrenomExploitant: this.PrenomExploitant,
      DateNaissExploitant: this.DateNaissExploitant,
      PaysNaissExploitant: this.PaysNaissExploitant,
      LieuNaissExploitant: this.LieuNaissExploitant,
      GenreExploitant: this.GenreExploitant,
      NiveauScolaireExploitant: this.NiveauScolaireExploitant,
      ProfessionExploitant: this.ProfessionExploitant,
      NationaliteExploitant: this.NationaliteExploitant,
      PaysdorigineExploitant: this.PaysdorigineExploitant,
      ContactPrincipalExploitant: this.ContactPrincipalExploitant,
      ContactSecondaireExploitant: this.ContactSecondaireExploitant,
      SituationMatrimonialeExploitant: this.SituationMatrimonialeExploitant,
      PrecisionSituationMatrimoniale: this.PrecisionSituationMatrimoniale,
      NombreMembresMenage: this.NombreMembresMenage,
      NombreEnfants: this.NombreEnfants,
      NombreEnfantsScolarisés: this.NombreEnfantsScolarisés,
      NombrePersonnesChargeHorMenage: this.NombrePersonnesChargeHorMenage,
      NombreEpouse: this.NombreEpouse,
      TypeBatimentResidence: this.TypeBatimentResidence,
      PreciserTypeBatiment: this.PreciserTypeBatiment,
      PrincipalMateriauBatiment: this.PrincipalMateriauBatiment,
      PreciserMateriauBatiment: this.PreciserMateriauBatiment,
      PrincipalMateriauToit: this.PrincipalMateriauToit,
      PreciserMateriauToit: this.PreciserMateriauToit,
      PrincipaleSourceEclairage: this.PrincipaleSourceEclairage,
      PreciserSourceEclairage: this.PreciserSourceEclairage,
      PrincipaleSourceEau: this.PrincipaleSourceEau,
      PreciserSourceEau: this.PreciserSourceEau,
      PrincipaleInstallationSanitaire: this.PrincipaleInstallationSanitaire,
      PreciserInstallationSanitaire: this.PreciserInstallationSanitaire,
      PrincipaleSourceCombustible: this.PrincipaleSourceCombustible,
      PreciserSourceCombustible: this.PreciserSourceCombustible,
      PrincipalMoyenMobilite: this.PrincipalMoyenMobilite,
      HasStockageBatimentAgricole: this.HasStockageBatimentAgricole,
      CapaciteStockageKg: this.CapaciteStockageKg,
      HasMachineAgricole: this.HasMachineAgricole,
      MachineAgricole: this.MachineAgricole,
      PreciserMachineAgricole: this.PreciserMachineAgricole,
      EquipementSechageAgricole: this.EquipementSechageAgricole,
      PreciserEquipementSechage: this.PreciserEquipementSechage,
      ReseauxMobile: this.ReseauxMobile,
      HasInternet: this.HasInternet,
      HasInfastructureSante: this.HasInfastructureSante,
      distanceInfastructureSanteKm: this.distanceInfastructureSanteKm,
      PraticienSante: this.PraticienSante,
      DepenseSanteAnnuel: this.DepenseSanteAnnuel,
      InfrastructueEducation: this.InfrastructueEducation,
      DistanceInfrastructureEducationKm: this.DistanceInfrastructureEducationKm,
      HasCompteBancaire: this.HasCompteBancaire,
      StructureBancaire: this.StructureBancaire,
      WhyPasCompteBancaire: this.WhyPasCompteBancaire,
      HasMobileMoney: this.HasMobileMoney,
      StructureMobileMoney: this.StructureMobileMoney,
      WhyPasMobileMoney: this.WhyPasMobileMoney,
      HasUseMobileMoneyService: this.HasUseMobileMoneyService,
      TypeServiceMobileMoney: this.TypeServiceMobileMoney,
      MontantMensuelMobileMoney: this.MontantMensuelMobileMoney,
      MontantMaximumTransaction: this.MontantMaximumTransaction,
      HasAppartenanceGroupe: this.HasAppartenanceGroupe,
      TypeGroupe: this.TypeGroupe,
      SpecialiteGroupe: this.SpecialiteGroupe,
      HasAppartenanceTontine: this.HasAppartenanceTontine,
      TypeTontine: this.TypeTontine,
      MontantTontine: this.MontantTontine,
      BienNatureTontine: this.BienNatureTontine,
      SurfaceAgricoleTotaleUseHa: this.SurfaceAgricoleTotaleUseHa,
      SurfaceAgricoleTotaleJachèreHa: this.SurfaceAgricoleTotaleJachèreHa,
      SurfaceAgricoleTotaleHa: this.SurfaceAgricoleTotaleHa,
      NombreParcellesAnacarde: this.NombreParcellesAnacarde,
      OutillageExploitationAnacarde: this.OutillageExploitationAnacarde,
      PetitOutillageExploitationAnacarde: this.PetitOutillageExploitationAnacarde,
      MaterielTransportExploitationAnacarde: this.MaterielTransportExploitationAnacarde,
      HasPratiqueOtherSpeculation: this.HasPratiqueOtherSpeculation,
      OtherSpeculations: this.OtherSpeculations,
      HasPratiqueCulturesVivrier: this.HasPratiqueCulturesVivrier,
      CultureVivriers: this.CultureVivriers,
      TypeElevages: this.TypeElevages,
      MenageId: this.MenageId,
      EnqueteurId: this.EnqueteurId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Producteur;
