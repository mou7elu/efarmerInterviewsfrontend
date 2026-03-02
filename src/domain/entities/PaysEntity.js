const { BaseEntity } = require('./BaseEntity');
const { ValidationError } = require('../../shared/errors/ValidationError');
const { Libelle } = require('../value-objects/Libelle');

/**
 * Entité représentant un pays dans le système
 */
class PaysEntity extends BaseEntity {
  constructor(data) {
    const {
      id,
      libPays,
      sommeil = false,
      createdAt,
      updatedAt
    } = data;

    super(id);
    
    // Validation du type sommeil
    if (typeof sommeil !== 'boolean') {
      throw new ValidationError('Le sommeil doit être un booléen');
    }

    this.libPays = new Libelle(libPays);
    this.sommeil = sommeil;
    
    if (createdAt) this._createdAt = new Date(createdAt);
    if (updatedAt) this._updatedAt = new Date(updatedAt);
  }

  /**
   * Active le pays (le sort du mode sommeil)
   */
  activer() {
    if (!this.sommeil) {
      return this; // Déjà actif
    }

    return new PaysEntity({
      id: this.id,
      libPays: this.libPays.value,
      sommeil: false,
      createdAt: this.createdAt,
      updatedAt: new Date()
    });
  }

  /**
   * Met en sommeil le pays
   */
  mettreDormir() {
    if (this.sommeil) {
      return this; // Déjà en sommeil
    }

    return new PaysEntity({
      id: this.id,
      libPays: this.libPays.value,
      sommeil: true,
      createdAt: this.createdAt,
      updatedAt: new Date()
    });
  }

  /**
   * Change le libellé du pays
   */
  changerLibelle(nouveauLibelle) {
    const nouveauLibelleObj = new Libelle(nouveauLibelle);
    
    if (this.libPays.equals(nouveauLibelleObj)) {
      return this; // Même libellé
    }

    return new PaysEntity({
      id: this.id,
      libPays: nouveauLibelle,
      sommeil: this.sommeil,
      createdAt: this.createdAt,
      updatedAt: new Date()
    });
  }

  /**
   * Vérifie si le pays est actif
   */
  estActif() {
    return !this.sommeil;
  }

  /**
   * Vérifie si le pays est en sommeil
   */
  estEnSommeil() {
    return this.sommeil;
  }

  /**
   * Convertit vers un DTO
   */
  toDTO() {
    return {
      id: this.id,
      libPays: this.libPays.value,
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
      Lib_pays: this.libPays.value,
      Sommeil: this.sommeil,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Crée une entité depuis les données de persistance
   */
  static fromPersistence(data) {
    return new PaysEntity({
      id: data._id?.toString() || data.id,
      libPays: data.Lib_pays,
      sommeil: data.Sommeil || false,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
  }
}

module.exports = { PaysEntity };