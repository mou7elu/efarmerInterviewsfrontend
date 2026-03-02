const IBaseRepository = require('./IBaseRepository');

/**
 * Interface du repository pour les entités District
 */
class IDistrictRepository extends IBaseRepository {
  /**
   * Recherche un district par son libellé
   * @param {string} libDistrict - Libellé du district
   * @returns {Promise<DistrictEntity|null>}
   */
  async findByLibelle(libDistrict) {
    throw new Error('Method must be implemented');
  }

  /**
   * Recherche des districts par pays
   * @param {string} paysId - Identifiant du pays
   * @returns {Promise<DistrictEntity[]>}
   */
  async findByPaysId(paysId) {
    throw new Error('Method must be implemented');
  }

  /**
   * Recherche des districts par statut (actif/en sommeil)
   * @param {boolean} sommeil - Statut sommeil
   * @returns {Promise<DistrictEntity[]>}
   */
  async findByStatut(sommeil) {
    throw new Error('Method must be implemented');
  }

  /**
   * Obtient tous les districts actifs d'un pays
   * @param {string} paysId - Identifiant du pays
   * @returns {Promise<DistrictEntity[]>}
   */
  async findActifsByPays(paysId) {
    throw new Error('Method must be implemented');
  }

  /**
   * Met à jour le statut sommeil d'un district
   * @param {string} id - Identifiant du district
   * @param {boolean} sommeil - Nouveau statut
   * @returns {Promise<DistrictEntity>}
   */
  async updateStatut(id, sommeil) {
    throw new Error('Method must be implemented');
  }

  /**
   * Compte le nombre de districts par pays
   * @param {string} paysId - Identifiant du pays
   * @returns {Promise<number>}
   */
  async countByPaysId(paysId) {
    throw new Error('Method must be implemented');
  }
}

module.exports = { IDistrictRepository };