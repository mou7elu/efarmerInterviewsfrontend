const BaseRepository = require('./BaseRepository');
const ZonedenombreModel = require('../../../models/Zonedenombre');

/**
 * ZonedenombreRepository
 * Repository for Zonedenombre entity with specific methods
 */
class ZonedenombreRepository extends BaseRepository {
  constructor() {
    super(ZonedenombreModel);
  }

  /**
   * Find zone by code
   * @param {string} code - Zone code
   * @returns {Promise<Object|null>} Found zone or null
   */
  async findByCode(code) {
    return await this.findOne({ Cod_ZD: code });
  }

  /**
   * Find all zones by secteur administratif ID
   * @param {string} secteurId - Secteur administratif ID
   * @returns {Promise<Array>} Array of zones
   */
  async findBySecteurAdministratifId(secteurId) {
    return await this.findAll({ SecteurAdministratifId: secteurId });
  }

  /**
   * Check if zone code exists
   * @param {string} code - Zone code
   * @param {string} excludeId - ID to exclude from check (for updates)
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async codeExists(code, excludeId = null) {
    const filters = { Cod_ZD: code };
    if (excludeId) {
      filters._id = { $ne: excludeId };
    }
    return await this.exists(filters);
  }

  /**
   * Check if zone code exists in a specific secteur administratif
   * @param {string} code - Zone code
   * @param {string} secteurId - Secteur administratif ID
   * @param {string} excludeId - ID to exclude from check (for updates)
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async codeExistsInSecteur(code, secteurId, excludeId = null) {
    const filters = { Cod_ZD: code, SecteurAdministratifId: secteurId };
    if (excludeId) {
      filters._id = { $ne: excludeId };
    }
    return await this.exists(filters);
  }

  /**
   * Get all zones with populated secteur
   * @returns {Promise<Array>} Array of zones with populated secteur
   */
  async getAllWithSecteur() {
    return await this.findAll({}, { populate: 'SecteurAdministratifId' });
  }
}

module.exports = ZonedenombreRepository;
