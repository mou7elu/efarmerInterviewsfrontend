const IBaseRepository = require('./IBaseRepository');

/**
 * Interface du repository pour les entités Profile
 */
class IProfileRepository extends IBaseRepository {
  /**
   * Recherche un profil par nom
   * @param {string} name - Nom du profil
   * @returns {Promise<ProfileEntity|null>}
   */
  async findByName(name) {
    throw new Error('Method must be implemented');
  }

  /**
   * Recherche des profils avec permissions pour un menu
   * @param {string} menuId - Identifiant du menu
   * @returns {Promise<ProfileEntity[]>}
   */
  async findByMenuId(menuId) {
    throw new Error('Method must be implemented');
  }

  /**
   * Recherche des profils administrateurs
   * @returns {Promise<ProfileEntity[]>}
   */
  async findAdminProfiles() {
    throw new Error('Method must be implemented');
  }

  /**
   * Vérifie si un nom de profil existe déjà
   * @param {string} name - Nom à vérifier
   * @param {string} excludeId - ID à exclure de la vérification
   * @returns {Promise<boolean>}
   */
  async existsByName(name, excludeId = null) {
    throw new Error('Method must be implemented');
  }

  /**
   * Met à jour les permissions d'un profil
   * @param {string} id - Identifiant du profil
   * @param {Array} permissions - Nouvelles permissions
   * @returns {Promise<ProfileEntity>}
   */
  async updatePermissions(id, permissions) {
    throw new Error('Method must be implemented');
  }

  /**
   * Supprime les permissions pour un menu donné de tous les profils
   * @param {string} menuId - Identifiant du menu
   * @returns {Promise<void>}
   */
  async removePermissionsByMenuId(menuId) {
    throw new Error('Method must be implemented');
  }
}

module.exports = { IProfileRepository };