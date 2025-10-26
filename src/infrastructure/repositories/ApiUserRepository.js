/**
 * User Repository Implementation
 * Implémentation du repository pour les utilisateurs utilisant l'API REST
 */

import { IUserRepository } from '@domain/repositories/IUserRepository.js';
import { UserEntity } from '@domain/entities/UserEntity.js';
import httpClient from '@infrastructure/http/HttpClient.js';
import { NotFoundError } from '@shared/errors/DomainErrors.js';

export class ApiUserRepository extends IUserRepository {
  constructor() {
    super();
    this.endpoint = '/users';
  }

  async findById(id) {
    try {
      const response = await httpClient.get(`${this.endpoint}/${id}`);
      return response.success ? UserEntity.fromApiData(response.data) : null;
    } catch (error) {
      if (error instanceof NotFoundError) {
        return null;
      }
      throw error;
    }
  }

  async findByEmail(email) {
    try {
      const response = await httpClient.get(`${this.endpoint}/email/${email}`);
      return response.success ? UserEntity.fromApiData(response.data) : null;
    } catch (error) {
      if (error instanceof NotFoundError) {
        return null;
      }
      throw error;
    }
  }

  async findByProfile(profileId) {
    const response = await httpClient.get(`${this.endpoint}`, {
      params: { profileId }
    });
    
    if (!response.success) {
      return [];
    }

    return response.data.map(userData => UserEntity.fromApiData(userData));
  }

  async findActive(pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    
    const response = await httpClient.get(`${this.endpoint}`, {
      params: { 
        active: true,
        page,
        limit
      }
    });

    if (!response.success) {
      return { data: [], total: 0 };
    }

    return {
      data: response.data.map(userData => UserEntity.fromApiData(userData)),
      total: response.pagination?.total || response.data.length
    };
  }

  async searchByName(searchTerm, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    
    const response = await httpClient.get(`${this.endpoint}/search`, {
      params: { 
        q: searchTerm,
        page,
        limit
      }
    });

    if (!response.success) {
      return { data: [], total: 0 };
    }

    return {
      data: response.data.map(userData => UserEntity.fromApiData(userData)),
      total: response.pagination?.total || response.data.length
    };
  }

  async findAll(criteria = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    
    const response = await httpClient.get(`${this.endpoint}`, {
      params: { 
        ...criteria,
        page,
        limit
      }
    });

    if (!response.success) {
      return { data: [], total: 0, page: 1, limit: 10 };
    }

    return {
      data: response.data.map(userData => UserEntity.fromApiData(userData)),
      total: response.pagination?.total || response.data.length,
      page: response.pagination?.page || page,
      limit: response.pagination?.limit || limit
    };
  }

  async create(userEntity) {
    const payload = userEntity.toPersistence ? userEntity.toPersistence() : userEntity.toPlainObject();
    
    const response = await httpClient.post(`${this.endpoint}`, payload);
    
    if (!response.success) {
      throw new Error('Échec de la création de l\'utilisateur');
    }

    return UserEntity.fromApiData(response.data);
  }

  async update(id, userEntity) {
    const payload = userEntity.toPersistence ? userEntity.toPersistence() : userEntity.toPlainObject();
    
    // Supprimer l'ID du payload
    delete payload.id;
    delete payload._id;
    
    const response = await httpClient.put(`${this.endpoint}/${id}`, payload);
    
    if (!response.success) {
      throw new Error('Échec de la mise à jour de l\'utilisateur');
    }

    return UserEntity.fromApiData(response.data);
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

  async emailExists(email, excludeId = null) {
    const response = await httpClient.get(`${this.endpoint}/email-exists`, {
      params: { 
        email,
        excludeId
      }
    });
    
    return response.success ? response.data.exists : false;
  }

  async setActiveStatus(id, active) {
    const response = await httpClient.patch(`${this.endpoint}/${id}/status`, {
      active
    });
    
    if (!response.success) {
      throw new Error('Échec de la mise à jour du statut');
    }

    return UserEntity.fromApiData(response.data);
  }

  async getStats() {
    const response = await httpClient.get(`${this.endpoint}/stats`);
    
    return response.success ? response.data : {
      total: 0,
      active: 0,
      inactive: 0
    };
  }
}