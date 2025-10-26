/**
 * Interview Entity - Domain Layer
 * Représente un entretien dans le domaine métier
 */

import { BaseEntity } from './BaseEntity.js';
import { ValidationError } from '@shared/errors/DomainErrors.js';

export class InterviewEntity extends BaseEntity {
  constructor({
    id,
    candidateName,
    candidateEmail,
    candidatePhone = '',
    position,
    department,
    scheduledDate,
    duration = 60,
    status = 'planifie',
    type = 'presentiel',
    location = '',
    meetingLink = '',
    interviewer,
    interviewerId,
    questions = [],
    overallRating = null,
    recommendation = null,
    notes = '',
    cv = null,
    createdBy,
    createdAt,
    updatedAt
  }) {
    super(id);
    
    this._candidateName = candidateName;
    this._candidateEmail = candidateEmail;
    this._candidatePhone = candidatePhone;
    this._position = position;
    this._department = department;
    this._scheduledDate = new Date(scheduledDate);
    this._duration = duration;
    this._status = status;
    this._type = type;
    this._location = location;
    this._meetingLink = meetingLink;
    this._interviewer = interviewer;
    this._interviewerId = interviewerId;
    this._questions = questions || [];
    this._overallRating = overallRating;
    this._recommendation = recommendation;
    this._notes = notes;
    this._cv = cv;
    this._createdBy = createdBy;
    
    if (createdAt) this._createdAt = new Date(createdAt);
    if (updatedAt) this._updatedAt = new Date(updatedAt);
    
    this.validate();
  }

  // Types de statut autorisés
  static get STATUS_TYPES() {
    return {
      PLANIFIE: 'planifie',
      EN_COURS: 'en_cours',
      TERMINE: 'termine',
      ANNULE: 'annule',
      REPORTE: 'reporte'
    };
  }

  // Types d'entretien autorisés
  static get INTERVIEW_TYPES() {
    return {
      PRESENTIEL: 'presentiel',
      VISIO: 'visio',
      TELEPHONIQUE: 'telephonique'
    };
  }

  // Types de recommandation
  static get RECOMMENDATION_TYPES() {
    return {
      RECOMMANDE: 'recommande',
      PAS_RECOMMANDE: 'pas_recommande',
      RESERVE: 'reserve'
    };
  }

  // Getters
  get candidateName() { return this._candidateName; }
  get candidateEmail() { return this._candidateEmail; }
  get candidatePhone() { return this._candidatePhone; }
  get position() { return this._position; }
  get department() { return this._department; }
  get scheduledDate() { return this._scheduledDate; }
  get duration() { return this._duration; }
  get status() { return this._status; }
  get type() { return this._type; }
  get location() { return this._location; }
  get meetingLink() { return this._meetingLink; }
  get interviewer() { return this._interviewer; }
  get interviewerId() { return this._interviewerId; }
  get questions() { return [...this._questions]; } // Copie défensive
  get overallRating() { return this._overallRating; }
  get recommendation() { return this._recommendation; }
  get notes() { return this._notes; }
  get cv() { return this._cv; }
  get createdBy() { return this._createdBy; }

  // Propriétés calculées
  get isScheduled() {
    return this._status === InterviewEntity.STATUS_TYPES.PLANIFIE;
  }

  get isInProgress() {
    return this._status === InterviewEntity.STATUS_TYPES.EN_COURS;
  }

  get isCompleted() {
    return this._status === InterviewEntity.STATUS_TYPES.TERMINE;
  }

  get isCancelled() {
    return this._status === InterviewEntity.STATUS_TYPES.ANNULE;
  }

  get isPostponed() {
    return this._status === InterviewEntity.STATUS_TYPES.REPORTE;
  }

  get durationInHours() {
    return this._duration / 60;
  }

  get hasQuestions() {
    return this._questions.length > 0;
  }

  get averageQuestionRating() {
    if (!this.hasQuestions) return null;
    
    const ratings = this._questions
      .filter(q => q.rating)
      .map(q => q.rating);
    
    if (ratings.length === 0) return null;
    
    return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  }

  get completionPercentage() {
    if (!this.hasQuestions) return 0;
    
    const answeredQuestions = this._questions.filter(q => q.answer && q.answer.trim().length > 0);
    return Math.round((answeredQuestions.length / this._questions.length) * 100);
  }

  // Méthodes métier
  updateCandidateInfo(name, email, phone = null) {
    if (!name || name.trim().length === 0) {
      throw new ValidationError('Le nom du candidat est requis');
    }
    if (!email || email.trim().length === 0) {
      throw new ValidationError('L\'email du candidat est requis');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError('Format d\'email invalide');
    }

    this._candidateName = name.trim();
    this._candidateEmail = email.trim().toLowerCase();
    if (phone !== null) {
      this._candidatePhone = phone.trim();
    }
    this.updateTimestamp();
  }

  updateJobInfo(position, department) {
    if (!position || position.trim().length === 0) {
      throw new ValidationError('Le poste est requis');
    }
    if (!department || department.trim().length === 0) {
      throw new ValidationError('Le département est requis');
    }

    this._position = position.trim();
    this._department = department.trim();
    this.updateTimestamp();
  }

  reschedule(newDate) {
    if (!newDate || !(newDate instanceof Date)) {
      throw new ValidationError('Une date valide est requise');
    }

    if (newDate <= new Date()) {
      throw new ValidationError('La date d\'entretien doit être dans le futur');
    }

    this._scheduledDate = newDate;
    this._status = InterviewEntity.STATUS_TYPES.PLANIFIE;
    this.updateTimestamp();
  }

  start() {
    if (this._status !== InterviewEntity.STATUS_TYPES.PLANIFIE) {
      throw new ValidationError('Seuls les entretiens planifiés peuvent être démarrés');
    }

    this._status = InterviewEntity.STATUS_TYPES.EN_COURS;
    this.updateTimestamp();
  }

  complete(overallRating = null, recommendation = null, notes = '') {
    if (this._status !== InterviewEntity.STATUS_TYPES.EN_COURS) {
      throw new ValidationError('Seuls les entretiens en cours peuvent être terminés');
    }

    if (overallRating && (overallRating < 1 || overallRating > 5)) {
      throw new ValidationError('La note globale doit être entre 1 et 5');
    }

    if (recommendation && !Object.values(InterviewEntity.RECOMMENDATION_TYPES).includes(recommendation)) {
      throw new ValidationError('Type de recommandation invalide');
    }

    this._status = InterviewEntity.STATUS_TYPES.TERMINE;
    this._overallRating = overallRating;
    this._recommendation = recommendation;
    this._notes = notes;
    this.updateTimestamp();
  }

  cancel() {
    if (this._status === InterviewEntity.STATUS_TYPES.TERMINE) {
      throw new ValidationError('Un entretien terminé ne peut pas être annulé');
    }

    this._status = InterviewEntity.STATUS_TYPES.ANNULE;
    this.updateTimestamp();
  }

  addQuestion(questionData) {
    if (!questionData || !questionData.question) {
      throw new ValidationError('Les données de la question sont requises');
    }

    this._questions.push({
      id: questionData.id || Date.now().toString(),
      question: questionData.question,
      answer: questionData.answer || '',
      rating: questionData.rating || null,
      notes: questionData.notes || ''
    });
    this.updateTimestamp();
  }

  updateQuestionAnswer(questionId, answer, rating = null, notes = '') {
    const questionIndex = this._questions.findIndex(q => q.id === questionId);
    if (questionIndex === -1) {
      throw new ValidationError('Question non trouvée');
    }

    if (rating && (rating < 1 || rating > 5)) {
      throw new ValidationError('La note doit être entre 1 et 5');
    }

    this._questions[questionIndex].answer = answer;
    this._questions[questionIndex].rating = rating;
    this._questions[questionIndex].notes = notes;
    this.updateTimestamp();
  }

  attachCV(cvData) {
    if (!cvData || !cvData.filename) {
      throw new ValidationError('Les données du CV sont requises');
    }

    this._cv = {
      filename: cvData.filename,
      path: cvData.path,
      uploadDate: new Date()
    };
    this.updateTimestamp();
  }

  // Validation
  validate() {
    super.validate();

    if (!this._candidateName || this._candidateName.trim().length === 0) {
      throw new ValidationError('Le nom du candidat est requis');
    }

    if (!this._candidateEmail || this._candidateEmail.trim().length === 0) {
      throw new ValidationError('L\'email du candidat est requis');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this._candidateEmail)) {
      throw new ValidationError('Format d\'email invalide');
    }

    if (!this._position || this._position.trim().length === 0) {
      throw new ValidationError('Le poste est requis');
    }

    if (!this._department || this._department.trim().length === 0) {
      throw new ValidationError('Le département est requis');
    }

    if (!this._scheduledDate || !(this._scheduledDate instanceof Date)) {
      throw new ValidationError('Une date d\'entretien valide est requise');
    }

    if (!Object.values(InterviewEntity.STATUS_TYPES).includes(this._status)) {
      throw new ValidationError('Statut d\'entretien invalide');
    }

    if (!Object.values(InterviewEntity.INTERVIEW_TYPES).includes(this._type)) {
      throw new ValidationError('Type d\'entretien invalide');
    }

    if (this._overallRating && (this._overallRating < 1 || this._overallRating > 5)) {
      throw new ValidationError('La note globale doit être entre 1 et 5');
    }

    if (this._recommendation && !Object.values(InterviewEntity.RECOMMENDATION_TYPES).includes(this._recommendation)) {
      throw new ValidationError('Type de recommandation invalide');
    }
  }

  // Conversion vers objet simple
  toPlainObject() {
    return {
      ...super.toPlainObject(),
      candidateName: this._candidateName,
      candidateEmail: this._candidateEmail,
      candidatePhone: this._candidatePhone,
      position: this._position,
      department: this._department,
      scheduledDate: this._scheduledDate,
      duration: this._duration,
      status: this._status,
      type: this._type,
      location: this._location,
      meetingLink: this._meetingLink,
      interviewer: this._interviewer,
      interviewerId: this._interviewerId,
      questions: this._questions,
      overallRating: this._overallRating,
      recommendation: this._recommendation,
      notes: this._notes,
      cv: this._cv,
      createdBy: this._createdBy,
      // Propriétés calculées
      isScheduled: this.isScheduled,
      isInProgress: this.isInProgress,
      isCompleted: this.isCompleted,
      isCancelled: this.isCancelled,
      isPostponed: this.isPostponed,
      durationInHours: this.durationInHours,
      hasQuestions: this.hasQuestions,
      averageQuestionRating: this.averageQuestionRating,
      completionPercentage: this.completionPercentage
    };
  }

  // Factory method pour créer à partir de données API
  static fromApiData(data) {
    return new InterviewEntity({
      id: data.id || data._id,
      candidateName: data.candidateName,
      candidateEmail: data.candidateEmail,
      candidatePhone: data.candidatePhone,
      position: data.position,
      department: data.department,
      scheduledDate: data.scheduledDate,
      duration: data.duration,
      status: data.status,
      type: data.type,
      location: data.location,
      meetingLink: data.meetingLink,
      interviewer: data.interviewer,
      interviewerId: data.interviewerId || data.interviewer?._id,
      questions: data.questions,
      overallRating: data.overallRating,
      recommendation: data.recommendation,
      notes: data.notes,
      cv: data.cv,
      createdBy: data.createdBy,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
  }
}