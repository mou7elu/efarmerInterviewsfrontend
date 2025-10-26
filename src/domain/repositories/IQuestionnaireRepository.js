/**
 * Questionnaire Repository Interface
 * Interface pour la gestion des questionnaires agricoles
 */

export class IQuestionnaireRepository {
  /**
   * Récupérer tous les questionnaires avec pagination et filtres
   * @param {Object} params - Paramètres de recherche
   * @param {number} params.page - Numéro de page
   * @param {number} params.limit - Nombre d'éléments par page
   * @param {string} params.search - Terme de recherche
   * @param {string} params.statut - Filtrer par statut
   * @param {string} params.typeQuestionnaire - Filtrer par type
   * @param {Array} params.domaineApplication - Filtrer par domaines
   * @param {string} params.niveauDifficulte - Filtrer par niveau
   * @param {string} params.createdBy - Filtrer par créateur
   * @param {string} params.sortBy - Champ de tri
   * @param {string} params.sortOrder - Ordre de tri (asc/desc)
   * @returns {Promise<{questionnaires: QuestionnaireEntity[], total: number, page: number, totalPages: number}>}
   */
  async findAll(params = {}) {
    throw new Error('Method not implemented');
  }

  /**
   * Récupérer un questionnaire par son ID
   * @param {string} id - ID du questionnaire
   * @returns {Promise<QuestionnaireEntity|null>}
   */
  async findById(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Récupérer les questionnaires publiés
   * @param {Object} options - Options de recherche
   * @returns {Promise<QuestionnaireEntity[]>}
   */
  async findPublished(options = {}) {
    throw new Error('Method not implemented');
  }

  /**
   * Récupérer les questionnaires en brouillon d'un utilisateur
   * @param {string} userId - ID de l'utilisateur
   * @param {Object} options - Options de recherche
   * @returns {Promise<QuestionnaireEntity[]>}
   */
  async findDraftsByUser(userId, options = {}) {
    throw new Error('Method not implemented');
  }

  /**
   * Récupérer les questionnaires par type
   * @param {string} type - Type de questionnaire
   * @param {Object} options - Options de recherche
   * @returns {Promise<QuestionnaireEntity[]>}
   */
  async findByType(type, options = {}) {
    throw new Error('Method not implemented');
  }

  /**
   * Récupérer les questionnaires par domaine d'application
   * @param {string} domaine - Domaine d'application
   * @param {Object} options - Options de recherche
   * @returns {Promise<QuestionnaireEntity[]>}
   */
  async findByDomain(domaine, options = {}) {
    throw new Error('Method not implemented');
  }

  /**
   * Rechercher des questionnaires par mots-clés
   * @param {string} query - Requête de recherche
   * @param {Object} options - Options de recherche
   * @returns {Promise<QuestionnaireEntity[]>}
   */
  async search(query, options = {}) {
    throw new Error('Method not implemented');
  }

  /**
   * Récupérer les questionnaires les plus populaires
   * @param {number} limit - Nombre maximum de résultats
   * @param {Object} options - Options de recherche
   * @returns {Promise<QuestionnaireEntity[]>}
   */
  async findMostPopular(limit = 10, options = {}) {
    throw new Error('Method not implemented');
  }

  /**
   * Récupérer les questionnaires récents
   * @param {number} limit - Nombre maximum de résultats
   * @param {Object} options - Options de recherche
   * @returns {Promise<QuestionnaireEntity[]>}
   */
  async findRecent(limit = 10, options = {}) {
    throw new Error('Method not implemented');
  }

  /**
   * Récupérer les questionnaires recommandés pour un utilisateur
   * @param {string} userId - ID de l'utilisateur
   * @param {number} limit - Nombre maximum de résultats
   * @returns {Promise<QuestionnaireEntity[]>}
   */
  async findRecommended(userId, limit = 10) {
    throw new Error('Method not implemented');
  }

  /**
   * Créer un nouveau questionnaire
   * @param {QuestionnaireEntity} questionnaire - Données du questionnaire
   * @returns {Promise<QuestionnaireEntity>}
   */
  async create(questionnaire) {
    throw new Error('Method not implemented');
  }

  /**
   * Mettre à jour un questionnaire
   * @param {string} id - ID du questionnaire
   * @param {QuestionnaireEntity} questionnaire - Nouvelles données
   * @returns {Promise<QuestionnaireEntity>}
   */
  async update(id, questionnaire) {
    throw new Error('Method not implemented');
  }

  /**
   * Mettre à jour partiellement un questionnaire
   * @param {string} id - ID du questionnaire
   * @param {Object} updates - Mises à jour partielles
   * @returns {Promise<QuestionnaireEntity>}
   */
  async partialUpdate(id, updates) {
    throw new Error('Method not implemented');
  }

  /**
   * Dupliquer un questionnaire
   * @param {string} id - ID du questionnaire à dupliquer
   * @param {string} nouveauTitre - Nouveau titre pour la copie
   * @param {string} userId - ID de l'utilisateur qui duplique
   * @returns {Promise<QuestionnaireEntity>}
   */
  async duplicate(id, nouveauTitre, userId) {
    throw new Error('Method not implemented');
  }

  /**
   * Supprimer un questionnaire
   * @param {string} id - ID du questionnaire
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Changer le statut d'un questionnaire
   * @param {string} id - ID du questionnaire
   * @param {string} nouveauStatut - Nouveau statut
   * @param {string} userId - ID de l'utilisateur qui change le statut
   * @returns {Promise<QuestionnaireEntity>}
   */
  async changeStatus(id, nouveauStatut, userId) {
    throw new Error('Method not implemented');
  }

  /**
   * Soumettre un questionnaire pour révision
   * @param {string} id - ID du questionnaire
   * @param {string} userId - ID de l'utilisateur qui soumet
   * @returns {Promise<QuestionnaireEntity>}
   */
  async submitForReview(id, userId) {
    throw new Error('Method not implemented');
  }

  /**
   * Valider un questionnaire
   * @param {string} id - ID du questionnaire
   * @param {string} validateurId - ID du validateur
   * @param {string} commentaires - Commentaires de validation
   * @returns {Promise<QuestionnaireEntity>}
   */
  async validate(id, validateurId, commentaires = '') {
    throw new Error('Method not implemented');
  }

  /**
   * Publier un questionnaire
   * @param {string} id - ID du questionnaire
   * @param {string} userId - ID de l'utilisateur qui publie
   * @returns {Promise<QuestionnaireEntity>}
   */
  async publish(id, userId) {
    throw new Error('Method not implemented');
  }

  /**
   * Archiver un questionnaire
   * @param {string} id - ID du questionnaire
   * @param {string} userId - ID de l'utilisateur qui archive
   * @returns {Promise<QuestionnaireEntity>}
   */
  async archive(id, userId) {
    throw new Error('Method not implemented');
  }

  /**
   * Suspendre un questionnaire
   * @param {string} id - ID du questionnaire
   * @param {string} userId - ID de l'utilisateur qui suspend
   * @param {string} raison - Raison de la suspension
   * @returns {Promise<QuestionnaireEntity>}
   */
  async suspend(id, userId, raison = '') {
    throw new Error('Method not implemented');
  }

  /**
   * Enregistrer l'utilisation d'un questionnaire
   * @param {string} id - ID du questionnaire
   * @param {string} userId - ID de l'utilisateur
   * @returns {Promise<void>}
   */
  async recordUsage(id, userId) {
    throw new Error('Method not implemented');
  }

  /**
   * Ajouter un feedback sur un questionnaire
   * @param {string} id - ID du questionnaire
   * @param {string} userId - ID de l'utilisateur
   * @param {number} rating - Note (1-5)
   * @param {string} commentaire - Commentaire
   * @returns {Promise<QuestionnaireEntity>}
   */
  async addFeedback(id, userId, rating, commentaire = '') {
    throw new Error('Method not implemented');
  }

  /**
   * Obtenir les statistiques d'un questionnaire
   * @param {string} id - ID du questionnaire
   * @returns {Promise<Object>}
   */
  async getStatistics(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Obtenir les statistiques globales des questionnaires
   * @param {Object} filters - Filtres pour les statistiques
   * @returns {Promise<Object>}
   */
  async getGlobalStatistics(filters = {}) {
    throw new Error('Method not implemented');
  }

  /**
   * Obtenir la répartition par types de questionnaires
   * @returns {Promise<Object>}
   */
  async getTypeDistribution() {
    throw new Error('Method not implemented');
  }

  /**
   * Obtenir la répartition par domaines d'application
   * @returns {Promise<Object>}
   */
  async getDomainDistribution() {
    throw new Error('Method not implemented');
  }

  /**
   * Exporter un questionnaire au format JSON
   * @param {string} id - ID du questionnaire
   * @returns {Promise<Object>}
   */
  async exportToJSON(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Importer un questionnaire depuis un fichier JSON
   * @param {Object} data - Données du questionnaire
   * @param {string} userId - ID de l'utilisateur qui importe
   * @returns {Promise<QuestionnaireEntity>}
   */
  async importFromJSON(data, userId) {
    throw new Error('Method not implemented');
  }

  /**
   * Obtenir les templates de questionnaires
   * @param {Object} options - Options de recherche
   * @returns {Promise<QuestionnaireEntity[]>}
   */
  async getTemplates(options = {}) {
    throw new Error('Method not implemented');
  }

  /**
   * Créer un questionnaire à partir d'un template
   * @param {string} templateId - ID du template
   * @param {string} titre - Titre du nouveau questionnaire
   * @param {string} userId - ID de l'utilisateur
   * @returns {Promise<QuestionnaireEntity>}
   */
  async createFromTemplate(templateId, titre, userId) {
    throw new Error('Method not implemented');
  }
}