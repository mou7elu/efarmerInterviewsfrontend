const BaseRepository = require('./BaseRepository');
const PieceModel = require('../../../models/Piece');

/**
 * PieceRepository
 * Repository for Piece entity with specific methods
 */
class PieceRepository extends BaseRepository {
  constructor() {
    super(PieceModel);
  }

  /**
   * Find piece by name
   * @param {string} name - Piece name
   * @returns {Promise<Object|null>} Found piece or null
   */
  async findByName(name) {
    return await this.findOne({ Nom_piece: name });
  }

  /**
   * Get all pieces sorted by name
   * @returns {Promise<Array>} Array of pieces sorted alphabetically
   */
  async getAllSorted() {
    return await this.findAll({}, { sort: { Nom_piece: 1 } });
  }
}

module.exports = PieceRepository;
