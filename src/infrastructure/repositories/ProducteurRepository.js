const BaseRepository = require('./BaseRepository');
const ProducteurModel = require('../../../models/Producteur');

/**
 * ProducteurRepository
 * Repository for Producteur entity with specific methods
 */
class ProducteurRepository extends BaseRepository {
  constructor() {
    super(ProducteurModel);
  }

  /**
   * Find producteur by code
   * @param {string} code - Producteur code
   * @returns {Promise<Object|null>} Found producteur or null
   */
  async findByCode(code) {
    return await this.findOne({ Code: code });
  }

  /**
   * Find all producteurs by menage ID
   * @param {string} menageId - Menage ID
   * @returns {Promise<Array>} Array of producteurs
   */
  async findByMenageId(menageId) {
    return await this.findAll({ MenageId: menageId });
  }

  /**
   * Find all producteurs by enqueteur ID
   * @param {string} enqueteurId - Enqueteur ID
   * @returns {Promise<Array>} Array of producteurs
   */
  async findByEnqueteurId(enqueteurId) {
    return await this.findAll({ EnqueteurId: enqueteurId });
  }

  /**
   * Check if producteur code exists
   * @param {string} code - Producteur code
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
   * Find exploitants (IsExploitant = true)
   * @returns {Promise<Array>} Array of exploitants
   */
  async findExploitants() {
    return await this.findAll({ IsExploitant: true });
  }

  /**
   * Find represented exploitants (IsExploitant = false)
   * @returns {Promise<Array>} Array of represented exploitants
   */
  async findRepresented() {
    return await this.findAll({ IsExploitant: false });
  }

  /**
   * Find producteurs with other speculations
   * @returns {Promise<Array>} Array of producteurs with other speculations
   */
  async findWithOtherSpeculations() {
    return await this.findAll({ HasPratiqueOtherSpeculation: true });
  }

  /**
   * Find producteurs with vivier cultures
   * @returns {Promise<Array>} Array of producteurs with vivier cultures
   */
  async findWithCulturesVivrier() {
    return await this.findAll({ HasPratiqueCulturesVivrier: true });
  }

  /**
   * Find producteurs with mobile money
   * @returns {Promise<Array>} Array of producteurs with mobile money
   */
  async findWithMobileMoney() {
    return await this.findAll({ HasMobileMoney: true });
  }

  /**
   * Find producteurs with bank account
   * @returns {Promise<Array>} Array of producteurs with bank account
   */
  async findWithBankAccount() {
    return await this.findAll({ HasCompteBancaire: true });
  }

  /**
   * Get statistics by criteria
   * @param {Object} criteria - Aggregation criteria
   * @returns {Promise<Array>} Aggregated statistics
   */
  async getStatistics(criteria = {}) {
    return await ProducteurModel.aggregate([
      { $match: criteria },
      {
        $group: {
          _id: null,
          totalProducteurs: { $sum: 1 },
          avgSurfaceAgricole: { $avg: '$SurfaceAgricoleTotaleHa' },
          avgMembresMenage: { $avg: '$NombreMembresMenage' },
          totalExploitants: { $sum: { $cond: ['$IsExploitant', 1, 0] } }
        }
      }
    ]);
  }

  /**
   * Get all producteurs with full references populated
   * @returns {Promise<Array>} Array of producteurs with populated references
   */
  async getAllWithReferences() {
    return await this.findAll({}, {
      populate: [
        'MenageId',
        'EnqueteurId',
        'PaysNaissRepresentant',
        'LieuNaissRepresentant',
        'PaysNaissExploitant',
        'LieuNaissExploitant',
        'PaysdorigineRepresentant',
        'PaysdorigineExploitant'
      ]
    });
  }
}

module.exports = ProducteurRepository;
