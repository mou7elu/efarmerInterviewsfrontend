/**
 * Base Repository Interface
 * Interface de base pour tous les repositories
 */

export class IBaseRepository {
  /**
   * Recherche par ID
   * @param {string} id - Identifiant de l'entité
   * @returns {Promise<Entity|null>}
   */
  async findById(id) {
    throw new Error('La méthode findById doit être implémentée');
  }

  /**
   * Recherche avec pagination
   * @param {Object} criteria - Critères de recherche
   * @param {Object} pagination - Options de pagination
   * @returns {Promise<{data: Entity[], total: number, page: number, limit: number}>}
   */
  async findAll(criteria = {}, pagination = {}) {
    throw new Error('La méthode findAll doit être implémentée');
  }

  /**
   * Créer une nouvelle entité
   * @param {Entity} entity - Entité à créer
   * @returns {Promise<Entity>}
   */
  async create(entity) {
    throw new Error('La méthode create doit être implémentée');
  }

  /**
   * Mettre à jour une entité
   * @param {string} id - Identifiant de l'entité
   * @param {Entity} entity - Entité mise à jour
   * @returns {Promise<Entity>}
   */
  async update(id, entity) {
    throw new Error('La méthode update doit être implémentée');
  }

  /**
   * Supprimer une entité
   * @param {string} id - Identifiant de l'entité
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    throw new Error('La méthode delete doit être implémentée');
  }

  /**
   * Vérifier l'existence d'une entité
   * @param {string} id - Identifiant de l'entité
   * @returns {Promise<boolean>}
   */
  async exists(id) {
    throw new Error('La méthode exists doit être implémentée');
  }

  /**
   * Compter le nombre d'entités correspondant aux critères
   * @param {Object} criteria - Critères de recherche
   * @returns {Promise<number>}
   */
  async count(criteria = {}) {
    throw new Error('La méthode count doit être implémentée');
  }
}