const { BaseEntity } = require('./BaseEntity');
const { ValidationError } = require('../../shared/errors/ValidationError');

/**
 * Entité représentant un département dans le système
 */
class DepartementEntity extends BaseEntity {
  constructor(data) {
    super(data);
    this.libDepartement = data.Lib_Departement || data.libDepartement;
    this.regionId = data.RegionId || data.regionId;
    this._validate();
  }

  _validate() {
    super._validate();
    
    if (!this.libDepartement || typeof this.libDepartement !== 'string' || this.libDepartement.trim().length === 0) {
      throw new ValidationError('Le libellé du département est obligatoire');
    }

    if (this.libDepartement.length > 100) {
      throw new ValidationError('Le libellé du département ne peut pas dépasser 100 caractères');
    }

    if (!this.regionId) {
      throw new ValidationError('L\'identifiant de la région est obligatoire');
    }
  }

  /**
   * Met à jour le libellé du département
   */
  updateLibelle(nouveauLibelle) {
    if (!nouveauLibelle || typeof nouveauLibelle !== 'string' || nouveauLibelle.trim().length === 0) {
      throw new ValidationError('Le nouveau libellé du département est obligatoire');
    }

    if (nouveauLibelle.length > 100) {
      throw new ValidationError('Le libellé du département ne peut pas dépasser 100 caractères');
    }

    this.libDepartement = nouveauLibelle.trim();
    this.updatedAt = new Date();
  }

  /**
   * Change la région de rattachement du département
   */
  changeRegion(nouvelleRegionId) {
    if (!nouvelleRegionId) {
      throw new ValidationError('L\'identifiant de la nouvelle région est obligatoire');
    }

    this.regionId = nouvelleRegionId;
    this.updatedAt = new Date();
  }

  /**
   * Convertit l'entité en objet pour la persistance
   */
  toPersistence() {
    return {
      _id: this.id,
      Lib_Departement: this.libDepartement,
      RegionId: this.regionId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Crée une entité à partir des données de persistance
   */
  static fromPersistence(data) {
    return new DepartementEntity({
      id: data._id?.toString() || data.id,
      Lib_Departement: data.Lib_Departement,
      RegionId: data.RegionId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
  }
}

module.exports = { DepartementEntity };