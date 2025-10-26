/**
 * Questionnaire Entity - Agricultural Questionnaire
 * Représente un questionnaire agricole dans le domaine métier
 */

import { BaseEntity } from './BaseEntity.js';
import { ValidationError } from '@shared/errors/DomainErrors.js';

export class QuestionnaireEntity extends BaseEntity {
  constructor({
    id,
    titre,
    description,
    version = '1.0',
    statut = 'brouillon',
    typeQuestionnaire,
    domaineApplication = [],
    questions = [],
    sections = [],
    parametres = {},
    dureeEstimee = 30,
    niveauDifficulte = 'moyen',
    languagesPrises = ['fr'],
    metadonnees = {},
    tagsRecherche = [],
    instructionsSpeciales = '',
    scoreMinimum = null,
    scoreMaximum = null,
    critereValidation = null,
    modeleReponse = null,
    validePar = null,
    dateValidation = null,
    utiliseCompte = 0,
    dernierUtilise = null,
    feedbackMoyen = null,
    createdBy,
    createdAt,
    updatedAt
  }) {
    super(id);
    
    this._titre = titre;
    this._description = description;
    this._version = version;
    this._statut = statut;
    this._typeQuestionnaire = typeQuestionnaire;
    this._domaineApplication = domaineApplication || [];
    this._questions = questions || [];
    this._sections = sections || [];
    this._parametres = parametres || {};
    this._dureeEstimee = dureeEstimee;
    this._niveauDifficulte = niveauDifficulte;
    this._languagesPrises = languagesPrises || ['fr'];
    this._metadonnees = metadonnees || {};
    this._tagsRecherche = tagsRecherche || [];
    this._instructionsSpeciales = instructionsSpeciales;
    this._scoreMinimum = scoreMinimum;
    this._scoreMaximum = scoreMaximum;
    this._critereValidation = critereValidation;
    this._modeleReponse = modeleReponse;
    this._validePar = validePar;
    this._dateValidation = dateValidation ? new Date(dateValidation) : null;
    this._utiliseCompte = utiliseCompte;
    this._dernierUtilise = dernierUtilise ? new Date(dernierUtilise) : null;
    this._feedbackMoyen = feedbackMoyen;
    this._createdBy = createdBy;
    
    if (createdAt) this._createdAt = new Date(createdAt);
    if (updatedAt) this._updatedAt = new Date(updatedAt);
    
    this.validate();
  }

  // Statuts du questionnaire
  static get STATUT_TYPES() {
    return {
      BROUILLON: 'brouillon',
      EN_REVISION: 'en_revision',
      VALIDE: 'valide',
      PUBLIE: 'publie',
      ARCHIVE: 'archive',
      SUSPENDU: 'suspendu'
    };
  }

  // Types de questionnaire
  static get TYPE_QUESTIONNAIRE() {
    return {
      EVALUATION_AGRICOLE: 'evaluation_agricole',
      ENQUETE_TERRAIN: 'enquete_terrain',
      DIAGNOSTIC_EXPLOITATION: 'diagnostic_exploitation',
      FORMATION_AGRICOLE: 'formation_agricole',
      CERTIFICATION: 'certification',
      RECHERCHE: 'recherche'
    };
  }

  // Niveaux de difficulté
  static get NIVEAU_DIFFICULTE() {
    return {
      FACILE: 'facile',
      MOYEN: 'moyen',
      DIFFICILE: 'difficile',
      EXPERT: 'expert'
    };
  }

  // Domaines d'application
  static get DOMAINES_APPLICATION() {
    return {
      CEREALES: 'cereales',
      LEGUMINEUSES: 'legumineuses',
      TUBERCULES: 'tubercules',
      FRUITS_LEGUMES: 'fruits_legumes',
      ELEVAGE: 'elevage',
      PECHE: 'peche',
      FORESTERIE: 'foresterie',
      TRANSFORMATION: 'transformation',
      COMMERCIALISATION: 'commercialisation',
      FINANCEMENT: 'financement'
    };
  }

  // Getters
  get titre() { return this._titre; }
  get description() { return this._description; }
  get version() { return this._version; }
  get statut() { return this._statut; }
  get typeQuestionnaire() { return this._typeQuestionnaire; }
  get domaineApplication() { return [...this._domaineApplication]; }
  get questions() { return [...this._questions]; }
  get sections() { return [...this._sections]; }
  get parametres() { return { ...this._parametres }; }
  get dureeEstimee() { return this._dureeEstimee; }
  get niveauDifficulte() { return this._niveauDifficulte; }
  get languagesPrises() { return [...this._languagesPrises]; }
  get metadonnees() { return { ...this._metadonnees }; }
  get tagsRecherche() { return [...this._tagsRecherche]; }
  get instructionsSpeciales() { return this._instructionsSpeciales; }
  get scoreMinimum() { return this._scoreMinimum; }
  get scoreMaximum() { return this._scoreMaximum; }
  get critereValidation() { return this._critereValidation; }
  get modeleReponse() { return this._modeleReponse; }
  get validePar() { return this._validePar; }
  get dateValidation() { return this._dateValidation; }
  get utiliseCompte() { return this._utiliseCompte; }
  get dernierUtilise() { return this._dernierUtilise; }
  get feedbackMoyen() { return this._feedbackMoyen; }
  get createdBy() { return this._createdBy; }

  // Propriétés calculées
  get isDraft() {
    return this._statut === QuestionnaireEntity.STATUT_TYPES.BROUILLON;
  }

  get isInReview() {
    return this._statut === QuestionnaireEntity.STATUT_TYPES.EN_REVISION;
  }

  get isValidated() {
    return this._statut === QuestionnaireEntity.STATUT_TYPES.VALIDE;
  }

  get isPublished() {
    return this._statut === QuestionnaireEntity.STATUT_TYPES.PUBLIE;
  }

  get isArchived() {
    return this._statut === QuestionnaireEntity.STATUT_TYPES.ARCHIVE;
  }

  get isSuspended() {
    return this._statut === QuestionnaireEntity.STATUT_TYPES.SUSPENDU;
  }

  get canBeUsed() {
    return this.isValidated || this.isPublished;
  }

  get totalQuestions() {
    return this._questions.length;
  }

  get sectionsCount() {
    return this._sections.length;
  }

  get questionsBySections() {
    const questionsBySection = {};
    this._sections.forEach(section => {
      questionsBySection[section.id] = this._questions.filter(q => q.sectionId === section.id);
    });
    return questionsBySection;
  }

  get questionsTypes() {
    const types = new Set();
    this._questions.forEach(q => types.add(q.type));
    return Array.from(types);
  }

  get hasConditionalLogic() {
    return this._questions.some(q => q.conditionsAffichage || q.logicSaut);
  }

  get complexity() {
    let score = 0;
    score += this.totalQuestions * 0.5;
    score += this.sectionsCount * 2;
    if (this.hasConditionalLogic) score += 10;
    if (this._dureeEstimee > 60) score += 5;
    
    if (score < 10) return 'Simple';
    if (score < 25) return 'Modéré';
    if (score < 50) return 'Complexe';
    return 'Très complexe';
  }

  get estimatedDurationText() {
    const hours = Math.floor(this._dureeEstimee / 60);
    const minutes = this._dureeEstimee % 60;
    
    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
    }
    return `${minutes}min`;
  }

  get popularityScore() {
    if (this._utiliseCompte === 0) return 0;
    
    const usageScore = Math.min(this._utiliseCompte / 100, 1) * 40;
    const feedbackScore = this._feedbackMoyen ? (this._feedbackMoyen / 5) * 40 : 0;
    const freshnessScore = this._dernierUtilise ? 
      Math.max(0, 20 - ((Date.now() - this._dernierUtilise.getTime()) / (1000 * 60 * 60 * 24 * 30))) : 0;
    
    return Math.round(usageScore + feedbackScore + freshnessScore);
  }

  // Méthodes métier
  updateBasicInfo(titre, description, typeQuestionnaire, domaineApplication) {
    if (!titre || titre.trim().length === 0) {
      throw new ValidationError('Le titre est requis');
    }

    this._titre = titre.trim();
    this._description = description || '';
    this._typeQuestionnaire = typeQuestionnaire;
    this._domaineApplication = domaineApplication || [];
    this.updateTimestamp();
  }

  addSection(sectionData) {
    if (!sectionData || !sectionData.titre) {
      throw new ValidationError('Le titre de la section est requis');
    }

    const newSection = {
      id: sectionData.id || Date.now().toString(),
      titre: sectionData.titre,
      description: sectionData.description || '',
      ordre: sectionData.ordre || this._sections.length + 1,
      obligatoire: sectionData.obligatoire || false,
      conditionsAffichage: sectionData.conditionsAffichage || null
    };

    this._sections.push(newSection);
    this._sections.sort((a, b) => a.ordre - b.ordre);
    this.updateTimestamp();
    return newSection.id;
  }

  updateSection(sectionId, updates) {
    const sectionIndex = this._sections.findIndex(s => s.id === sectionId);
    if (sectionIndex === -1) {
      throw new ValidationError('Section non trouvée');
    }

    this._sections[sectionIndex] = {
      ...this._sections[sectionIndex],
      ...updates,
      id: sectionId // Préserver l'ID
    };

    if (updates.ordre !== undefined) {
      this._sections.sort((a, b) => a.ordre - b.ordre);
    }

    this.updateTimestamp();
  }

  removeSection(sectionId) {
    const sectionIndex = this._sections.findIndex(s => s.id === sectionId);
    if (sectionIndex === -1) {
      throw new ValidationError('Section non trouvée');
    }

    // Supprimer aussi les questions de cette section
    this._questions = this._questions.filter(q => q.sectionId !== sectionId);
    this._sections.splice(sectionIndex, 1);
    this.updateTimestamp();
  }

  addQuestion(questionData) {
    if (!questionData || !questionData.texte) {
      throw new ValidationError('Le texte de la question est requis');
    }

    const newQuestion = {
      id: questionData.id || Date.now().toString(),
      texte: questionData.texte,
      type: questionData.type || 'text',
      sectionId: questionData.sectionId || null,
      ordre: questionData.ordre || this._questions.length + 1,
      obligatoire: questionData.obligatoire || false,
      options: questionData.options || [],
      validation: questionData.validation || null,
      placeholder: questionData.placeholder || '',
      aide: questionData.aide || '',
      conditionsAffichage: questionData.conditionsAffichage || null,
      logicSaut: questionData.logicSaut || null,
      scorePoints: questionData.scorePoints || 0,
      categorieAnalyse: questionData.categorieAnalyse || '',
      tableReference: questionData.tableReference || null
    };

    this._questions.push(newQuestion);
    this._questions.sort((a, b) => a.ordre - b.ordre);
    this.updateTimestamp();
    return newQuestion.id;
  }

  updateQuestion(questionId, updates) {
    const questionIndex = this._questions.findIndex(q => q.id === questionId);
    if (questionIndex === -1) {
      throw new ValidationError('Question non trouvée');
    }

    this._questions[questionIndex] = {
      ...this._questions[questionIndex],
      ...updates,
      id: questionId // Préserver l'ID
    };

    if (updates.ordre !== undefined) {
      this._questions.sort((a, b) => a.ordre - b.ordre);
    }

    this.updateTimestamp();
  }

  removeQuestion(questionId) {
    const questionIndex = this._questions.findIndex(q => q.id === questionId);
    if (questionIndex === -1) {
      throw new ValidationError('Question non trouvée');
    }

    this._questions.splice(questionIndex, 1);
    this.updateTimestamp();
  }

  reorderQuestions(questionIds) {
    if (questionIds.length !== this._questions.length) {
      throw new ValidationError('Tous les IDs de questions doivent être fournis');
    }

    const reorderedQuestions = [];
    questionIds.forEach((id, index) => {
      const question = this._questions.find(q => q.id === id);
      if (!question) {
        throw new ValidationError(`Question avec ID ${id} non trouvée`);
      }
      reorderedQuestions.push({ ...question, ordre: index + 1 });
    });

    this._questions = reorderedQuestions;
    this.updateTimestamp();
  }

  duplicate(newTitre) {
    return new QuestionnaireEntity({
      titre: newTitre || `${this._titre} (Copie)`,
      description: this._description,
      typeQuestionnaire: this._typeQuestionnaire,
      domaineApplication: [...this._domaineApplication],
      questions: this._questions.map(q => ({ ...q, id: Date.now().toString() + Math.random() })),
      sections: this._sections.map(s => ({ ...s, id: Date.now().toString() + Math.random() })),
      parametres: { ...this._parametres },
      dureeEstimee: this._dureeEstimee,
      niveauDifficulte: this._niveauDifficulte,
      languagesPrises: [...this._languagesPrises],
      tagsRecherche: [...this._tagsRecherche],
      instructionsSpeciales: this._instructionsSpeciales,
      scoreMinimum: this._scoreMinimum,
      scoreMaximum: this._scoreMaximum,
      createdBy: this._createdBy
    });
  }

  submitForReview() {
    if (!this.isDraft) {
      throw new ValidationError('Seuls les questionnaires en brouillon peuvent être soumis pour révision');
    }

    if (this._questions.length === 0) {
      throw new ValidationError('Le questionnaire doit contenir au moins une question');
    }

    this._statut = QuestionnaireEntity.STATUT_TYPES.EN_REVISION;
    this.updateTimestamp();
  }

  validate_questionnaire(validateur) {
    if (!this.isInReview) {
      throw new ValidationError('Seuls les questionnaires en révision peuvent être validés');
    }

    this._statut = QuestionnaireEntity.STATUT_TYPES.VALIDE;
    this._validePar = validateur;
    this._dateValidation = new Date();
    this.updateTimestamp();
  }

  publish() {
    if (!this.isValidated) {
      throw new ValidationError('Seuls les questionnaires validés peuvent être publiés');
    }

    this._statut = QuestionnaireEntity.STATUT_TYPES.PUBLIE;
    this.updateTimestamp();
  }

  archive() {
    if (this.isArchived) {
      throw new ValidationError('Le questionnaire est déjà archivé');
    }

    this._statut = QuestionnaireEntity.STATUT_TYPES.ARCHIVE;
    this.updateTimestamp();
  }

  suspend() {
    if (!this.canBeUsed) {
      throw new ValidationError('Seuls les questionnaires validés ou publiés peuvent être suspendus');
    }

    this._statut = QuestionnaireEntity.STATUT_TYPES.SUSPENDU;
    this.updateTimestamp();
  }

  recordUsage() {
    this._utiliseCompte++;
    this._dernierUtilise = new Date();
    this.updateTimestamp();
  }

  addFeedback(rating, commentaire = '') {
    if (rating < 1 || rating > 5) {
      throw new ValidationError('La note doit être entre 1 et 5');
    }

    if (!this._metadonnees.feedbacks) {
      this._metadonnees.feedbacks = [];
    }

    this._metadonnees.feedbacks.push({
      rating,
      commentaire,
      date: new Date()
    });

    // Recalculer la moyenne
    const feedbacks = this._metadonnees.feedbacks;
    this._feedbackMoyen = feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length;

    this.updateTimestamp();
  }

  // Validation
  validate() {
    super.validate();

    if (!this._titre || this._titre.trim().length === 0) {
      throw new ValidationError('Le titre est requis');
    }

    if (!Object.values(QuestionnaireEntity.STATUT_TYPES).includes(this._statut)) {
      throw new ValidationError('Statut invalide');
    }

    if (this._typeQuestionnaire && !Object.values(QuestionnaireEntity.TYPE_QUESTIONNAIRE).includes(this._typeQuestionnaire)) {
      throw new ValidationError('Type de questionnaire invalide');
    }

    if (this._niveauDifficulte && !Object.values(QuestionnaireEntity.NIVEAU_DIFFICULTE).includes(this._niveauDifficulte)) {
      throw new ValidationError('Niveau de difficulté invalide');
    }

    if (this._dureeEstimee < 0) {
      throw new ValidationError('La durée estimée ne peut pas être négative');
    }

    if (this._scoreMinimum !== null && this._scoreMaximum !== null && this._scoreMinimum > this._scoreMaximum) {
      throw new ValidationError('Le score minimum ne peut pas être supérieur au score maximum');
    }
  }

  // Sérialisation
  toPlainObject() {
    return {
      ...super.toPlainObject(),
      titre: this._titre,
      description: this._description,
      version: this._version,
      statut: this._statut,
      typeQuestionnaire: this._typeQuestionnaire,
      domaineApplication: this._domaineApplication,
      questions: this._questions,
      sections: this._sections,
      parametres: this._parametres,
      dureeEstimee: this._dureeEstimee,
      niveauDifficulte: this._niveauDifficulte,
      languagesPrises: this._languagesPrises,
      metadonnees: this._metadonnees,
      tagsRecherche: this._tagsRecherche,
      instructionsSpeciales: this._instructionsSpeciales,
      scoreMinimum: this._scoreMinimum,
      scoreMaximum: this._scoreMaximum,
      critereValidation: this._critereValidation,
      modeleReponse: this._modeleReponse,
      validePar: this._validePar,
      dateValidation: this._dateValidation,
      utiliseCompte: this._utiliseCompte,
      dernierUtilise: this._dernierUtilise,
      feedbackMoyen: this._feedbackMoyen,
      createdBy: this._createdBy,
      // Propriétés calculées
      isDraft: this.isDraft,
      isInReview: this.isInReview,
      isValidated: this.isValidated,
      isPublished: this.isPublished,
      isArchived: this.isArchived,
      isSuspended: this.isSuspended,
      canBeUsed: this.canBeUsed,
      totalQuestions: this.totalQuestions,
      sectionsCount: this.sectionsCount,
      questionsBySections: this.questionsBySections,
      questionsTypes: this.questionsTypes,
      hasConditionalLogic: this.hasConditionalLogic,
      complexity: this.complexity,
      estimatedDurationText: this.estimatedDurationText,
      popularityScore: this.popularityScore
    };
  }

  // Factory method
  static fromApiData(data) {
    return new QuestionnaireEntity({
      id: data.id || data._id,
      titre: data.titre,
      description: data.description,
      version: data.version,
      statut: data.statut,
      typeQuestionnaire: data.typeQuestionnaire,
      domaineApplication: data.domaineApplication,
      questions: data.questions,
      sections: data.sections,
      parametres: data.parametres,
      dureeEstimee: data.dureeEstimee,
      niveauDifficulte: data.niveauDifficulte,
      languagesPrises: data.languagesPrises,
      metadonnees: data.metadonnees,
      tagsRecherche: data.tagsRecherche,
      instructionsSpeciales: data.instructionsSpeciales,
      scoreMinimum: data.scoreMinimum,
      scoreMaximum: data.scoreMaximum,
      critereValidation: data.critereValidation,
      modeleReponse: data.modeleReponse,
      validePar: data.validePar,
      dateValidation: data.dateValidation,
      utiliseCompte: data.utiliseCompte,
      dernierUtilise: data.dernierUtilise,
      feedbackMoyen: data.feedbackMoyen,
      createdBy: data.createdBy,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
  }
}