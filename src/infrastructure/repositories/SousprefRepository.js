const BaseRepository = require('./BaseRepository');
const SousprefModel = require('../../../models/Souspref');

/**
 * SousprefRepository
 * Repository for Souspref entity with specific methods
 */
class SousprefRepository extends BaseRepository {
  constructor() {
    super(SousprefModel);
  }

  /**
   * Find souspref by code
   * @param {string} code - Souspref code
   * @returns {Promise<Object|null>} Found souspref or null
   */
  async findByCode(code) {
    return await this.findOne({ Cod_Souspref: code });
  }

  /**
   * Find all souspref by departement ID
   * @param {string} departementId - Departement ID
   * @returns {Promise<Array>} Array of souspref
   */
  async findByDepartementId(departementId) {
    return await this.findAll({ DepartementId: departementId });
  }

  /**
   * Check if souspref code exists
   * @param {string} code - Souspref code
   * @param {string} excludeId - ID to exclude from check (for updates)
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async codeExists(code, excludeId = null) {
    const filters = { Cod_Souspref: code };
    if (excludeId) {
      filters._id = { $ne: excludeId };
    }
    return await this.exists(filters);
  }

  /**
   * Check if souspref code exists in a specific departement
   * @param {string} code - Souspref code
   * @param {string} departementId - Departement ID
   * @param {string} excludeId - ID to exclude from check (for updates)
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async codeExistsInDepartement(code, departementId, excludeId = null) {
    const filters = { Cod_Souspref: code, DepartementId: departementId };
    if (excludeId) {
      filters._id = { $ne: excludeId };
    }
    return await this.exists(filters);
  }

  /**
   * Get all souspref with populated departement
   * @returns {Promise<Array>} Array of souspref with populated departement
   */
  async getAllWithDepartement() {
    return await this.findAll({}, { populate: 'DepartementId' });
  }
}

module.exports = SousprefRepository;
