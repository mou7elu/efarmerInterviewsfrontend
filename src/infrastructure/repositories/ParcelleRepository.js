const BaseRepository = require('./BaseRepository');
const ParcelleModel = require('../../../models/Parcelle');

/**
 * ParcelleRepository
 * Repository for Parcelle entity with specific methods
 */
class ParcelleRepository extends BaseRepository {
  constructor() {
    super(ParcelleModel);
  }

  /**
   * Find parcelle by code
   * @param {string} code - Parcelle code
   * @returns {Promise<Object|null>} Found parcelle or null
   */
  async findByCode(code) {
    return await this.findOne({ Code: code });
  }

  /**
   * Find all parcelles by producteur ID
   * @param {string} producteurId - Producteur ID
   * @returns {Promise<Array>} Array of parcelles
   */
  async findByProducteurId(producteurId) {
    return await this.findAll({ ProducteurId: producteurId });
  }

  /**
   * Find all parcelles by menage ID
   * @param {string} menageId - Menage ID
   * @returns {Promise<Array>} Array of parcelles
   */
  async findByMenageId(menageId) {
    return await this.findAll({ MenageId: menageId });
  }

  /**
   * Check if parcelle code exists
   * @param {string} code - Parcelle code
   * @param {string} excludeId - ID to exclude from check (for updates)
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async codeExists(code, excludeId = null) {
    const filters = { Code: code };
    if (excludeId) {
      filters._id = { $ne: excludeId };
    }
    return await this.exists(filters);
  }

  /**
   * Find parcelles in same locality as exploitant
   * @returns {Promise<Array>} Array of parcelles
   */
  async findInSameLocality() {
    return await this.findAll({ IsSameLocalitethanExploitant: true });
  }

  /**
   * Find parcelles in different locality
   * @returns {Promise<Array>} Array of parcelles
   */
  async findInDifferentLocality() {
    return await this.findAll({ IsSameLocalitethanExploitant: false });
  }

  /**
   * Find parcelles with certification
   * @returns {Promise<Array>} Array of certified parcelles
   */
  async findCertified() {
    return await this.findAll({ HasCertificationProgramme: true });
  }

  /**
   * Find parcelles that are rehabilitated
   * @returns {Promise<Array>} Array of rehabilitated parcelles
   */
  async findRehabilitees() {
    return await this.findAll({ HasParcelleRehabilitee: true });
  }

  /**
   * Find parcelles using fertilizers
   * @returns {Promise<Array>} Array of parcelles using fertilizers
   */
  async findWithEngrais() {
    return await this.findAll({ HasUseEngrais: true });
  }

  /**
   * Find parcelles using phytosanitary products
   * @returns {Promise<Array>} Array of parcelles using phytosanitary
   */
  async findWithPhytosanitaire() {
    return await this.findAll({ HasUsePhytosanitaire: true });
  }

  /**
   * Find parcelles with crop associations
   * @returns {Promise<Array>} Array of parcelles with crop associations
   */
  async findWithAssociationCulturelle() {
    return await this.findAll({ HasAssociationCulturelle: true });
  }

  /**
   * Find parcelles where anacarde is main culture
   * @returns {Promise<Array>} Array of parcelles
   */
  async findWithAnacardePrincipal() {
    return await this.findAll({ HasAnarcadePrincipaleCulture: true });
  }

  /**
   * Get statistics by criteria
   * @param {Object} criteria - Aggregation criteria
   * @returns {Promise<Array>} Aggregated statistics
   */
  async getStatistics(criteria = {}) {
    return await ParcelleModel.aggregate([
      { $match: criteria },
      {
        $group: {
          _id: null,
          totalParcelles: { $sum: 1 },
          totalSuperficie: { $sum: '$Superficie' },
          avgSuperficie: { $avg: '$Superficie' },
          totalSuperficieProductive: { $sum: '$SuperficieProductive' },
          totalSuperficieNonProductive: { $sum: '$SuperficieNonProductive' },
          totalTonnageLastYear: { $sum: '$TonnageLastYear' },
          avgPrixVente: { $avg: '$PrixVenteLastYear' }
        }
      }
    ]);
  }

  /**
   * Get all parcelles with full references populated
   * @returns {Promise<Array>} Array of parcelles with populated references
   */
  async getAllWithReferences() {
    return await this.findAll({}, {
      populate: [
        'MenageId',
        'ProducteurId',
        'RegionId',
        'DepartementId',
        'SousprefId',
        'SecteurAdministratifId',
        'ZonedenombreId',
        'LocaliteId'
      ]
    });
  }

  /**
   * Find parcelles by localite ID
   * @param {string} localiteId - Localite ID
   * @returns {Promise<Array>} Array of parcelles
   */
  async findByLocaliteId(localiteId) {
    return await this.findAll({ LocaliteId: localiteId });
  }

  /**
   * Find parcelles by year of creation
   * @param {number} year - Year of creation
   * @returns {Promise<Array>} Array of parcelles
   */
  async findByYearOfCreation(year) {
    return await this.findAll({ yearofcreationParcelle: year });
  }

  /**
   * Find parcelles by production start year
   * @param {number} year - Production start year
   * @returns {Promise<Array>} Array of parcelles
   */
  async findByProductionStartYear(year) {
    return await this.findAll({ yearofProductionStart: year });
  }
}

module.exports = ParcelleRepository;
