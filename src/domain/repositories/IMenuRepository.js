const IBaseRepository = require('./IBaseRepository');

/**
 * Interface du repository pour les entités Menu
 */
class IMenuRepository extends IBaseRepository {
  /**
   * Recherche un menu par texte
   * @param {string} text - Texte du menu
   * @returns {Promise<MenuEntity|null>}
   */
  async findByText(text) {
    throw new Error('Method must be implemented');
  }

  /**
   * Recherche un menu par chemin
   * @param {string} path - Chemin du menu
   * @returns {Promise<MenuEntity|null>}
   */
  async findByPath(path) {
    throw new Error('Method must be implemented');
  }

  /**
   * Obtient tous les menus triés par ordre
   * @returns {Promise<MenuEntity[]>}
   */
  async findAllByOrder() {
    throw new Error('Method must be implemented');
  }

  /**
   * Recherche des menus parents (avec sous-menus)
   * @returns {Promise<MenuEntity[]>}
   */
  async findParentMenus() {
    throw new Error('Method must be implemented');
  }

  /**
   * Recherche des menus feuilles (avec chemin direct)
   * @returns {Promise<MenuEntity[]>}
   */
  async findLeafMenus() {
    throw new Error('Method must be implemented');
  }

  /**
   * Met à jour l'ordre des menus
   * @param {Array<{id: string, order: number}>} updates - Mises à jour d'ordre
   * @returns {Promise<void>}
   */
  async updateOrders(updates) {
    throw new Error('Method must be implemented');
  }

  /**
   * Recherche des menus par icône
   * @param {string} icon - Icône du menu
   * @returns {Promise<MenuEntity[]>}
   */
  async findByIcon(icon) {
    throw new Error('Method must be implemented');
  }

  /**
   * Obtient la structure hiérarchique des menus
   * @returns {Promise<Object>}
   */
  async getMenuHierarchy() {
    throw new Error('Method must be implemented');
  }

  /**
   * Vérifie si un chemin existe déjà
   * @param {string} path - Chemin à vérifier
   * @param {string} excludeId - ID à exclure de la vérification
   * @returns {Promise<boolean>}
   */
  async existsByPath(path, excludeId = null) {
    throw new Error('Method must be implemented');
  }
}

module.exports = { IMenuRepository };