/**
 * Interface du repository pour les parcelles
 * Suit le pattern Repository du DDD
 */
class IParcelleRepository {
  /**
   * Créer une nouvelle parcelle
   * @param {ParcelleEntity} entity 
   * @returns {Promise<ParcelleEntity>}
   */
  async create(entity) {
    throw new Error('Method not implemented');
  }

  /**
   * Trouver une parcelle par ID
   * @param {string} id 
   * @returns {Promise<ParcelleEntity|null>}
   */
  async findById(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Trouver toutes les parcelles
   * @returns {Promise<ParcelleEntity[]>}
   */
  async findAll() {
    throw new Error('Method not implemented');
  }

  /**
   * Mettre à jour une parcelle
   * @param {string} id 
   * @param {ParcelleEntity} entity 
   * @returns {Promise<ParcelleEntity>}
   */
  async update(id, entity) {
    throw new Error('Method not implemented');
  }

  /**
   * Supprimer une parcelle
   * @param {string} id 
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Trouver les parcelles d'un producteur
   * @param {string} producteurId 
   * @returns {Promise<ParcelleEntity[]>}
   */
  async findByProducteurId(producteurId) {
    throw new Error('Method not implemented');
  }

  /**
   * Trouver une parcelle par code
   * @param {string} code 
   * @returns {Promise<ParcelleEntity|null>}
   */
  async findByCode(code) {
    throw new Error('Method not implemented');
  }

  /**
   * Trouver les parcelles par superficie (range)
   * @param {number} minSuperficie 
   * @param {number} maxSuperficie 
   * @returns {Promise<ParcelleEntity[]>}
   */
  async findBySuperficieRange(minSuperficie, maxSuperficie) {
    throw new Error('Method not implemented');
  }

  /**
   * Trouver les parcelles avec coordonnées GPS
   * @returns {Promise<ParcelleEntity[]>}
   */
  async findWithCoordinates() {
    throw new Error('Method not implemented');
  }

  /**
   * Trouver les parcelles sans coordonnées GPS
   * @returns {Promise<ParcelleEntity[]>}
   */
  async findWithoutCoordinates() {
    throw new Error('Method not implemented');
  }

  /**
   * Trouver les parcelles avec pagination
   * @param {number} page 
   * @param {number} limit 
   * @param {string} producteurId 
   * @returns {Promise<{items: ParcelleEntity[], total: number, page: number, pages: number}>}
   */
  async findPaginated(page = 1, limit = 10, producteurId = null) {
    throw new Error('Method not implemented');
  }

  /**
   * Compter le nombre total de parcelles
   * @returns {Promise<number>}
   */
  async count() {
    throw new Error('Method not implemented');
  }

  /**
   * Compter les parcelles d'un producteur
   * @param {string} producteurId 
   * @returns {Promise<number>}
   */
  async countByProducteurId(producteurId) {
    throw new Error('Method not implemented');
  }

  /**
   * Calculer la superficie totale d'un producteur
   * @param {string} producteurId 
   * @returns {Promise<number>}
   */
  async getSuperficieTotaleByProducteur(producteurId) {
    throw new Error('Method not implemented');
  }

  /**
   * Vérifier si une parcelle existe
   * @param {string} id 
   * @returns {Promise<boolean>}
   */
  async exists(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Trouver les parcelles par catégorie de taille
   * @param {string} categorie - 'Petite', 'Moyenne', 'Grande'
   * @returns {Promise<ParcelleEntity[]>}
   */
  async findByCategorieTaille(categorie) {
    throw new Error('Method not implemented');
  }

  /**
   * Obtenir les statistiques des superficies
   * @returns {Promise<{total: number, moyenne: number, min: number, max: number}>}
   */
  async getStatistiquesSuperficie() {
    throw new Error('Method not implemented');
  }
}

module.exports = { IParcelleRepository };