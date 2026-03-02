const IBaseRepository = require('./IBaseRepository');

/**
 * Interface du repository pour les entités Region
 */
class IRegionRepository extends IBaseRepository {
  /**
   * Recherche une région par son libellé
   * @param {string} libRegion - Libellé de la région
   * @returns {Promise<RegionEntity|null>}
   */
  async findByLibelle(libRegion) {
    throw new Error('Method must be implemented');
  }

  /**
   * Recherche des régions par district
   * @param {string} districtId - Identifiant du district
   * @returns {Promise<RegionEntity[]>}
   */
  async findByDistrictId(districtId) {
    throw new Error('Method must be implemented');
  }

  /**
   * Recherche des régions par statut (actif/en sommeil)
   * @param {boolean} sommeil - Statut sommeil
   * @returns {Promise<RegionEntity[]>}
   */
  async findByStatut(sommeil) {
    throw new Error('Method must be implemented');
  }

  /**
   * Obtient toutes les régions actives d'un district
   * @param {string} districtId - Identifiant du district
   * @returns {Promise<RegionEntity[]>}
   */
  async findActivesByDistrict(districtId) {
    throw new Error('Method must be implemented');
  }

  /**
   * Met à jour le statut sommeil d'une région
   * @param {string} id - Identifiant de la région
   * @param {boolean} sommeil - Nouveau statut
   * @returns {Promise<RegionEntity>}
   */
  async updateStatut(id, sommeil) {
    throw new Error('Method must be implemented');
  }

  /**
   * Compte le nombre de régions par district
   * @param {string} districtId - Identifiant du district
   * @returns {Promise<number>}
   */
  async countByDistrictId(districtId) {
    throw new Error('Method must be implemented');
  }

  /**
   * Recherche des régions dans une zone géographique
   * @param {Object} bounds - Limites géographiques
   * @returns {Promise<RegionEntity[]>}
   */
  async findByCoordinates(bounds) {
    throw new Error('Method must be implemented');
  }
}

module.exports = { IRegionRepository };