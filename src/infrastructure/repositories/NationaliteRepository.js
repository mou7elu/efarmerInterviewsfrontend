const BaseRepository = require('./BaseRepository');
const NationaliteModel = require('../../../models/Nationalite');

/**
 * NationaliteRepository
 * Repository for Nationalite entity with specific methods
 */
class NationaliteRepository extends BaseRepository {
  constructor() {
    super(NationaliteModel);
  }

  /**
   * Find nationalite by name
   * @param {string} name - Nationalite name
   * @returns {Promise<Object|null>} Found nationalite or null
   */
  async findByName(name) {
    return await this.findOne({ Lib_Nation: name });
  }

  /**
   * Get all nationalites sorted by name
   * @returns {Promise<Array>} Array of nationalites sorted alphabetically
   */
  async getAllSorted() {
    return await this.findAll({}, { sort: { Lib_Nation: 1 } });
  }
}

module.exports = NationaliteRepository;
