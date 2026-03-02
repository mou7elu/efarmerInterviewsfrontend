const BaseRepository = require('./BaseRepository');
const MenageModel = require('../../../models/Menage');

/**
 * MenageRepository
 * Repository for Menage entity with specific methods
 */
class MenageRepository extends BaseRepository {
  constructor() {
    super(MenageModel);
  }

  /**
   * Find menage by code
   * @param {string} code - Menage code
   * @returns {Promise<Object|null>} Found menage or null
   */
  async findByCode(code) {
    return await this.findOne({ Cod_menage: code });
  }

  /**
   * Find all menages by localite ID
   * @param {string} localiteId - Localite ID
   * @returns {Promise<Array>} Array of menages
   */
  async findByLocaliteId(localiteId) {
    return await this.findAll({ LocaliteId: localiteId });
  }

  /**
   * Find all menages by enqueteur ID
   * @param {string} enqueteurId - Enqueteur ID
   * @returns {Promise<Array>} Array of menages
   */
  async findByEnqueteurId(enqueteurId) {
    return await this.findAll({ EnqueteurId: enqueteurId });
  }

  /**
   * Check if menage code exists
   * @param {string} code - Menage code
   * @param {string} excludeId - ID to exclude from check (for updates)
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async codeExists(code, excludeId = null) {
    const filters = { Cod_menage: code };
    if (excludeId) {
      filters._id = { $ne: excludeId };
    }
    return await this.exists(filters);
  }

  /**
   * Get all menages with full geographic hierarchy
   * @returns {Promise<Array>} Array of menages with all populated references
   */
  async getAllWithFullHierarchy() {
    return await this.findAll({}, {
      populate: [
        'PaysId',
        'DistrictId',
        'RegionId',
        'DepartementId',
        'SousprefId',
        'SecteurAdministratifId',
        'ZonedenombreId',
        'VillageId',
        'LocaliteId',
        'EnqueteurId'
      ]
    });
  }

  /**
   * Find menages with anacarde producers
   * @returns {Promise<Array>} Array of menages with anacarde producers
   */
  async findWithAnacardeProducteurs() {
    return await this.findAll({ HasanacProducteur: true });
  }

  /**
   * Count menages by enqueteur and zone
   * @param {string} enqueteurId - Enqueteur ID
   * @param {string} zonedenombreId - Zone de dénombrement ID
   * @returns {Promise<number>} Count of menages
   */
  async countByEnqueteurAndZone(enqueteurId, zonedenombreId) {
    return await this.model.countDocuments({
      EnqueteurId: enqueteurId,
      ZonedenombreId: zonedenombreId
    });
  }
}

module.exports = MenageRepository;
