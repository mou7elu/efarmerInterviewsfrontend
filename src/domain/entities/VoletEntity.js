const { BaseEntity } = require('./BaseEntity');
const { ValidationError } = require('../../shared/errors/ValidationError');

/**
 * Entité représentant un volet dans un questionnaire
 */
class VoletEntity extends BaseEntity {
  constructor(data) {
    super(data);
    this.titre = data.titre;
    this.ordre = data.ordre;
    this.questionnaireId = data.questionnaireId;
    this._validate();
  }

  _validate() {
    super._validate();
    
    if (!this.titre || typeof this.titre !== 'string' || this.titre.trim().length === 0) {
      throw new ValidationError('Le titre du volet est obligatoire');
    }

    if (this.titre.length > 200) {
      throw new ValidationError('Le titre du volet ne peut pas dépasser 200 caractères');
    }

    if (typeof this.ordre !== 'number' || this.ordre < 1) {
      throw new ValidationError('L\'ordre doit être un nombre positif');
    }

    if (!this.questionnaireId) {
      throw new ValidationError('L\'identifiant du questionnaire est obligatoire');
    }
  }

  /**
   * Met à jour le titre du volet
   */
  updateTitre(nouveauTitre) {
    if (!nouveauTitre || typeof nouveauTitre !== 'string' || nouveauTitre.trim().length === 0) {
      throw new ValidationError('Le nouveau titre du volet est obligatoire');
    }

    if (nouveauTitre.length > 200) {
      throw new ValidationError('Le titre du volet ne peut pas dépasser 200 caractères');
    }

    this.titre = nouveauTitre.trim();
    this.updatedAt = new Date();
  }

  /**
   * Met à jour l'ordre du volet
   */
  updateOrdre(nouvelOrdre) {
    if (typeof nouvelOrdre !== 'number' || nouvelOrdre < 1) {
      throw new ValidationError('L\'ordre doit être un nombre positif');
    }

    this.ordre = nouvelOrdre;
    this.updatedAt = new Date();
  }

  /**
   * Change le questionnaire de rattachement
   */
  changeQuestionnaire(nouveauQuestionnaireId) {
    if (!nouveauQuestionnaireId) {
      throw new ValidationError('L\'identifiant du nouveau questionnaire est obligatoire');
    }

    this.questionnaireId = nouveauQuestionnaireId;
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
      questionnaireId: this.questionnaireId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Crée une entité à partir des données de persistance
   */
  static fromPersistence(data) {
    return new VoletEntity({
      id: data._id?.toString() || data.id,
      titre: data.titre,
      ordre: data.ordre,
      questionnaireId: data.questionnaireId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
  }
}

module.exports = { VoletEntity };