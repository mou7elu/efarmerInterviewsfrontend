const { BaseEntity } = require('./BaseEntity');
const { ValidationError } = require('../../shared/errors/ValidationError');

/**
 * Entité représentant une nationalité dans le système
 */
class NationaliteEntity extends BaseEntity {
  constructor(data) {
    super(data);
    this.libNation = data.Lib_Nation || data.libNation;
    this._validate();
  }

  _validate() {
    super._validate();
    
    if (!this.libNation || typeof this.libNation !== 'string' || this.libNation.trim().length === 0) {
      throw new ValidationError('Le libellé de la nationalité est obligatoire');
    }

    if (this.libNation.length > 50) {
      throw new ValidationError('Le libellé de la nationalité ne peut pas dépasser 50 caractères');
    }
  }

  /**
   * Met à jour le libellé de la nationalité
   */
  updateLibelle(nouveauLibelle) {
    if (!nouveauLibelle || typeof nouveauLibelle !== 'string' || nouveauLibelle.trim().length === 0) {
      throw new ValidationError('Le nouveau libellé de la nationalité est obligatoire');
    }

    if (nouveauLibelle.length > 50) {
      throw new ValidationError('Le libellé de la nationalité ne peut pas dépasser 50 caractères');
    }

    this.libNation = nouveauLibelle.trim();
    this.updatedAt = new Date();
  }

  /**
   * Normalise le libellé (première lettre en majuscule)
   */
  normalizeLibelle() {
    if (this.libNation) {
      this.libNation = this.libNation.charAt(0).toUpperCase() + this.libNation.slice(1).toLowerCase();
      this.updatedAt = new Date();
    }
  }

  /**
   * Convertit l'entité en objet pour la persistance
   */
  toPersistence() {
    return {
      _id: this.id,
      Lib_Nation: this.libNation,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Crée une entité à partir des données de persistance
   */
  static fromPersistence(data) {
    return new NationaliteEntity({
      id: data._id?.toString() || data.id,
      Lib_Nation: data.Lib_Nation,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
  }
}

module.exports = { NationaliteEntity };