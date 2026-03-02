const IBaseRepository = require('./IBaseRepository');

/**
 * Interface du repository pour les entités Departement
 */
class IDepartementRepository extends IBaseRepository {
  /**
   * Recherche un département par son libellé
   * @param {string} libDepartement - Libellé du département
   * @returns {Promise<DepartementEntity|null>}
   */
  async findByLibelle(libDepartement) {
    throw new Error('Method must be implemented');
  }

  /**
   * Recherche des départements par région
   * @param {string} regionId - Identifiant de la région
   * @returns {Promise<DepartementEntity[]>}
   */
  async findByRegionId(regionId) {
    throw new Error('Method must be implemented');
  }

  /**
   * Compte le nombre de départements par région
   * @param {string} regionId - Identifiant de la région
   * @returns {Promise<number>}
   */
  async countByRegionId(regionId) {
    throw new Error('Method must be implemented');
  }

  /**
   * Recherche des départements par nom partiel
   * @param {string} searchTerm - Terme de recherche
   * @returns {Promise<DepartementEntity[]>}
   */
  async searchByName(searchTerm) {
    throw new Error('Method must be implemented');
  }

  /**
   * Obtient les départements avec pagination
   * @param {number} page - Numéro de page
   * @param {number} limit - Nombre d'éléments par page
   * @param {string} regionId - Filtrage par région (optionnel)
   * @returns {Promise<{items: DepartementEntity[], total: number}>}
   */
  async findPaginated(page, limit, regionId = null) {
    throw new Error('Method must be implemented');
  }
}

module.exports = { IDepartementRepository };