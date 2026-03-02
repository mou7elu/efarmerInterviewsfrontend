const { BaseEntity } = require('./BaseEntity');
const { ValidationError } = require('../../shared/errors/ValidationError');

/**
 * Entité représentant une région dans le système
 */
class RegionEntity extends BaseEntity {
  constructor(data) {
    super(data);
    this.libRegion = data.Lib_region || data.libRegion;
    this.coordonnee = data.Coordonnee || data.coordonnee || null;
    this.sommeil = data.Sommeil || data.sommeil || false;
    this.districtId = data.DistrictId || data.districtId;
    this._validate();
  }

  _validate() {
    super._validate();
    
    if (!this.libRegion || typeof this.libRegion !== 'string' || this.libRegion.trim().length === 0) {
      throw new ValidationError('Le libellé de la région est obligatoire');
    }

    if (this.libRegion.length > 100) {
      throw new ValidationError('Le libellé de la région ne peut pas dépasser 100 caractères');
    }

    if (!this.districtId) {
      throw new ValidationError('L\'identifiant du district est obligatoire');
    }

    if (this.coordonnee && typeof this.coordonnee !== 'string') {
      throw new ValidationError('Les coordonnées doivent être une chaîne de caractères');
    }

    if (typeof this.sommeil !== 'boolean') {
      throw new ValidationError('Le statut sommeil doit être un booléen');
    }
  }

  /**
   * Active la région (la sort du mode sommeil)
   */
  activer() {
    this.sommeil = false;
    this.updatedAt = new Date();
  }

  /**
   * Désactive la région (la met en mode sommeil)
   */
  desactiver() {
    this.sommeil = true;
    this.updatedAt = new Date();
  }

  /**
   * Met à jour le libellé de la région
   */
  updateLibelle(nouveauLibelle) {
    if (!nouveauLibelle || typeof nouveauLibelle !== 'string' || nouveauLibelle.trim().length === 0) {
      throw new ValidationError('Le nouveau libellé de la région est obligatoire');
    }

    if (nouveauLibelle.length > 100) {
      throw new ValidationError('Le libellé de la région ne peut pas dépasser 100 caractères');
    }

    this.libRegion = nouveauLibelle.trim();
    this.updatedAt = new Date();
  }

  /**
   * Met à jour les coordonnées de la région
   */
  updateCoordonnees(nouvellesCoordonnees) {
    if (nouvellesCoordonnees && typeof nouvellesCoordonnees !== 'string') {
      throw new ValidationError('Les coordonnées doivent être une chaîne de caractères');
    }

    this.coordonnee = nouvellesCoordonnees;
    this.updatedAt = new Date();
  }

  /**
   * Vérifie si la région est active (non en sommeil)
   */
  isActive() {
    return !this.sommeil;
  }

  /**
   * Convertit l'entité en objet pour la persistance
   */
  toPersistence() {
    return {
      _id: this.id,
      Lib_region: this.libRegion,
      Coordonnee: this.coordonnee,
      Sommeil: this.sommeil,
      DistrictId: this.districtId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Crée une entité à partir des données de persistance
   */
  static fromPersistence(data) {
    return new RegionEntity({
      id: data._id?.toString() || data.id,
      Lib_region: data.Lib_region,
      Coordonnee: data.Coordonnee,
      Sommeil: data.Sommeil,
      DistrictId: data.DistrictId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
  }
}

module.exports = { RegionEntity };