const { BaseEntity } = require('./BaseEntity');
const { ValidationError } = require('../../shared/errors/ValidationError');

/**
 * Entité représentant une section dans un volet
 */
class SectionEntity extends BaseEntity {
  constructor(data) {
    super(data);
    this.titre = data.titre;
    this.ordre = data.ordre;
    this.voletId = data.voletId;
    this._validate();
  }

  _validate() {
    super._validate();
    
    if (!this.titre || typeof this.titre !== 'string' || this.titre.trim().length === 0) {
      throw new ValidationError('Le titre de la section est obligatoire');
    }

    if (this.titre.length > 200) {
      throw new ValidationError('Le titre de la section ne peut pas dépasser 200 caractères');
    }

    if (typeof this.ordre !== 'number' || this.ordre < 1) {
      throw new ValidationError('L\'ordre doit être un nombre positif');
    }

    if (!this.voletId) {
      throw new ValidationError('L\'identifiant du volet est obligatoire');
    }
  }

  /**
   * Met à jour le titre de la section
   */
  updateTitre(nouveauTitre) {
    if (!nouveauTitre || typeof nouveauTitre !== 'string' || nouveauTitre.trim().length === 0) {
      throw new ValidationError('Le nouveau titre de la section est obligatoire');
    }

    if (nouveauTitre.length > 200) {
      throw new ValidationError('Le titre de la section ne peut pas dépasser 200 caractères');
    }

    this.titre = nouveauTitre.trim();
    this.updatedAt = new Date();
  }

  /**
   * Met à jour l'ordre de la section
   */
  updateOrdre(nouvelOrdre) {
    if (typeof nouvelOrdre !== 'number' || nouvelOrdre < 1) {
      throw new ValidationError('L\'ordre doit être un nombre positif');
    }

    this.ordre = nouvelOrdre;
    this.updatedAt = new Date();
  }

  /**
   * Change le volet de rattachement
   */
  changeVolet(nouveauVoletId) {
    if (!nouveauVoletId) {
      throw new ValidationError('L\'identifiant du nouveau volet est obligatoire');
    }

    this.voletId = nouveauVoletId;
    this.updatedAt = new Date();
  }

  /**
   * Convertit l'entité en objet pour la persistance
   */
  toPersistence() {
    return {
      _id: this.id,
      titre: this.titre,
      ordre: this.ordre,
      voletId: this.voletId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Crée une entité à partir des données de persistance
   */
  static fromPersistence(data) {
    return new SectionEntity({
      id: data._id?.toString() || data.id,
      titre: data.titre,
      ordre: data.ordre,
      voletId: data.voletId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
  }
}

module.exports = { SectionEntity };