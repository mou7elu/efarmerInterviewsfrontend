const { BaseEntity } = require('./BaseEntity');
const { ValidationError } = require('../../shared/errors/ValidationError');

/**
 * Entité représentant une sous-préfecture dans le système
 */
class SousprefEntity extends BaseEntity {
  constructor(data) {
    super(data);
    this.libSouspref = data.Lib_Souspref || data.libSouspref;
    this.departementId = data.DepartementId || data.departementId;
    this._validate();
  }

  _validate() {
    super._validate();
    
    if (!this.libSouspref || typeof this.libSouspref !== 'string' || this.libSouspref.trim().length === 0) {
      throw new ValidationError('Le libellé de la sous-préfecture est obligatoire');
    }

    if (this.libSouspref.length > 100) {
      throw new ValidationError('Le libellé de la sous-préfecture ne peut pas dépasser 100 caractères');
    }

    if (!this.departementId) {
      throw new ValidationError('L\'identifiant du département est obligatoire');
    }
  }

  /**
   * Met à jour le libellé de la sous-préfecture
   */
  updateLibelle(nouveauLibelle) {
    if (!nouveauLibelle || typeof nouveauLibelle !== 'string' || nouveauLibelle.trim().length === 0) {
      throw new ValidationError('Le nouveau libellé de la sous-préfecture est obligatoire');
    }

    if (nouveauLibelle.length > 100) {
      throw new ValidationError('Le libellé de la sous-préfecture ne peut pas dépasser 100 caractères');
    }

    this.libSouspref = nouveauLibelle.trim();
    this.updatedAt = new Date();
  }

  /**
   * Change le département de rattachement de la sous-préfecture
   */
  changeDepartement(nouveauDepartementId) {
    if (!nouveauDepartementId) {
      throw new ValidationError('L\'identifiant du nouveau département est obligatoire');
    }

    this.departementId = nouveauDepartementId;
    this.updatedAt = new Date();
  }

  /**
   * Convertit l'entité en objet pour la persistance
   */
  toPersistence() {
    return {
      _id: this.id,
      Lib_Souspref: this.libSouspref,
      DepartementId: this.departementId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Crée une entité à partir des données de persistance
   */
  static fromPersistence(data) {
    return new SousprefEntity({
      id: data._id?.toString() || data.id,
      Lib_Souspref: data.Lib_Souspref,
      DepartementId: data.DepartementId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
  }
}

module.exports = { SousprefEntity };