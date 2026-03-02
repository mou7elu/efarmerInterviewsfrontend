/**
 * Piece Entity
 * Domain entity representing an identity document type reference data
 */
class Piece {
  constructor({ id, Nom_piece, createdAt, updatedAt }) {
    this.id = id;
    this.Nom_piece = Nom_piece;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Validates if the entity is valid
   * @returns {Object} validation result with isValid and errors
   */
  validate() {
    const errors = [];

    if (!this.Nom_piece || this.Nom_piece.trim() === '') {
      errors.push('Le nom de la pièce est requis');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Converts entity to plain object for data transfer
   * @returns {Object} DTO
   */
  toDTO() {
    return {
      id: this.id,
      Nom_piece: this.Nom_piece,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Piece;
