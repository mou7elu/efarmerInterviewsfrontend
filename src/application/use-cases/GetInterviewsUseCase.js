/**
 * Get Interviews Use Case
 * Cas d'usage pour récupérer la liste des entretiens
 */

import { BaseUseCase } from './BaseUseCase.js';
import { ValidationError, AuthorizationError } from '@shared/errors/DomainErrors.js';

export class GetInterviewsUseCase extends BaseUseCase {
  constructor(interviewRepository) {
    super();
    this.interviewRepository = interviewRepository;
  }

  async execute(input) {
    try {
      this.validateInput(input);
      
      const { 
        user,
        filters = {},
        sorting = { field: 'scheduledDate', direction: 'desc' },
        pagination = { page: 1, limit: 10 }
      } = input;

      // Vérifier les permissions
      this.checkPermissions(user, 'interviews', 'read');

      // Appliquer les filtres selon le rôle de l'utilisateur
      const finalFilters = this.applyUserFilters(user, filters);

      // Récupérer les entretiens
      const result = await this.interviewRepository.findWithFilters(
        finalFilters,
        sorting,
        pagination
      );

      this.log('info', 'Entretiens récupérés avec succès', {
        userId: user.id,
        filtersCount: Object.keys(finalFilters).length,
        resultCount: result.data.length,
        page: pagination.page
      });

      return {
        interviews: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: Math.ceil(result.total / result.limit)
        },
        filters: finalFilters
      };

    } catch (error) {
      this.handleError(error, {
        input: this.sanitizeForLogging(input)
      });
    }
  }

  validateInput(input) {
    if (!input) {
      throw new ValidationError('Les paramètres sont requis');
    }

    const { user } = input;

    if (!user || !user.id) {
      throw new ValidationError('Utilisateur requis');
    }

    return true;
  }

  checkPermissions(user, resource, action) {
    if (!user) {
      throw new AuthorizationError('Utilisateur requis pour accéder aux entretiens');
    }

    // Tous les utilisateurs connectés peuvent voir les entretiens
    // (avec filtrage selon leur rôle)
    return true;
  }

  applyUserFilters(user, baseFilters) {
    const filters = { ...baseFilters };

    // Si l'utilisateur n'est pas admin, il ne voit que ses entretiens
    if (user.role !== 'admin') {
      filters.interviewer = user.id;
    }

    return filters;
  }
}