const BaseRepository = require('./BaseRepository');
const ProfessionModel = require('../../../models/Profession');

/**
 * ProfessionRepository
 * Repository for Profession entity with specific methods
 */
class ProfessionRepository extends BaseRepository {
  constructor() {
    super(ProfessionModel);
  }

  /**
   * Find profession by name
   * @param {string} name - Profession name
   * @returns {Promise<Object|null>} Found profession or null
   */
  async findByName(name) {
    return await this.findOne({ Lib_Profession: name });
  }

  /**
   * Get all professions sorted by name
   * @returns {Promise<Array>} Array of professions sorted alphabetically
   */
  async getAllSorted() {
    return await this.findAll({}, { sort: { Lib_Profession: 1 } });
  }
}

module.exports = ProfessionRepository;
