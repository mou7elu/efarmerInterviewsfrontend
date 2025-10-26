/**
 * User Repository Interface
 * Interface pour la gestion des utilisateurs
 */

import { IBaseRepository } from './IBaseRepository.js';

export class IUserRepository extends IBaseRepository {
  /**
   * Recherche un utilisateur par email
   * @param {string} email - Email de l'utilisateur
   * @returns {Promise<UserEntity|null>}
   */
  async findByEmail(email) {
    throw new Error('La méthode findByEmail doit être implémentée');
  }

  /**
   * Recherche des utilisateurs par profil
   * @param {string} profileId - ID du profil
   * @returns {Promise<UserEntity[]>}
   */
  async findByProfile(profileId) {
    throw new Error('La méthode findByProfile doit être implémentée');
  }

  /**
   * Recherche des utilisateurs actifs
   * @param {Object} pagination - Options de pagination
   * @returns {Promise<{data: UserEntity[], total: number}>}
   */
  async findActive(pagination = {}) {
    throw new Error('La méthode findActive doit être implémentée');
  }

  /**
   * Recherche des utilisateurs par nom ou prénom
   * @param {string} searchTerm - Terme de recherche
   * @param {Object} pagination - Options de pagination
   * @returns {Promise<{data: UserEntity[], total: number}>}
   */
  async searchByName(searchTerm, pagination = {}) {
    throw new Error('La méthode searchByName doit être implémentée');
  }

  /**
   * Vérifier si un email existe déjà
   * @param {string} email - Email à vérifier
   * @param {string} excludeId - ID à exclure de la vérification
   * @returns {Promise<boolean>}
   */
  async emailExists(email, excludeId = null) {
    throw new Error('La méthode emailExists doit être implémentée');
  }

  /**
   * Activer/désactiver un utilisateur
   * @param {string} id - ID de l'utilisateur
   * @param {boolean} active - Statut actif
   * @returns {Promise<UserEntity>}
   */
  async setActiveStatus(id, active) {
    throw new Error('La méthode setActiveStatus doit être implémentée');
  }

  /**
   * Obtenir les statistiques des utilisateurs
   * @returns {Promise<{total: number, active: number, inactive: number}>}
   */
  async getStats() {
    throw new Error('La méthode getStats doit être implémentée');
  }
}