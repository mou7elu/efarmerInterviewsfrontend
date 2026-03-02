const BaseRepository = require('./BaseRepository');
const NiveauScolaireModel = require('../../../models/NiveauScolaire');

/**
 * NiveauScolaireRepository
 * Repository for NiveauScolaire entity with specific methods
 */
class NiveauScolaireRepository extends BaseRepository {
  constructor() {
    super(NiveauScolaireModel);
  }

  /**
   * Find niveau scolaire by name
   * @param {string} name - Niveau scolaire name
   * @returns {Promise<Object|null>} Found niveau scolaire or null
   */
  async findByName(name) {
    return await this.findOne({ Lib_NiveauScolaire: name });
  }

  /**
   * Get all niveaux scolaires sorted by name
   * @returns {Promise<Array>} Array of niveaux scolaires sorted alphabetically
   */
  async getAllSorted() {
    return await this.findAll({}, { sort: { Lib_NiveauScolaire: 1 } });
  }
}

module.exports = NiveauScolaireRepository;
