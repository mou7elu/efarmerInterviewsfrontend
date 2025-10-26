/**
 * Create Interview Use Case
 * Cas d'usage pour créer un nouvel entretien
 */

import { BaseUseCase } from './BaseUseCase.js';
import { ValidationError, AuthorizationError, BusinessLogicError } from '@shared/errors/DomainErrors.js';
import { InterviewEntity } from '@domain/entities/InterviewEntity.js';

export class CreateInterviewUseCase extends BaseUseCase {
  constructor(interviewRepository, userRepository) {
    super();
    this.interviewRepository = interviewRepository;
    this.userRepository = userRepository;
  }

  async execute(input) {
    try {
      this.validateInput(input);
      
      const { 
        user,
        candidateName,
        candidateEmail,
        candidatePhone,
        position,
        department,
        scheduledDate,
        duration = 60,
        type = 'presentiel',
        location,
        meetingLink,
        interviewerId
      } = input;

      // Vérifier les permissions
      this.checkPermissions(user, 'interviews', 'create');

      // Valider l'intervieweur
      const interviewer = await this.validateInterviewer(interviewerId || user.id);

      // Vérifier la disponibilité du créneau
      await this.validateSlotAvailability(scheduledDate, interviewer.id, duration);

      // Créer l'entité entretien
      const interviewEntity = new InterviewEntity({
        candidateName,
        candidateEmail,
        candidatePhone,
        position,
        department,
        scheduledDate: new Date(scheduledDate),
        duration,
        type,
        location,
        meetingLink,
        interviewerId: interviewer.id,
        interviewer,
        status: InterviewEntity.STATUS_TYPES.PLANIFIE,
        createdBy: user.id
      });

      // Sauvegarder l'entretien
      const savedInterview = await this.interviewRepository.create(interviewEntity);

      this.log('info', 'Entretien créé avec succès', {
        interviewId: savedInterview.id,
        candidateName,
        interviewerId: interviewer.id,
        scheduledDate,
        createdBy: user.id
      });

      return {
        interview: savedInterview,
        message: 'Entretien créé avec succès'
      };

    } catch (error) {
      this.handleError(error, {
        input: this.sanitizeForLogging(input)
      });
    }
  }

  validateInput(input) {
    if (!input) {
      throw new ValidationError('Les données de l\'entretien sont requises');
    }

    const requiredFields = [
      'user',
      'candidateName',
      'candidateEmail',
      'position',
      'department',
      'scheduledDate'
    ];

    for (const field of requiredFields) {
      if (!input[field] || (typeof input[field] === 'string' && input[field].trim() === '')) {
        throw new ValidationError(`Le champ '${field}' est requis`, field);
      }
    }

    // Valider la date
    const scheduledDate = new Date(input.scheduledDate);
    if (isNaN(scheduledDate.getTime())) {
      throw new ValidationError('Date d\'entretien invalide', 'scheduledDate');
    }

    if (scheduledDate <= new Date()) {
      throw new ValidationError('La date d\'entretien doit être dans le futur', 'scheduledDate');
    }

    // Valider le type d'entretien
    if (input.type && !Object.values(InterviewEntity.INTERVIEW_TYPES).includes(input.type)) {
      throw new ValidationError('Type d\'entretien invalide', 'type');
    }

    // Valider la durée
    if (input.duration && (input.duration < 15 || input.duration > 480)) {
      throw new ValidationError('La durée doit être entre 15 minutes et 8 heures', 'duration');
    }

    return true;
  }

  checkPermissions(user, resource, action) {
    if (!user) {
      throw new AuthorizationError('Utilisateur requis pour créer un entretien');
    }

    // Tous les utilisateurs connectés peuvent créer des entretiens
    return true;
  }

  async validateInterviewer(interviewerId) {
    const interviewer = await this.userRepository.findById(interviewerId);
    
    if (!interviewer) {
      throw new ValidationError('Intervieweur non trouvé', 'interviewerId');
    }

    if (!interviewer.isActive) {
      throw new BusinessLogicError('L\'intervieweur sélectionné n\'est pas actif');
    }

    return interviewer;
  }

  async validateSlotAvailability(scheduledDate, interviewerId, duration) {
    const isAvailable = await this.interviewRepository.isSlotAvailable(
      new Date(scheduledDate),
      interviewerId,
      duration
    );

    if (!isAvailable) {
      throw new BusinessLogicError(
        'Ce créneau n\'est pas disponible pour l\'intervieweur sélectionné'
      );
    }

    return true;
  }
}