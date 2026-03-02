const { BaseEntity } = require('./BaseEntity');
const { ValidationError } = require('../../shared/errors/ValidationError');

/**
 * Entité représentant un niveau scolaire dans le système
 */
class NiveauScolaireEntity extends BaseEntity {
  constructor(data) {
    super(data);
    this.libNiveauScolaire = data.Lib_NiveauScolaire || data.libNiveauScolaire;
    this.ordre = data.ordre || 0;
    this._validate();
  }

  _validate() {
    super._validate();
    
    if (!this.libNiveauScolaire || typeof this.libNiveauScolaire !== 'string' || this.libNiveauScolaire.trim().length === 0) {
      throw new ValidationError('Le libellé du niveau scolaire est obligatoire');
    }

    if (this.libNiveauScolaire.length > 100) {
      throw new ValidationError('Le libellé du niveau scolaire ne peut pas dépasser 100 caractères');
    }

    if (typeof this.ordre !== 'number' || this.ordre < 0) {
      throw new ValidationError('L\'ordre doit être un nombre positif');
    }
  }

  /**
   * Met à jour le libellé du niveau scolaire
   */
  updateLibelle(nouveauLibelle) {
    if (!nouveauLibelle || typeof nouveauLibelle !== 'string' || nouveauLibelle.trim().length === 0) {
      throw new ValidationError('Le nouveau libellé du niveau scolaire est obligatoire');
    }

    if (nouveauLibelle.length > 100) {
      throw new ValidationError('Le libellé du niveau scolaire ne peut pas dépasser 100 caractères');
    }

    this.libNiveauScolaire = nouveauLibelle.trim();
    this.updatedAt = new Date();
  }

  /**
   * Met à jour l'ordre du niveau scolaire
   */
  updateOrdre(nouvelOrdre) {
    if (typeof nouvelOrdre !== 'number' || nouvelOrdre < 0) {
      throw new ValidationError('L\'ordre doit être un nombre positif');
    }

    this.ordre = nouvelOrdre;
    this.updatedAt = new Date();
  }

  /**
   * Vérifie si c'est un niveau supérieur
   */
  isNiveauSuperieur() {
    return this.libNiveauScolaire.toLowerCase().includes('supérieur');
  }

  /**
   * Vérifie si c'est un niveau professionnel
   */
  isNiveauProfessionnel() {
    return this.libNiveauScolaire.toLowerCase().includes('professionnel') ||
           this.libNiveauScolaire.toLowerCase().includes('formation');
  }

  /**
   * Convertit l'entité en objet pour la persistance
   */
  toPersistence() {
    return {
      _id: this.id,
      Lib_NiveauScolaire: this.libNiveauScolaire,
      ordre: this.ordre,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Crée une entité à partir des données de persistance
   */
  static fromPersistence(data) {
    return new NiveauScolaireEntity({
      id: data._id?.toString() || data.id,
      Lib_NiveauScolaire: data.Lib_NiveauScolaire,
      ordre: data.ordre || 0,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
  }
}

module.exports = { NiveauScolaireEntity };