const BaseRepository = require('./BaseRepository');
const DistrictModel = require('../../../models/district');

/**
 * DistrictRepository
 * Repository for District entity with specific methods
 */
class DistrictRepository extends BaseRepository {
  constructor() {
    super(DistrictModel);
  }

  /**
   * Find district by code
   * @param {string} code - District code
   * @returns {Promise<Object|null>} Found district or null
   */
  async findByCode(code) {
    return await this.findOne({ Cod_District: code });
  }

  /**
   * Find all districts by country ID
   * @param {string} paysId - Country ID
   * @returns {Promise<Array>} Array of districts
   */
  async findByPaysId(paysId) {
    return await this.findAll({ PaysId: paysId });
  }

  /**
   * Check if district code exists
   * @param {string} code - District code
   * @param {string} excludeId - ID to exclude from check (for updates)
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async codeExists(code, excludeId = null) {
    const filters = { Cod_district: code };
    if (excludeId) {
      filters._id = { $ne: excludeId };
    }
    return await this.exists(filters);
  }

  /**
   * Check if district code exists in a specific country
   * @param {string} code - District code
   * @param {string} paysId - Country ID
   * @param {string} excludeId - ID to exclude from check (for updates)
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async codeExistsInPays(code, paysId, excludeId = null) {
    const filters = { Cod_district: code, PaysId: paysId };
    if (excludeId) {
      filters._id = { $ne: excludeId };
    }
    return await this.exists(filters);
  }

  /**
   * Get all districts with populated country
   * @returns {Promise<Array>} Array of districts with populated pays
   */
  async getAllWithPays() {
    return await this.findAll({}, { populate: 'PaysId' });
  }
}

module.exports = DistrictRepository;
