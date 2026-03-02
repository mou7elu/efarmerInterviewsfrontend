const { BaseEntity } = require('./BaseEntity');
const { ValidationError } = require('../../shared/errors/ValidationError');

/**
 * Entité représentant un village dans le système
 */
class VillageEntity extends BaseEntity {
  constructor(data) {
    super(data);
    this.libVillage = data.Lib_village || data.libVillage;
    this.coordonnee = data.Coordonnee || data.coordonnee || null;
    this.paysId = data.PaysId || data.paysId;
    this._validate();
  }

  _validate() {
    super._validate();
    
    if (!this.libVillage || typeof this.libVillage !== 'string' || this.libVillage.trim().length === 0) {
      throw new ValidationError('Le libellé du village est obligatoire');
    }

    if (this.libVillage.length > 100) {
      throw new ValidationError('Le libellé du village ne peut pas dépasser 100 caractères');
    }

    if (!this.paysId) {
      throw new ValidationError('L\'identifiant du pays est obligatoire');
    }

    if (this.coordonnee && typeof this.coordonnee !== 'string') {
      throw new ValidationError('Les coordonnées doivent être une chaîne de caractères');
    }
  }

  /**
   * Met à jour le libellé du village
   */
  updateLibelle(nouveauLibelle) {
    if (!nouveauLibelle || typeof nouveauLibelle !== 'string' || nouveauLibelle.trim().length === 0) {
      throw new ValidationError('Le nouveau libellé du village est obligatoire');
    }

    if (nouveauLibelle.length > 100) {
      throw new ValidationError('Le libellé du village ne peut pas dépasser 100 caractères');
    }

    this.libVillage = nouveauLibelle.trim();
    this.updatedAt = new Date();
  }

  /**
   * Met à jour les coordonnées du village
   */
  updateCoordonnees(nouvellesCoordonnees) {
    if (nouvellesCoordonnees && typeof nouvellesCoordonnees !== 'string') {
      throw new ValidationError('Les coordonnées doivent être une chaîne de caractères');
    }

    this.coordonnee = nouvellesCoordonnees;
    this.updatedAt = new Date();
  }

  /**
   * Change le pays de rattachement du village
   */
  changePays(nouveauPaysId) {
    if (!nouveauPaysId) {
      throw new ValidationError('L\'identifiant du nouveau pays est obligatoire');
    }

    this.paysId = nouveauPaysId;
    this.updatedAt = new Date();
  }

  /**
   * Vérifie si le village a des coordonnées géographiques
   */
  hasCoordinates() {
    return this.coordonnee !== null && this.coordonnee !== '';
  }

  /**
   * Convertit l'entité en objet pour la persistance
   */
  toPersistence() {
    return {
      _id: this.id,
      Lib_village: this.libVillage,
      Coordonnee: this.coordonnee,
      PaysId: this.paysId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Crée une entité à partir des données de persistance
   */
  static fromPersistence(data) {
    return new VillageEntity({
      id: data._id?.toString() || data.id,
      Lib_village: data.Lib_village,
      Coordonnee: data.Coordonnee,
      PaysId: data.PaysId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
  }
}

module.exports = { VillageEntity };