/**
 * Interview DTOs
 * Objets de transfert de données pour les entretiens
 */

export class InterviewDTO {
  constructor(data) {
    this.id = data.id;
    this.candidateName = data.candidateName;
    this.candidateEmail = data.candidateEmail;
    this.candidatePhone = data.candidatePhone;
    this.position = data.position;
    this.department = data.department;
    this.scheduledDate = data.scheduledDate;
    this.duration = data.duration;
    this.status = data.status;
    this.type = data.type;
    this.location = data.location;
    this.meetingLink = data.meetingLink;
    this.interviewer = data.interviewer;
    this.interviewerId = data.interviewerId;
    this.questions = data.questions;
    this.overallRating = data.overallRating;
    this.recommendation = data.recommendation;
    this.notes = data.notes;
    this.cv = data.cv;
    this.createdBy = data.createdBy;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    
    // Propriétés calculées
    this.isScheduled = data.isScheduled;
    this.isInProgress = data.isInProgress;
    this.isCompleted = data.isCompleted;
    this.isCancelled = data.isCancelled;
    this.isPostponed = data.isPostponed;
    this.durationInHours = data.durationInHours;
    this.hasQuestions = data.hasQuestions;
    this.averageQuestionRating = data.averageQuestionRating;
    this.completionPercentage = data.completionPercentage;
  }

  static fromEntity(interviewEntity) {
    return new InterviewDTO(interviewEntity.toPlainObject());
  }

  static fromApiResponse(apiData) {
    return new InterviewDTO({
      id: apiData.id || apiData._id,
      candidateName: apiData.candidateName,
      candidateEmail: apiData.candidateEmail,
      candidatePhone: apiData.candidatePhone,
      position: apiData.position,
      department: apiData.department,
      scheduledDate: new Date(apiData.scheduledDate),
      duration: apiData.duration,
      status: apiData.status,
      type: apiData.type,
      location: apiData.location,
      meetingLink: apiData.meetingLink,
      interviewer: apiData.interviewer,
      interviewerId: apiData.interviewerId || apiData.interviewer?._id,
      questions: apiData.questions || [],
      overallRating: apiData.overallRating,
      recommendation: apiData.recommendation,
      notes: apiData.notes,
      cv: apiData.cv,
      createdBy: apiData.createdBy,
      createdAt: apiData.createdAt,
      updatedAt: apiData.updatedAt,
      
      // Propriétés calculées
      isScheduled: apiData.status === 'planifie',
      isInProgress: apiData.status === 'en_cours',
      isCompleted: apiData.status === 'termine',
      isCancelled: apiData.status === 'annule',
      isPostponed: apiData.status === 'reporte',
      durationInHours: apiData.duration / 60,
      hasQuestions: (apiData.questions || []).length > 0,
      averageQuestionRating: InterviewDTO.calculateAverageRating(apiData.questions),
      completionPercentage: InterviewDTO.calculateCompletionPercentage(apiData.questions)
    });
  }

  static calculateAverageRating(questions) {
    if (!questions || questions.length === 0) return null;
    
    const ratings = questions
      .filter(q => q.rating)
      .map(q => q.rating);
    
    if (ratings.length === 0) return null;
    
    return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  }

  static calculateCompletionPercentage(questions) {
    if (!questions || questions.length === 0) return 0;
    
    const answeredQuestions = questions.filter(q => q.answer && q.answer.trim().length > 0);
    return Math.round((answeredQuestions.length / questions.length) * 100);
  }

  getStatusLabel() {
    const statusLabels = {
      'planifie': 'Planifié',
      'en_cours': 'En cours',
      'termine': 'Terminé',
      'annule': 'Annulé',
      'reporte': 'Reporté'
    };
    return statusLabels[this.status] || this.status;
  }

  getTypeLabel() {
    const typeLabels = {
      'presentiel': 'Présentiel',
      'visio': 'Visio',
      'telephonique': 'Téléphonique'
    };
    return typeLabels[this.type] || this.type;
  }

  getRecommendationLabel() {
    const recommendationLabels = {
      'recommande': 'Recommandé',
      'pas_recommande': 'Pas recommandé',
      'reserve': 'Réservé'
    };
    return recommendationLabels[this.recommendation] || this.recommendation;
  }
}

export class InterviewCreateDTO {
  constructor(data) {
    this.candidateName = data.candidateName;
    this.candidateEmail = data.candidateEmail;
    this.candidatePhone = data.candidatePhone;
    this.position = data.position;
    this.department = data.department;
    this.scheduledDate = data.scheduledDate;
    this.duration = data.duration;
    this.type = data.type;
    this.location = data.location;
    this.meetingLink = data.meetingLink;
    this.interviewerId = data.interviewerId;
  }

  static fromForm(formData) {
    return new InterviewCreateDTO({
      candidateName: formData.candidateName,
      candidateEmail: formData.candidateEmail,
      candidatePhone: formData.candidatePhone,
      position: formData.position,
      department: formData.department,
      scheduledDate: formData.scheduledDate,
      duration: formData.duration || 60,
      type: formData.type || 'presentiel',
      location: formData.location,
      meetingLink: formData.meetingLink,
      interviewerId: formData.interviewerId
    });
  }

  toApiPayload() {
    return {
      candidateName: this.candidateName,
      candidateEmail: this.candidateEmail,
      candidatePhone: this.candidatePhone,
      position: this.position,
      department: this.department,
      scheduledDate: this.scheduledDate,
      duration: this.duration,
      type: this.type,
      location: this.location,
      meetingLink: this.meetingLink,
      interviewer: this.interviewerId
    };
  }
}

export class InterviewUpdateDTO {
  constructor(data) {
    this.candidateName = data.candidateName;
    this.candidateEmail = data.candidateEmail;
    this.candidatePhone = data.candidatePhone;
    this.position = data.position;
    this.department = data.department;
    this.scheduledDate = data.scheduledDate;
    this.duration = data.duration;
    this.type = data.type;
    this.location = data.location;
    this.meetingLink = data.meetingLink;
    this.interviewerId = data.interviewerId;
    this.status = data.status;
    this.overallRating = data.overallRating;
    this.recommendation = data.recommendation;
    this.notes = data.notes;
  }

  static fromForm(formData) {
    return new InterviewUpdateDTO({
      candidateName: formData.candidateName,
      candidateEmail: formData.candidateEmail,
      candidatePhone: formData.candidatePhone,
      position: formData.position,
      department: formData.department,
      scheduledDate: formData.scheduledDate,
      duration: formData.duration,
      type: formData.type,
      location: formData.location,
      meetingLink: formData.meetingLink,
      interviewerId: formData.interviewerId,
      status: formData.status,
      overallRating: formData.overallRating,
      recommendation: formData.recommendation,
      notes: formData.notes
    });
  }

  toApiPayload() {
    const payload = {};
    
    if (this.candidateName !== undefined) payload.candidateName = this.candidateName;
    if (this.candidateEmail !== undefined) payload.candidateEmail = this.candidateEmail;
    if (this.candidatePhone !== undefined) payload.candidatePhone = this.candidatePhone;
    if (this.position !== undefined) payload.position = this.position;
    if (this.department !== undefined) payload.department = this.department;
    if (this.scheduledDate !== undefined) payload.scheduledDate = this.scheduledDate;
    if (this.duration !== undefined) payload.duration = this.duration;
    if (this.type !== undefined) payload.type = this.type;
    if (this.location !== undefined) payload.location = this.location;
    if (this.meetingLink !== undefined) payload.meetingLink = this.meetingLink;
    if (this.interviewerId !== undefined) payload.interviewer = this.interviewerId;
    if (this.status !== undefined) payload.status = this.status;
    if (this.overallRating !== undefined) payload.overallRating = this.overallRating;
    if (this.recommendation !== undefined) payload.recommendation = this.recommendation;
    if (this.notes !== undefined) payload.notes = this.notes;
    
    return payload;
  }
}

export class InterviewFiltersDTO {
  constructor(data = {}) {
    this.status = data.status;
    this.department = data.department;
    this.interviewer = data.interviewer;
    this.type = data.type;
    this.dateFrom = data.dateFrom;
    this.dateTo = data.dateTo;
    this.search = data.search;
  }

  static fromQuery(queryParams) {
    return new InterviewFiltersDTO({
      status: queryParams.status,
      department: queryParams.department,
      interviewer: queryParams.interviewer,
      type: queryParams.type,
      dateFrom: queryParams.dateFrom ? new Date(queryParams.dateFrom) : null,
      dateTo: queryParams.dateTo ? new Date(queryParams.dateTo) : null,
      search: queryParams.search
    });
  }

  toQueryParams() {
    const params = {};
    
    if (this.status) params.status = this.status;
    if (this.department) params.department = this.department;
    if (this.interviewer) params.interviewer = this.interviewer;
    if (this.type) params.type = this.type;
    if (this.dateFrom) params.dateFrom = this.dateFrom.toISOString();
    if (this.dateTo) params.dateTo = this.dateTo.toISOString();
    if (this.search) params.search = this.search;
    
    return params;
  }
}

export class InterviewSearchDTO {
  constructor(searchTerm, filters = {}, sorting = {}, pagination = {}) {
    this.searchTerm = searchTerm;
    this.filters = filters;
    this.sorting = sorting;
    this.pagination = pagination;
  }

  static fromForm(formData) {
    return new InterviewSearchDTO(
      formData.searchTerm,
      formData.filters || {},
      formData.sorting || { field: 'scheduledDate', direction: 'desc' },
      formData.pagination || { page: 1, limit: 10 }
    );
  }
}