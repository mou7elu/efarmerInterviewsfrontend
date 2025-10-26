/**
 * Interview Repository Interface
 * Interface pour la gestion des entretiens
 */

import { IBaseRepository } from './IBaseRepository.js';

export class IInterviewRepository extends IBaseRepository {
  /**
   * Recherche les entretiens par intervieweur
   * @param {string} interviewerId - ID de l'intervieweur
   * @param {Object} pagination - Options de pagination
   * @returns {Promise<{data: InterviewEntity[], total: number}>}
   */
  async findByInterviewer(interviewerId, pagination = {}) {
    throw new Error('La méthode findByInterviewer doit être implémentée');
  }

  /**
   * Recherche les entretiens par statut
   * @param {string} status - Statut de l'entretien
   * @param {Object} pagination - Options de pagination
   * @returns {Promise<{data: InterviewEntity[], total: number}>}
   */
  async findByStatus(status, pagination = {}) {
    throw new Error('La méthode findByStatus doit être implémentée');
  }

  /**
   * Recherche les entretiens par département
   * @param {string} department - Département
   * @param {Object} pagination - Options de pagination
   * @returns {Promise<{data: InterviewEntity[], total: number}>}
   */
  async findByDepartment(department, pagination = {}) {
    throw new Error('La méthode findByDepartment doit être implémentée');
  }

  /**
   * Recherche les entretiens par période
   * @param {Date} startDate - Date de début
   * @param {Date} endDate - Date de fin
   * @param {Object} pagination - Options de pagination
   * @returns {Promise<{data: InterviewEntity[], total: number}>}
   */
  async findByDateRange(startDate, endDate, pagination = {}) {
    throw new Error('La méthode findByDateRange doit être implémentée');
  }

  /**
   * Recherche les entretiens d'aujourd'hui
   * @param {Object} pagination - Options de pagination
   * @returns {Promise<{data: InterviewEntity[], total: number}>}
   */
  async findTodaysInterviews(pagination = {}) {
    throw new Error('La méthode findTodaysInterviews doit être implémentée');
  }

  /**
   * Recherche les entretiens à venir
   * @param {number} days - Nombre de jours à venir
   * @param {Object} pagination - Options de pagination
   * @returns {Promise<{data: InterviewEntity[], total: number}>}
   */
  async findUpcomingInterviews(days = 7, pagination = {}) {
    throw new Error('La méthode findUpcomingInterviews doit être implémentée');
  }

  /**
   * Recherche textuelle dans les entretiens
   * @param {string} searchTerm - Terme de recherche
   * @param {Object} filters - Filtres additionnels
   * @param {Object} pagination - Options de pagination
   * @returns {Promise<{data: InterviewEntity[], total: number}>}
   */
  async search(searchTerm, filters = {}, pagination = {}) {
    throw new Error('La méthode search doit être implémentée');
  }

  /**
   * Obtenir les statistiques des entretiens
   * @param {Object} filters - Filtres pour les statistiques
   * @returns {Promise<Object>}
   */
  async getStats(filters = {}) {
    throw new Error('La méthode getStats doit être implémentée');
  }

  /**
   * Obtenir les entretiens avec pagination et filtres avancés
   * @param {Object} filters - Filtres avancés
   * @param {Object} sorting - Options de tri
   * @param {Object} pagination - Options de pagination
   * @returns {Promise<{data: InterviewEntity[], total: number, page: number, limit: number}>}
   */
  async findWithFilters(filters = {}, sorting = {}, pagination = {}) {
    throw new Error('La méthode findWithFilters doit être implémentée');
  }

  /**
   * Vérifier la disponibilité d'un créneau
   * @param {Date} scheduledDate - Date et heure proposées
   * @param {string} interviewerId - ID de l'intervieweur
   * @param {number} duration - Durée en minutes
   * @param {string} excludeId - ID de l'entretien à exclure (pour modification)
   * @returns {Promise<boolean>}
   */
  async isSlotAvailable(scheduledDate, interviewerId, duration = 60, excludeId = null) {
    throw new Error('La méthode isSlotAvailable doit être implémentée');
  }
}