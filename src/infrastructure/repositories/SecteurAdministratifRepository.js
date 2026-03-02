const BaseRepository = require('./BaseRepository');
const SecteurAdministratifModel = require('../../../models/SecteurAdministratif');

/**
 * SecteurAdministratifRepository
 * Repository for SecteurAdministratif entity with specific methods
 */
class SecteurAdministratifRepository extends BaseRepository {
  constructor() {
    super(SecteurAdministratifModel);
  }

  /**
   * Find secteur by code
   * @param {string} code - Secteur code
   * @returns {Promise<Object|null>} Found secteur or null
   */
  async findByCode(code) {
    return await this.findOne({ Cod_SecteurAdministratif: code });
  }

  /**
   * Find all secteurs by souspref ID
   * @param {string} sousprefId - Souspref ID
   * @returns {Promise<Array>} Array of secteurs
   */
  async findBySousprefId(sousprefId) {
    return await this.findAll({ SousprefId: sousprefId });
  }

  /**
   * Check if secteur code exists
   * @param {string} code - Secteur code
   * @param {string} excludeId - ID to exclude from check (for updates)
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async codeExists(code, excludeId = null) {
    const filters = { Cod_SecteurAdministratif: code };
    if (excludeId) {
      filters._id = { $ne: excludeId };
    }
    return await this.exists(filters);
  }

  /**
   * Check if secteur code exists in a specific souspref
   * @param {string} code - Secteur code
   * @param {string} sousprefId - Souspref ID
   * @param {string} excludeId - ID to exclude from check (for updates)
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async codeExistsInSouspref(code, sousprefId, excludeId = null) {
    const filters = { Cod_SecteurAdministratif: code, SousprefId: sousprefId };
    if (excludeId) {
      filters._id = { $ne: excludeId };
    }
    return await this.exists(filters);
  }

  /**
   * Get all secteurs with populated souspref
   * @returns {Promise<Array>} Array of secteurs with populated souspref
   */
  async getAllWithSouspref() {
    return await this.findAll({}, { populate: 'SousprefId' });
  }
}

module.exports = SecteurAdministratifRepository;
