const { BaseEntity } = require('./BaseEntity');
const { ValidationError } = require('../../shared/errors/ValidationError');

/**
 * Entité représentant une pièce d'identité dans le système
 */
class PieceEntity extends BaseEntity {
  constructor(data) {
    super(data);
    this.nomPiece = data.Nom_piece || data.nomPiece;
    this.validiteDuree = data.validiteDuree || null; // en années
    this.obligatoire = data.obligatoire || false;
    this._validate();
  }

  _validate() {
    super._validate();
    
    if (!this.nomPiece || typeof this.nomPiece !== 'string' || this.nomPiece.trim().length === 0) {
      throw new ValidationError('Le nom de la pièce est obligatoire');
    }

    if (this.nomPiece.length > 100) {
      throw new ValidationError('Le nom de la pièce ne peut pas dépasser 100 caractères');
    }

    if (this.validiteDuree !== null && (typeof this.validiteDuree !== 'number' || this.validiteDuree <= 0)) {
      throw new ValidationError('La durée de validité doit être un nombre positif');
    }

    if (typeof this.obligatoire !== 'boolean') {
      throw new ValidationError('Le caractère obligatoire doit être un booléen');
    }
  }

  /**
   * Met à jour le nom de la pièce
   */
  updateNom(nouveauNom) {
    if (!nouveauNom || typeof nouveauNom !== 'string' || nouveauNom.trim().length === 0) {
      throw new ValidationError('Le nouveau nom de la pièce est obligatoire');
    }

    if (nouveauNom.length > 100) {
      throw new ValidationError('Le nom de la pièce ne peut pas dépasser 100 caractères');
    }

    this.nomPiece = nouveauNom.trim();
    this.updatedAt = new Date();
  }

  /**
   * Met à jour la durée de validité
   */
  updateValiditeDuree(nouvelleDuree) {
    if (nouvelleDuree !== null && (typeof nouvelleDuree !== 'number' || nouvelleDuree <= 0)) {
      throw new ValidationError('La durée de validité doit être un nombre positif');
    }

    this.validiteDuree = nouvelleDuree;
    this.updatedAt = new Date();
  }

  /**
   * Marque la pièce comme obligatoire
   */
  rendreObligatoire() {
    this.obligatoire = true;
    this.updatedAt = new Date();
  }

  /**
   * Marque la pièce comme non obligatoire
   */
  rendreOptionnelle() {
    this.obligatoire = false;
    this.updatedAt = new Date();
  }

  /**
   * Vérifie si la pièce a une durée de validité limitée
   */
  hasValiditeLimitee() {
    return this.validiteDuree !== null;
  }

  /**
   * Vérifie si c'est une pièce d'identité officielle
   */
  isIdentiteOfficielle() {
    const nomLower = this.nomPiece.toLowerCase();
    return nomLower.includes('carte nationale') || 
           nomLower.includes('passeport') || 
           nomLower.includes('permis');
  }

  /**
   * Convertit l'entité en objet pour la persistance
   */
  toPersistence() {
    return {
      _id: this.id,
      Nom_piece: this.nomPiece,
      validiteDuree: this.validiteDuree,
      obligatoire: this.obligatoire,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Crée une entité à partir des données de persistance
   */
  static fromPersistence(data) {
    return new PieceEntity({
      id: data._id?.toString() || data.id,
      Nom_piece: data.Nom_piece,
      validiteDuree: data.validiteDuree,
      obligatoire: data.obligatoire || false,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
  }
}

module.exports = { PieceEntity };