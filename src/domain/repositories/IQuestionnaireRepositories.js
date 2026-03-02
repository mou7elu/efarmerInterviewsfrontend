const IBaseRepository = require('./IBaseRepository');

/**
 * Interface du repository pour les entités Volet
 */
class IVoletRepository extends IBaseRepository {
  /**
   * Recherche des volets par questionnaire
   * @param {string} questionnaireId - Identifiant du questionnaire
   * @returns {Promise<VoletEntity[]>}
   */
  async findByQuestionnaireId(questionnaireId) {
    throw new Error('Method must be implemented');
  }

  /**
   * Obtient les volets triés par ordre pour un questionnaire
   * @param {string} questionnaireId - Identifiant du questionnaire
   * @returns {Promise<VoletEntity[]>}
   */
  async findByQuestionnaireIdSorted(questionnaireId) {
    throw new Error('Method must be implemented');
  }

  /**
   * Recherche un volet par titre et questionnaire
   * @param {string} titre - Titre du volet
   * @param {string} questionnaireId - Identifiant du questionnaire
   * @returns {Promise<VoletEntity|null>}
   */
  async findByTitreAndQuestionnaire(titre, questionnaireId) {
    throw new Error('Method must be implemented');
  }

  /**
   * Met à jour l'ordre des volets
   * @param {Array<{id: string, ordre: number}>} updates - Mises à jour d'ordre
   * @returns {Promise<void>}
   */
  async updateOrders(updates) {
    throw new Error('Method must be implemented');
  }

  /**
   * Compte le nombre de volets par questionnaire
   * @param {string} questionnaireId - Identifiant du questionnaire
   * @returns {Promise<number>}
   */
  async countByQuestionnaireId(questionnaireId) {
    throw new Error('Method must be implemented');
  }

  /**
   * Obtient le prochain ordre disponible pour un questionnaire
   * @param {string} questionnaireId - Identifiant du questionnaire
   * @returns {Promise<number>}
   */
  async getNextOrder(questionnaireId) {
    throw new Error('Method must be implemented');
  }
}

/**
 * Interface du repository pour les entités Section
 */
class ISectionRepository extends IBaseRepository {
  /**
   * Recherche des sections par volet
   * @param {string} voletId - Identifiant du volet
   * @returns {Promise<SectionEntity[]>}
   */
  async findByVoletId(voletId) {
    throw new Error('Method must be implemented');
  }

  /**
   * Obtient les sections triées par ordre pour un volet
   * @param {string} voletId - Identifiant du volet
   * @returns {Promise<SectionEntity[]>}
   */
  async findByVoletIdSorted(voletId) {
    throw new Error('Method must be implemented');
  }

  /**
   * Recherche une section par titre et volet
   * @param {string} titre - Titre de la section
   * @param {string} voletId - Identifiant du volet
   * @returns {Promise<SectionEntity|null>}
   */
  async findByTitreAndVolet(titre, voletId) {
    throw new Error('Method must be implemented');
  }

  /**
   * Met à jour l'ordre des sections
   * @param {Array<{id: string, ordre: number}>} updates - Mises à jour d'ordre
   * @returns {Promise<void>}
   */
  async updateOrders(updates) {
    throw new Error('Method must be implemented');
  }

  /**
   * Compte le nombre de sections par volet
   * @param {string} voletId - Identifiant du volet
   * @returns {Promise<number>}
   */
  async countByVoletId(voletId) {
    throw new Error('Method must be implemented');
  }

  /**
   * Obtient le prochain ordre disponible pour un volet
   * @param {string} voletId - Identifiant du volet
   * @returns {Promise<number>}
   */
  async getNextOrder(voletId) {
    throw new Error('Method must be implemented');
  }
}

/**
 * Interface du repository pour les entités Reponse
 */
class IReponseRepository extends IBaseRepository {
  /**
   * Recherche des réponses par exploitant
   * @param {string} exploitantId - Identifiant de l'exploitant
   * @returns {Promise<ReponseEntity[]>}
   */
  async findByExploitantId(exploitantId) {
    throw new Error('Method must be implemented');
  }

  /**
   * Recherche des réponses par questionnaire
   * @param {string} questionnaireId - Identifiant du questionnaire
   * @returns {Promise<ReponseEntity[]>}
   */
  async findByQuestionnaireId(questionnaireId) {
    throw new Error('Method must be implemented');
  }

  /**
   * Recherche une réponse par exploitant et questionnaire
   * @param {string} exploitantId - Identifiant de l'exploitant
   * @param {string} questionnaireId - Identifiant du questionnaire
   * @returns {Promise<ReponseEntity|null>}
   */
  async findByExploitantAndQuestionnaire(exploitantId, questionnaireId) {
    throw new Error('Method must be implemented');
  }

  /**
   * Obtient les statistiques de réponses pour un questionnaire
   * @param {string} questionnaireId - Identifiant du questionnaire
   * @returns {Promise<Object>}
   */
  async getStatistics(questionnaireId) {
    throw new Error('Method must be implemented');
  }

  /**
   * Recherche des réponses complètes/incomplètes
   * @param {string} questionnaireId - Identifiant du questionnaire
   * @param {boolean} complete - Si true, cherche les complètes, sinon les incomplètes
   * @returns {Promise<ReponseEntity[]>}
   */
  async findByCompletionStatus(questionnaireId, complete) {
    throw new Error('Method must be implemented');
  }

  /**
   * Obtient les réponses avec pagination
   * @param {number} page - Numéro de page
   * @param {number} limit - Nombre d'éléments par page
   * @param {string} questionnaireId - Filtrage par questionnaire (optionnel)
   * @returns {Promise<{items: ReponseEntity[], total: number}>}
   */
  async findPaginated(page, limit, questionnaireId = null) {
    throw new Error('Method must be implemented');
  }
}

module.exports = { 
  IVoletRepository, 
  ISectionRepository, 
  IReponseRepository 
};