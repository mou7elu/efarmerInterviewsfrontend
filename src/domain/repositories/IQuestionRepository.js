/**
 * Question Repository Interface
 * Interface pour la gestion des questions
 */

import { IBaseRepository } from './IBaseRepository.js';

export class IQuestionRepository extends IBaseRepository {
  /**
   * Recherche une question par son code
   * @param {string} code - Code de la question (ex: Q27)
   * @returns {Promise<QuestionEntity|null>}
   */
  async findByCode(code) {
    throw new Error('La méthode findByCode doit être implémentée');
  }

  /**
   * Recherche les questions par section
   * @param {string} sectionId - ID de la section
   * @returns {Promise<QuestionEntity[]>}
   */
  async findBySection(sectionId) {
    throw new Error('La méthode findBySection doit être implémentée');
  }

  /**
   * Recherche les questions par volet
   * @param {string} voletId - ID du volet
   * @returns {Promise<QuestionEntity[]>}
   */
  async findByVolet(voletId) {
    throw new Error('La méthode findByVolet doit être implémentée');
  }

  /**
   * Recherche les questions par type
   * @param {string} type - Type de question
   * @returns {Promise<QuestionEntity[]>}
   */
  async findByType(type) {
    throw new Error('La méthode findByType doit être implémentée');
  }

  /**
   * Recherche les questions obligatoires
   * @param {string} voletId - ID du volet (optionnel)
   * @returns {Promise<QuestionEntity[]>}
   */
  async findRequired(voletId = null) {
    throw new Error('La méthode findRequired doit être implémentée');
  }

  /**
   * Recherche les questions avec table de référence
   * @param {string} referenceTable - Nom de la table de référence
   * @returns {Promise<QuestionEntity[]>}
   */
  async findByReferenceTable(referenceTable) {
    throw new Error('La méthode findByReferenceTable doit être implémentée');
  }

  /**
   * Recherche les questions avec logique de saut
   * @returns {Promise<QuestionEntity[]>}
   */
  async findWithGotoLogic() {
    throw new Error('La méthode findWithGotoLogic doit être implémentée');
  }

  /**
   * Obtenir la prochaine question selon l'ordre
   * @param {string} currentCode - Code de la question actuelle
   * @returns {Promise<QuestionEntity|null>}
   */
  async getNextQuestion(currentCode) {
    throw new Error('La méthode getNextQuestion doit être implémentée');
  }

  /**
   * Obtenir la question précédente selon l'ordre
   * @param {string} currentCode - Code de la question actuelle
   * @returns {Promise<QuestionEntity|null>}
   */
  async getPreviousQuestion(currentCode) {
    throw new Error('La méthode getPreviousQuestion doit être implémentée');
  }

  /**
   * Recherche textuelle dans les questions
   * @param {string} searchTerm - Terme de recherche
   * @param {Object} filters - Filtres additionnels
   * @returns {Promise<QuestionEntity[]>}
   */
  async search(searchTerm, filters = {}) {
    throw new Error('La méthode search doit être implémentée');
  }

  /**
   * Vérifier si un code de question existe
   * @param {string} code - Code à vérifier
   * @param {string} excludeId - ID à exclure de la vérification
   * @returns {Promise<boolean>}
   */
  async codeExists(code, excludeId = null) {
    throw new Error('La méthode codeExists doit être implémentée');
  }

  /**
   * Obtenir les statistiques des questions
   * @returns {Promise<Object>}
   */
  async getStats() {
    throw new Error('La méthode getStats doit être implémentée');
  }
}