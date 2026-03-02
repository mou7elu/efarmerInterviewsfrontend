const BaseRepository = require('./BaseRepository');
const DepartementModel = require('../../../models/Departement');

/**
 * DepartementRepository
 * Repository for Departement entity with specific methods
 */
class DepartementRepository extends BaseRepository {
  constructor() {
    super(DepartementModel);
  }

  /**
   * Find departement by code
   * @param {string} code - Departement code
   * @returns {Promise<Object|null>} Found departement or null
   */
  async findByCode(code) {
    return await this.findOne({ Cod_Depart: code });
  }

  /**
   * Find all departements by region ID
   * @param {string} regionId - Region ID
   * @returns {Promise<Array>} Array of departements
   */
  async findByRegionId(regionId) {
    return await this.findAll({ RegionId: regionId });
  }

  /**
   * Check if departement code exists
   * @param {string} code - Departement code
   * @param {string} excludeId - ID to exclude from check (for updates)
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async codeExists(code, excludeId = null) {
    const filters = { Cod_departement: code };
    if (excludeId) {
      filters._id = { $ne: excludeId };
    }
    return await this.exists(filters);
  }

  /**
   * Check if departement code exists in a specific region
   * @param {string} code - Departement code
   * @param {string} regionId - Region ID
   * @param {string} excludeId - ID to exclude from check (for updates)
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async codeExistsInRegion(code, regionId, excludeId = null) {
    const filters = { Cod_departement: code, RegionId: regionId };
    if (excludeId) {
      filters._id = { $ne: excludeId };
    }
    return await this.exists(filters);
  }

  /**
   * Get all departements with populated region
   * @returns {Promise<Array>} Array of departements with populated region
   */
  async getAllWithRegion() {
    return await this.findAll({}, { populate: 'RegionId' });
  }
}

module.exports = DepartementRepository;
