const IBaseRepository = require('./IBaseRepository');

/**
 * Interface du repository pour les entités Village
 */
class IVillageRepository extends IBaseRepository {
  /**
   * Recherche un village par son libellé
   * @param {string} libVillage - Libellé du village
   * @returns {Promise<VillageEntity|null>}
   */
  async findByLibelle(libVillage) {
    throw new Error('Method must be implemented');
  }

  /**
   * Recherche des villages par pays
   * @param {string} paysId - Identifiant du pays
   * @returns {Promise<VillageEntity[]>}
   */
  async findByPaysId(paysId) {
    throw new Error('Method must be implemented');
  }

  /**
   * Recherche des villages avec coordonnées
   * @returns {Promise<VillageEntity[]>}
   */
  async findWithCoordinates() {
    throw new Error('Method must be implemented');
  }

  /**
   * Recherche des villages sans coordonnées
   * @returns {Promise<VillageEntity[]>}
   */
  async findWithoutCoordinates() {
    throw new Error('Method must be implemented');
  }

  /**
   * Recherche des villages dans une zone géographique
   * @param {Object} bounds - Limites géographiques
   * @returns {Promise<VillageEntity[]>}
   */
  async findByCoordinates(bounds) {
    throw new Error('Method must be implemented');
  }

  /**
   * Recherche des villages par nom partiel
   * @param {string} searchTerm - Terme de recherche
   * @returns {Promise<VillageEntity[]>}
   */
  async searchByName(searchTerm) {
    throw new Error('Method must be implemented');
  }

  /**
   * Compte le nombre de villages par pays
   * @param {string} paysId - Identifiant du pays
   * @returns {Promise<number>}
   */
  async countByPaysId(paysId) {
    throw new Error('Method must be implemented');
  }

  /**
   * Obtient les villages avec pagination
   * @param {number} page - Numéro de page
   * @param {number} limit - Nombre d'éléments par page
   * @param {string} paysId - Filtrage par pays (optionnel)
   * @returns {Promise<{items: VillageEntity[], total: number}>}
   */
  async findPaginated(page, limit, paysId = null) {
    throw new Error('Method must be implemented');
  }
}

module.exports = { IVillageRepository };