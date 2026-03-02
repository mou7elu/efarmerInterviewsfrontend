const BaseRepository = require('./BaseRepository');
const RegionModel = require('../../../models/Region');

/**
 * RegionRepository
 * Repository for Region entity with specific methods
 */
class RegionRepository extends BaseRepository {
  constructor() {
    super(RegionModel);
  }

  /**
   * Find region by code
   * @param {string} code - Region code
   * @returns {Promise<Object|null>} Found region or null
   */
  async findByCode(code) {
    return await this.findOne({ Cod_region: code });
  }

  /**
   * Find all regions by district ID
   * @param {string} districtId - District ID
   * @returns {Promise<Array>} Array of regions
   */
  async findByDistrictId(districtId) {
    return await this.findAll({ DistrictId: districtId });
  }

  /**
   * Check if region code exists
   * @param {string} code - Region code
   * @param {string} excludeId - ID to exclude from check (for updates)
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async codeExists(code, excludeId = null) {
    const filters = { Cod_region: code };
    if (excludeId) {
      filters._id = { $ne: excludeId };
    }
    return await this.exists(filters);
  }

  /**
   * Check if region code exists in a specific district
   * @param {string} code - Region code
   * @param {string} districtId - District ID
   * @param {string} excludeId - ID to exclude from check (for updates)
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async codeExistsInDistrict(code, districtId, excludeId = null) {
    const filters = { Cod_region: code, DistrictId: districtId };
    if (excludeId) {
      filters._id = { $ne: excludeId };
    }
    return await this.exists(filters);
  }

  /**
   * Get all regions with populated district
   * @returns {Promise<Array>} Array of regions with populated district
   */
  async getAllWithDistrict() {
    return await this.findAll({}, { populate: 'DistrictId' });
  }
}

module.exports = RegionRepository;
