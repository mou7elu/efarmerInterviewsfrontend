/**
 * Producteur Repository Interface
 * Interface pour la gestion des producteurs agricoles
 */

export class IProducteurRepository {
  /**
   * Récupérer tous les producteurs avec pagination et filtres
   * @param {Object} params - Paramètres de recherche
   * @param {number} params.page - Numéro de page
   * @param {number} params.limit - Nombre d'éléments par page
   * @param {string} params.search - Terme de recherche
   * @param {string} params.region - Filtrer par région
   * @param {string} params.departement - Filtrer par département
   * @param {string} params.typeProducteur - Filtrer par type de producteur
   * @param {string} params.statusVerification - Filtrer par statut de vérification
   * @param {string} params.sortBy - Champ de tri
   * @param {string} params.sortOrder - Ordre de tri (asc/desc)
   * @returns {Promise<{producteurs: ProducteurEntity[], total: number, page: number, totalPages: number}>}
   */
  async findAll(params = {}) {
    throw new Error('Method not implemented');
  }

  /**
   * Récupérer un producteur par son ID
   * @param {string} id - ID du producteur
   * @returns {Promise<ProducteurEntity|null>}
   */
  async findById(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Récupérer un producteur par son numéro de téléphone
   * @param {string} numeroTelephone - Numéro de téléphone
   * @returns {Promise<ProducteurEntity|null>}
   */
  async findByPhone(numeroTelephone) {
    throw new Error('Method not implemented');
  }

  /**
   * Rechercher des producteurs par nom ou prénoms
   * @param {string} nom - Nom à rechercher
   * @param {Object} options - Options de recherche
   * @returns {Promise<ProducteurEntity[]>}
   */
  async searchByName(nom, options = {}) {
    throw new Error('Method not implemented');
  }

  /**
   * Récupérer les producteurs par région
   * @param {string} regionId - ID de la région
   * @param {Object} options - Options de recherche
   * @returns {Promise<ProducteurEntity[]>}
   */
  async findByRegion(regionId, options = {}) {
    throw new Error('Method not implemented');
  }

  /**
   * Récupérer les producteurs par département
   * @param {string} departementId - ID du département
   * @param {Object} options - Options de recherche
   * @returns {Promise<ProducteurEntity[]>}
   */
  async findByDepartement(departementId, options = {}) {
    throw new Error('Method not implemented');
  }

  /**
   * Récupérer les producteurs par village
   * @param {string} villageId - ID du village
   * @param {Object} options - Options de recherche
   * @returns {Promise<ProducteurEntity[]>}
   */
  async findByVillage(villageId, options = {}) {
    throw new Error('Method not implemented');
  }

  /**
   * Récupérer les producteurs par type
   * @param {string} type - Type de producteur
   * @param {Object} options - Options de recherche
   * @returns {Promise<ProducteurEntity[]>}
   */
  async findByType(type, options = {}) {
    throw new Error('Method not implemented');
  }

  /**
   * Récupérer les producteurs par statut de vérification
   * @param {string} status - Statut de vérification
   * @param {Object} options - Options de recherche
   * @returns {Promise<ProducteurEntity[]>}
   */
  async findByVerificationStatus(status, options = {}) {
    throw new Error('Method not implemented');
  }

  /**
   * Récupérer les producteurs par culture principale
   * @param {string} culture - Nom de la culture
   * @param {Object} options - Options de recherche
   * @returns {Promise<ProducteurEntity[]>}
   */
  async findByCulture(culture, options = {}) {
    throw new Error('Method not implemented');
  }

  /**
   * Créer un nouveau producteur
   * @param {ProducteurEntity} producteur - Données du producteur
   * @returns {Promise<ProducteurEntity>}
   */
  async create(producteur) {
    throw new Error('Method not implemented');
  }

  /**
   * Mettre à jour un producteur
   * @param {string} id - ID du producteur
   * @param {ProducteurEntity} producteur - Nouvelles données
   * @returns {Promise<ProducteurEntity>}
   */
  async update(id, producteur) {
    throw new Error('Method not implemented');
  }

  /**
   * Mettre à jour partiellement un producteur
   * @param {string} id - ID du producteur
   * @param {Object} updates - Mises à jour partielles
   * @returns {Promise<ProducteurEntity>}
   */
  async partialUpdate(id, updates) {
    throw new Error('Method not implemented');
  }

  /**
   * Supprimer un producteur
   * @param {string} id - ID du producteur
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Vérifier un producteur
   * @param {string} id - ID du producteur
   * @param {string} verifiePar - ID de l'utilisateur qui vérifie
   * @returns {Promise<ProducteurEntity>}
   */
  async verify(id, verifiePar) {
    throw new Error('Method not implemented');
  }

  /**
   * Rejeter la vérification d'un producteur
   * @param {string} id - ID du producteur
   * @param {string} reason - Raison du rejet
   * @param {string} rejetePar - ID de l'utilisateur qui rejette
   * @returns {Promise<ProducteurEntity>}
   */
  async reject(id, reason, rejetePar) {
    throw new Error('Method not implemented');
  }

  /**
   * Télécharger une photo de profil
   * @param {string} id - ID du producteur
   * @param {Object} photoData - Données de la photo
   * @returns {Promise<ProducteurEntity>}
   */
  async uploadPhoto(id, photoData) {
    throw new Error('Method not implemented');
  }

  /**
   * Télécharger une pièce d'identité
   * @param {string} id - ID du producteur
   * @param {Object} pieceData - Données de la pièce
   * @returns {Promise<ProducteurEntity>}
   */
  async uploadPiece(id, pieceData) {
    throw new Error('Method not implemented');
  }

  /**
   * Obtenir les statistiques des producteurs
   * @param {Object} filters - Filtres pour les statistiques
   * @returns {Promise<Object>}
   */
  async getStatistics(filters = {}) {
    throw new Error('Method not implemented');
  }

  /**
   * Obtenir la répartition géographique des producteurs
   * @returns {Promise<Object>}
   */
  async getGeographicDistribution() {
    throw new Error('Method not implemented');
  }

  /**
   * Obtenir la répartition par cultures
   * @returns {Promise<Object>}
   */
  async getCropDistribution() {
    throw new Error('Method not implemented');
  }

  /**
   * Exporter les producteurs au format CSV
   * @param {Object} filters - Filtres d'export
   * @returns {Promise<string>}
   */
  async exportToCSV(filters = {}) {
    throw new Error('Method not implemented');
  }

  /**
   * Importer des producteurs depuis un fichier CSV
   * @param {File} file - Fichier CSV
   * @param {Object} options - Options d'import
   * @returns {Promise<{success: number, errors: Array}>}
   */
  async importFromCSV(file, options = {}) {
    throw new Error('Method not implemented');
  }
}