const { BaseEntity } = require('./BaseEntity');
const { ValidationError } = require('../../shared/errors/ValidationError');
const { Libelle } = require('../value-objects/Libelle');

/**
 * Entité représentant un district dans le système
 */
class DistrictEntity extends BaseEntity {
  constructor(data) {
    const {
      id,
      libDistrict,
      paysId,
      sommeil = false,
      createdAt,
      updatedAt
    } = data;

    super(id);
    
    // Validation des champs obligatoires
    if (!paysId) {
      throw new ValidationError('L\'ID du pays est requis');
    }

    if (!paysId || typeof paysId !== 'string' || paysId.trim().length === 0) {
      throw new ValidationError('L\'ID du pays ne peut pas être vide');
    }

    // Validation du type sommeil
    if (typeof sommeil !== 'boolean') {
      throw new ValidationError('Le sommeil doit être un booléen');
    }

    this.libDistrict = new Libelle(libDistrict);
    this.paysId = paysId;
    this.sommeil = sommeil;
    
    if (createdAt) this._createdAt = new Date(createdAt);
    if (updatedAt) this._updatedAt = new Date(updatedAt);
  }

  /**
   * Active le district (le sort du mode sommeil)
   */
  activer() {
    if (!this.sommeil) {
      return this; // Déjà actif
    }

    return new DistrictEntity({
      id: this.id,
      libDistrict: this.libDistrict.value,
      paysId: this.paysId,
      sommeil: false,
      createdAt: this.createdAt,
      updatedAt: new Date()
    });
  }

  /**
   * Met en sommeil le district
   */
  mettreDormir() {
    if (this.sommeil) {
      return this; // Déjà en sommeil
    }

    return new DistrictEntity({
      id: this.id,
      libDistrict: this.libDistrict.value,
      paysId: this.paysId,
      sommeil: true,
      createdAt: this.createdAt,
      updatedAt: new Date()
    });
  }

  /**
   * Change le libellé du district
   */
  changerLibelle(nouveauLibelle) {
    const nouveauLibelleObj = new Libelle(nouveauLibelle);
    
    if (this.libDistrict.equals(nouveauLibelleObj)) {
      return this; // Même libellé
    }

    return new DistrictEntity({
      id: this.id,
      libDistrict: nouveauLibelle,
      paysId: this.paysId,
      sommeil: this.sommeil,
      createdAt: this.createdAt,
      updatedAt: new Date()
    });
  }

  /**
   * Change le pays du district
   */
  changerPays(nouveauPaysId) {
    if (!nouveauPaysId || typeof nouveauPaysId !== 'string' || nouveauPaysId.trim().length === 0) {
      throw new ValidationError('L\'ID du pays ne peut pas être vide');
    }

    if (this.paysId === nouveauPaysId) {
      return this; // Même pays
    }

    return new DistrictEntity({
      id: this.id,
      libDistrict: this.libDistrict.value,
      paysId: nouveauPaysId,
      sommeil: this.sommeil,
      createdAt: this.createdAt,
      updatedAt: new Date()
    });
  }

  /**
   * Vérifie si le district est actif
   */
  estActif() {
    return !this.sommeil;
  }

  /**
   * Vérifie si le district est en sommeil
   */
  estEnSommeil() {
    return this.sommeil;
  }

  /**
   * Vérifie si le district appartient au pays donné
   */
  appartientAuPays(paysId) {
    if (!paysId || typeof paysId !== 'string' || paysId.trim().length === 0) {
      throw new ValidationError('L\'ID du pays ne peut pas être vide');
    }

    return this.paysId === paysId;
  }

  /**
   * Convertit vers un DTO
   */
  toDTO() {
    return {
      id: this.id,
      libDistrict: this.libDistrict.value,
      paysId: this.paysId,
      sommeil: this.sommeil,
      statut: this.sommeil ? 'Inactif' : 'Actif',
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    };
  }

  /**
   * Convertit vers le format de persistance
   */
  toPersistence() {
    return {
      _id: this.id,
      Lib_district: this.libDistrict.value,
      PaysId: this.paysId,
      Sommeil: this.sommeil,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Crée une entité depuis les données de persistance
   */
  static fromPersistence(data) {
    return new DistrictEntity({
      id: data._id?.toString() || data.id,
      libDistrict: data.Lib_district,
      paysId: data.PaysId,
      sommeil: data.Sommeil || false,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
  }
}

module.exports = { DistrictEntity };