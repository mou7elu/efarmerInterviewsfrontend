/**
 * Interview Repository Implementation
 * Implémentation du repository pour les entretiens utilisant l'API REST
 */

import { IInterviewRepository } from '@domain/repositories/IInterviewRepository.js';
import { InterviewEntity } from '@domain/entities/InterviewEntity.js';
import httpClient from '@infrastructure/http/HttpClient.js';
import { NotFoundError } from '@shared/errors/DomainErrors.js';

export class ApiInterviewRepository extends IInterviewRepository {
  constructor() {
    super();
    this.endpoint = '/interviews';
  }

  async findById(id) {
    try {
      const response = await httpClient.get(`${this.endpoint}/${id}`);
      return response.success ? InterviewEntity.fromApiData(response.data) : null;
    } catch (error) {
      if (error instanceof NotFoundError) {
        return null;
      }
      throw error;
    }
  }

  async findByInterviewer(interviewerId, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    
    const response = await httpClient.get(`${this.endpoint}`, {
      params: { 
        interviewer: interviewerId,
        page,
        limit
      }
    });

    if (!response.success) {
      return { data: [], total: 0 };
    }

    return {
      data: response.data.map(interviewData => InterviewEntity.fromApiData(interviewData)),
      total: response.pagination?.total || response.data.length
    };
  }

  async findByStatus(status, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    
    const response = await httpClient.get(`${this.endpoint}`, {
      params: { 
        status,
        page,
        limit
      }
    });

    if (!response.success) {
      return { data: [], total: 0 };
    }

    return {
      data: response.data.map(interviewData => InterviewEntity.fromApiData(interviewData)),
      total: response.pagination?.total || response.data.length
    };
  }

  async findByDepartment(department, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    
    const response = await httpClient.get(`${this.endpoint}`, {
      params: { 
        department,
        page,
        limit
      }
    });

    if (!response.success) {
      return { data: [], total: 0 };
    }

    return {
      data: response.data.map(interviewData => InterviewEntity.fromApiData(interviewData)),
      total: response.pagination?.total || response.data.length
    };
  }

  async findByDateRange(startDate, endDate, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    
    const response = await httpClient.get(`${this.endpoint}`, {
      params: { 
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        page,
        limit
      }
    });

    if (!response.success) {
      return { data: [], total: 0 };
    }

    return {
      data: response.data.map(interviewData => InterviewEntity.fromApiData(interviewData)),
      total: response.pagination?.total || response.data.length
    };
  }

  async findTodaysInterviews(pagination = {}) {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    
    return this.findByDateRange(startOfDay, endOfDay, pagination);
  }

  async findUpcomingInterviews(days = 7, pagination = {}) {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);
    
    return this.findByDateRange(startDate, endDate, pagination);
  }

  async search(searchTerm, filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    
    const response = await httpClient.get(`${this.endpoint}/search`, {
      params: { 
        q: searchTerm,
        ...filters,
        page,
        limit
      }
    });

    if (!response.success) {
      return { data: [], total: 0 };
    }

    return {
      data: response.data.map(interviewData => InterviewEntity.fromApiData(interviewData)),
      total: response.pagination?.total || response.data.length
    };
  }

  async findWithFilters(filters = {}, sorting = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const { field = 'scheduledDate', direction = 'desc' } = sorting;
    
    const params = {
      ...filters,
      page,
      limit,
      sortBy: field,
      sortOrder: direction
    };

    const response = await httpClient.get(`${this.endpoint}`, { params });

    if (!response.success) {
      return { data: [], total: 0, page: 1, limit: 10 };
    }

    return {
      data: response.data.map(interviewData => InterviewEntity.fromApiData(interviewData)),
      total: response.pagination?.total || response.data.length,
      page: response.pagination?.page || page,
      limit: response.pagination?.limit || limit
    };
  }

  async findAll(criteria = {}, pagination = {}) {
    return this.findWithFilters(criteria, {}, pagination);
  }

  async create(interviewEntity) {
    const payload = interviewEntity.toPersistence ? 
      interviewEntity.toPersistence() : 
      interviewEntity.toPlainObject();
    
    const response = await httpClient.post(`${this.endpoint}`, payload);
    
    if (!response.success) {
      throw new Error('Échec de la création de l\'entretien');
    }

    return InterviewEntity.fromApiData(response.data);
  }

  async update(id, interviewEntity) {
    const payload = interviewEntity.toPersistence ? 
      interviewEntity.toPersistence() : 
      interviewEntity.toPlainObject();
    
    // Supprimer l'ID du payload
    delete payload.id;
    delete payload._id;
    
    const response = await httpClient.put(`${this.endpoint}/${id}`, payload);
    
    if (!response.success) {
      throw new Error('Échec de la mise à jour de l\'entretien');
    }

    return InterviewEntity.fromApiData(response.data);
  }

  async delete(id) {
    const response = await httpClient.delete(`${this.endpoint}/${id}`);
    return response.success;
  }

  async exists(id) {
    try {
      await this.findById(id);
      return true;
    } catch {
      return false;
    }
  }

  async count(criteria = {}) {
    const response = await httpClient.get(`${this.endpoint}/count`, {
      params: criteria
    });
    
    return response.success ? response.data.count : 0;
  }

  async getStats(filters = {}) {
    const response = await httpClient.get(`${this.endpoint}/stats`, {
      params: filters
    });
    
    return response.success ? response.data : {
      total: 0,
      scheduled: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0
    };
  }

  async isSlotAvailable(scheduledDate, interviewerId, duration = 60, excludeId = null) {
    const response = await httpClient.get(`${this.endpoint}/availability`, {
      params: {
        scheduledDate: scheduledDate.toISOString(),
        interviewerId,
        duration,
        excludeId
      }
    });
    
    return response.success ? response.data.available : false;
  }

  // Méthodes spécifiques aux entretiens
  async startInterview(id) {
    const response = await httpClient.patch(`${this.endpoint}/${id}/start`);
    
    if (!response.success) {
      throw new Error('Échec du démarrage de l\'entretien');
    }

    return InterviewEntity.fromApiData(response.data);
  }

  async completeInterview(id, completionData) {
    const response = await httpClient.patch(`${this.endpoint}/${id}/complete`, completionData);
    
    if (!response.success) {
      throw new Error('Échec de la finalisation de l\'entretien');
    }

    return InterviewEntity.fromApiData(response.data);
  }

  async cancelInterview(id, reason = '') {
    const response = await httpClient.patch(`${this.endpoint}/${id}/cancel`, { reason });
    
    if (!response.success) {
      throw new Error('Échec de l\'annulation de l\'entretien');
    }

    return InterviewEntity.fromApiData(response.data);
  }

  async rescheduleInterview(id, newDate) {
    const response = await httpClient.patch(`${this.endpoint}/${id}/reschedule`, {
      scheduledDate: newDate.toISOString()
    });
    
    if (!response.success) {
      throw new Error('Échec de la reprogrammation de l\'entretien');
    }

    return InterviewEntity.fromApiData(response.data);
  }

  async addQuestion(id, questionData) {
    const response = await httpClient.post(`${this.endpoint}/${id}/questions`, questionData);
    
    if (!response.success) {
      throw new Error('Échec de l\'ajout de la question');
    }

    return InterviewEntity.fromApiData(response.data);
  }

  async updateQuestion(id, questionId, questionData) {
    const response = await httpClient.put(`${this.endpoint}/${id}/questions/${questionId}`, questionData);
    
    if (!response.success) {
      throw new Error('Échec de la mise à jour de la question');
    }

    return InterviewEntity.fromApiData(response.data);
  }

  async uploadCV(id, file) {
    const formData = new FormData();
    formData.append('cv', file);
    
    const response = await httpClient.upload(`${this.endpoint}/${id}/cv`, formData);
    
    if (!response.success) {
      throw new Error('Échec de l\'upload du CV');
    }

    return InterviewEntity.fromApiData(response.data);
  }
}