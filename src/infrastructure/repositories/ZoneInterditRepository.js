const BaseRepository = require('./BaseRepository');
const ZoneInterditModel = require('../../../models/Zone_interdit');

/**
 * ZoneInterditRepository
 * Repository for ZoneInterdit entity with specific methods
 */
class ZoneInterditRepository extends BaseRepository {
  constructor() {
    super(ZoneInterditModel);
  }

  /**
   * Find zones interdites by pays ID
   * @param {string} paysId - Pays ID
   * @returns {Promise<Array>} Array of zones interdites
   */
  async findByPaysId(paysId) {
    return await this.findAll({ PaysId: paysId });
  }

  /**
   * Find all active zones interdites
   * @returns {Promise<Array>} Array of active zones interdites
   */
  async findActive() {
    return await this.findAll({ Sommeil: false });
  }

  /**
   * Find all inactive zones interdites
   * @returns {Promise<Array>} Array of inactive zones interdites
   */
  async findInactive() {
    return await this.findAll({ Sommeil: true });
  }

  /**
   * Get all zones with populated pays
   * @returns {Promise<Array>} Array of zones with populated pays
   */
  async getAllWithPays() {
    return await this.findAll({}, { populate: 'PaysId' });
  }

  /**
   * Find zones with coordinates
   * @returns {Promise<Array>} Array of zones that have coordinate data
   */
  async findWithCoordinates() {
    return await this.findAll({ Coordonnee: { $ne: null } });
  }
}

module.exports = ZoneInterditRepository;
