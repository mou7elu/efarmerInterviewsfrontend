/**
 * Questionnaire Use Cases
 * Cas d'utilisation pour la gestion des questionnaires agricoles
 */

import { ValidationError, NotFoundError, ConflictError } from '@shared/errors/DomainErrors.js';
import { QuestionnaireEntity } from '@domain/entities/QuestionnaireEntity.js';

export class QuestionnaireUseCases {
  constructor(questionnaireRepository, userRepository, notificationService) {
    this.questionnaireRepository = questionnaireRepository;
    this.userRepository = userRepository;
    this.notificationService = notificationService;
  }

  /**
   * Obtenir tous les questionnaires avec pagination et filtres
   */
  async getAllQuestionnaires(params) {
    try {
      const result = await this.questionnaireRepository.findAll(params);
      
      return {
        success: true,
        data: {
          questionnaires: result.questionnaires.map(q => q.toPlainObject()),
          pagination: {
            total: result.total,
            page: result.page,
            totalPages: result.totalPages,
            limit: params.limit || 10
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtenir un questionnaire par son ID
   */
  async getQuestionnaireById(id) {
    try {
      if (!id) {
        throw new ValidationError('L\'ID du questionnaire est requis');
      }

      const questionnaire = await this.questionnaireRepository.findById(id);
      
      if (!questionnaire) {
        throw new NotFoundError('Questionnaire non trouvé');
      }

      return {
        success: true,
        data: questionnaire.toPlainObject()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtenir les questionnaires publiés
   */
  async getPublishedQuestionnaires(options = {}) {
    try {
      const questionnaires = await this.questionnaireRepository.findPublished(options);
      
      return {
        success: true,
        data: questionnaires.map(q => q.toPlainObject())
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtenir les brouillons d'un utilisateur
   */
  async getUserDrafts(userId, options = {}) {
    try {
      const questionnaires = await this.questionnaireRepository.findDraftsByUser(userId, options);
      
      return {
        success: true,
        data: questionnaires.map(q => q.toPlainObject())
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Créer un nouveau questionnaire
   */
  async createQuestionnaire(questionnaireData, createdBy) {
    try {
      const questionnaire = new QuestionnaireEntity({
        ...questionnaireData,
        createdBy
      });

      const savedQuestionnaire = await this.questionnaireRepository.create(questionnaire);

      // Envoyer une notification de création
      await this.notificationService.send({
        type: 'questionnaire_created',
        recipient: createdBy,
        data: { questionnaireId: savedQuestionnaire.getId() }
      });

      return {
        success: true,
        data: savedQuestionnaire.toPlainObject()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Mettre à jour un questionnaire
   */
  async updateQuestionnaire(id, updateData, updatedBy) {
    try {
      const existingQuestionnaire = await this.questionnaireRepository.findById(id);
      
      if (!existingQuestionnaire) {
        throw new NotFoundError('Questionnaire non trouvé');
      }

      // Vérifier les permissions
      if (existingQuestionnaire.createdBy !== updatedBy && !this.canEdit(existingQuestionnaire, updatedBy)) {
        throw new ValidationError('Permissions insuffisantes pour modifier ce questionnaire');
      }

      // Ne peut être modifié que s'il est en brouillon ou en révision
      if (!existingQuestionnaire.isDraft && !existingQuestionnaire.isInReview) {
        throw new ValidationError('Seuls les questionnaires en brouillon ou en révision peuvent être modifiés');
      }

      const updatedQuestionnaire = new QuestionnaireEntity({
        ...existingQuestionnaire.toPlainObject(),
        ...updateData,
        id,
        updatedAt: new Date()
      });

      const savedQuestionnaire = await this.questionnaireRepository.update(id, updatedQuestionnaire);

      return {
        success: true,
        data: savedQuestionnaire.toPlainObject()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Dupliquer un questionnaire
   */
  async duplicateQuestionnaire(id, nouveauTitre, userId) {
    try {
      const originalQuestionnaire = await this.questionnaireRepository.findById(id);
      
      if (!originalQuestionnaire) {
        throw new NotFoundError('Questionnaire original non trouvé');
      }

      // Vérifier que l'utilisateur peut accéder au questionnaire original
      if (!originalQuestionnaire.canBeUsed && originalQuestionnaire.createdBy !== userId) {
        throw new ValidationError('Permissions insuffisantes pour dupliquer ce questionnaire');
      }

      const duplicatedQuestionnaire = await this.questionnaireRepository.duplicate(id, nouveauTitre, userId);

      return {
        success: true,
        data: duplicatedQuestionnaire.toPlainObject()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Soumettre un questionnaire pour révision
   */
  async submitForReview(id, userId) {
    try {
      const questionnaire = await this.questionnaireRepository.findById(id);
      
      if (!questionnaire) {
        throw new NotFoundError('Questionnaire non trouvé');
      }

      // Vérifier les permissions
      if (questionnaire.createdBy !== userId) {
        throw new ValidationError('Seul le créateur peut soumettre le questionnaire pour révision');
      }

      if (!questionnaire.isDraft) {
        throw new ValidationError('Seuls les questionnaires en brouillon peuvent être soumis pour révision');
      }

      if (questionnaire.totalQuestions === 0) {
        throw new ValidationError('Le questionnaire doit contenir au moins une question');
      }

      const updatedQuestionnaire = await this.questionnaireRepository.submitForReview(id, userId);

      // Notifier les administrateurs/validateurs
      await this.notificationService.send({
        type: 'questionnaire_submitted_for_review',
        recipient: 'admin_group',
        data: { questionnaireId: id, submittedBy: userId }
      });

      return {
        success: true,
        data: updatedQuestionnaire.toPlainObject()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Valider un questionnaire
   */
  async validateQuestionnaire(id, validateurId, commentaires = '') {
    try {
      const questionnaire = await this.questionnaireRepository.findById(id);
      
      if (!questionnaire) {
        throw new NotFoundError('Questionnaire non trouvé');
      }

      // Vérifier les permissions de validation
      if (!this.canValidate(validateurId)) {
        throw new ValidationError('Permissions insuffisantes pour valider ce questionnaire');
      }

      if (!questionnaire.isInReview) {
        throw new ValidationError('Seuls les questionnaires en révision peuvent être validés');
      }

      const validatedQuestionnaire = await this.questionnaireRepository.validate(id, validateurId, commentaires);

      // Notifier le créateur
      await this.notificationService.send({
        type: 'questionnaire_validated',
        recipient: questionnaire.createdBy,
        data: { questionnaireId: id, validatedBy: validateurId, commentaires }
      });

      return {
        success: true,
        data: validatedQuestionnaire.toPlainObject()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Publier un questionnaire
   */
  async publishQuestionnaire(id, userId) {
    try {
      const questionnaire = await this.questionnaireRepository.findById(id);
      
      if (!questionnaire) {
        throw new NotFoundError('Questionnaire non trouvé');
      }

      // Vérifier les permissions
      if (!this.canPublish(questionnaire, userId)) {
        throw new ValidationError('Permissions insuffisantes pour publier ce questionnaire');
      }

      if (!questionnaire.isValidated) {
        throw new ValidationError('Seuls les questionnaires validés peuvent être publiés');
      }

      const publishedQuestionnaire = await this.questionnaireRepository.publish(id, userId);

      // Notifier les utilisateurs intéressés
      await this.notificationService.send({
        type: 'questionnaire_published',
        recipient: 'interested_users',
        data: { questionnaireId: id, publishedBy: userId }
      });

      return {
        success: true,
        data: publishedQuestionnaire.toPlainObject()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Rechercher des questionnaires
   */
  async searchQuestionnaires(query, options = {}) {
    try {
      if (!query || query.trim().length < 2) {
        throw new ValidationError('La requête de recherche doit contenir au moins 2 caractères');
      }

      const questionnaires = await this.questionnaireRepository.search(query, options);

      return {
        success: true,
        data: questionnaires.map(q => q.toPlainObject())
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtenir les questionnaires populaires
   */
  async getPopularQuestionnaires(limit = 10, options = {}) {
    try {
      const questionnaires = await this.questionnaireRepository.findMostPopular(limit, options);

      return {
        success: true,
        data: questionnaires.map(q => q.toPlainObject())
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtenir les questionnaires recommandés pour un utilisateur
   */
  async getRecommendedQuestionnaires(userId, limit = 10) {
    try {
      const questionnaires = await this.questionnaireRepository.findRecommended(userId, limit);

      return {
        success: true,
        data: questionnaires.map(q => q.toPlainObject())
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Enregistrer l'utilisation d'un questionnaire
   */
  async recordQuestionnaireUsage(questionnaireId, userId) {
    try {
      const questionnaire = await this.questionnaireRepository.findById(questionnaireId);
      
      if (!questionnaire) {
        throw new NotFoundError('Questionnaire non trouvé');
      }

      if (!questionnaire.canBeUsed) {
        throw new ValidationError('Ce questionnaire ne peut pas être utilisé');
      }

      await this.questionnaireRepository.recordUsage(questionnaireId, userId);

      return {
        success: true,
        message: 'Utilisation enregistrée'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Ajouter un feedback sur un questionnaire
   */
  async addFeedback(questionnaireId, userId, rating, commentaire = '') {
    try {
      if (rating < 1 || rating > 5) {
        throw new ValidationError('La note doit être entre 1 et 5');
      }

      const questionnaire = await this.questionnaireRepository.findById(questionnaireId);
      
      if (!questionnaire) {
        throw new NotFoundError('Questionnaire non trouvé');
      }

      const updatedQuestionnaire = await this.questionnaireRepository.addFeedback(
        questionnaireId, 
        userId, 
        rating, 
        commentaire
      );

      return {
        success: true,
        data: updatedQuestionnaire.toPlainObject()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtenir les statistiques des questionnaires
   */
  async getStatistics(filters = {}) {
    try {
      const globalStats = await this.questionnaireRepository.getGlobalStatistics(filters);
      const typeDistribution = await this.questionnaireRepository.getTypeDistribution();
      const domainDistribution = await this.questionnaireRepository.getDomainDistribution();

      return {
        success: true,
        data: {
          global: globalStats,
          typeDistribution,
          domainDistribution
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtenir les templates de questionnaires
   */
  async getTemplates(options = {}) {
    try {
      const templates = await this.questionnaireRepository.getTemplates(options);

      return {
        success: true,
        data: templates.map(t => t.toPlainObject())
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Créer un questionnaire à partir d'un template
   */
  async createFromTemplate(templateId, titre, userId) {
    try {
      const questionnaire = await this.questionnaireRepository.createFromTemplate(templateId, titre, userId);

      return {
        success: true,
        data: questionnaire.toPlainObject()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Exporter un questionnaire
   */
  async exportQuestionnaire(id, format = 'json') {
    try {
      const questionnaire = await this.questionnaireRepository.findById(id);
      
      if (!questionnaire) {
        throw new NotFoundError('Questionnaire non trouvé');
      }

      let exportData;

      switch (format.toLowerCase()) {
        case 'json':
          exportData = await this.questionnaireRepository.exportToJSON(id);
          break;
        default:
          throw new ValidationError('Format d\'export non supporté');
      }

      return {
        success: true,
        data: exportData,
        contentType: this.getContentType(format)
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Importer un questionnaire
   */
  async importQuestionnaire(data, userId) {
    try {
      const questionnaire = await this.questionnaireRepository.importFromJSON(data, userId);

      return {
        success: true,
        data: questionnaire.toPlainObject()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Supprimer un questionnaire
   */
  async deleteQuestionnaire(id, deletedBy) {
    try {
      const questionnaire = await this.questionnaireRepository.findById(id);
      
      if (!questionnaire) {
        throw new NotFoundError('Questionnaire non trouvé');
      }

      // Vérifier les permissions
      if (questionnaire.createdBy !== deletedBy && !this.canDelete(questionnaire, deletedBy)) {
        throw new ValidationError('Permissions insuffisantes pour supprimer ce questionnaire');
      }

      // Ne peut être supprimé que s'il est en brouillon
      if (!questionnaire.isDraft) {
        throw new ValidationError('Seuls les questionnaires en brouillon peuvent être supprimés');
      }

      const deleted = await this.questionnaireRepository.delete(id);

      return {
        success: deleted,
        message: deleted ? 'Questionnaire supprimé avec succès' : 'Échec de la suppression'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Méthodes utilitaires privées
  canEdit(questionnaire, userId) {
    // Implémentation selon la logique métier
    return this.isAdmin(userId) || this.isValidator(userId);
  }

  canValidate(userId) {
    // Implémentation selon la logique métier
    return this.isValidator(userId) || this.isAdmin(userId);
  }

  canPublish(questionnaire, userId) {
    // Implémentation selon la logique métier
    return this.isAdmin(userId) || questionnaire.createdBy === userId;
  }

  canDelete(questionnaire, userId) {
    // Implémentation selon la logique métier
    return this.isAdmin(userId);
  }

  isAdmin(userId) {
    // Implémentation à définir selon la logique métier
    return false;
  }

  isValidator(userId) {
    // Implémentation à définir selon la logique métier
    return false;
  }

  getContentType(format) {
    const contentTypes = {
      json: 'application/json',
      csv: 'text/csv',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    };
    return contentTypes[format.toLowerCase()] || 'application/octet-stream';
  }
}