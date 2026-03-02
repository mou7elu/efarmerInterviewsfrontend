const IBaseRepository = require('./IBaseRepository');

/**
 * Interface du repository pour les entités géographiques (Pays)
 */
class IPaysRepository extends IBaseRepository {
  /**
   * Recherche un pays par son libellé
   * @param {string} libPays - Libellé du pays
   * @returns {Promise<PaysEntity|null>}
   */
  async findByLibelle(libPays) {
    throw new Error('Method must be implemented');
  }

  /**
   * Recherche des pays par statut (actif/en sommeil)
   * @param {boolean} sommeil - Statut sommeil
   * @returns {Promise<PaysEntity[]>}
   */
  async findByStatut(sommeil) {
    throw new Error('Method must be implemented');
  }

  /**
   * Obtient tous les pays actifs
   * @returns {Promise<PaysEntity[]>}
   */
  async findActifs() {
    throw new Error('Method must be implemented');
  }

  /**
   * Met à jour le statut sommeil d'un pays
   * @param {string} id - Identifiant du pays
   * @param {boolean} sommeil - Nouveau statut
   * @returns {Promise<PaysEntity>}
   */
  async updateStatut(id, sommeil) {
    throw new Error('Method must be implemented');
  }

  /**
   * Recherche des pays par coordonnées (dans une zone)
   * @param {Object} bounds - Limites géographiques
   * @returns {Promise<PaysEntity[]>}
   */
  async findByCoordinates(bounds) {
    throw new Error('Method must be implemented');
  }
}

module.exports = { IPaysRepository };