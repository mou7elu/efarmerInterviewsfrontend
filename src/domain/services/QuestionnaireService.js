/**
 * Questionnaire Service - Domain Service
 * Gère la logique métier complexe du questionnaire (navigation, validation, etc.)
 */

const { ValidationError, BusinessLogicError } = require('../../shared/errors/DomainErrors');

class QuestionnaireService {
  constructor(questionRepository) {
    this.questionRepository = questionRepository;
  }

  /**
   * Valide la cohérence d'un questionnaire
   */
  async validateQuestionnaire(questions) {
    if (!questions || questions.length === 0) {
      throw new ValidationError('Un questionnaire doit contenir au moins une question');
    }

    // Vérifier l'unicité des codes
    const codes = questions.map(q => q.code);
    const uniqueCodes = new Set(codes);
    if (codes.length !== uniqueCodes.size) {
      throw new ValidationError('Tous les codes de questions doivent être uniques');
    }

    // Vérifier la séquence des codes
    const sortedCodes = codes.sort();
    for (let i = 0; i < sortedCodes.length; i++) {
      const expectedCode = `Q${(i + 1).toString().padStart(3, '0')}`;
      if (sortedCodes[i] !== expectedCode) {
        throw new ValidationError(`Code de question manquant ou invalide: ${expectedCode}`);
      }
    }

    return true;
  }

  /**
   * Calcule la prochaine question basée sur la logique de saut
   */
  async getNextQuestion(currentQuestion, response) {
    if (!currentQuestion.hasOptions() || !response) {
      // Pas d'options ou pas de réponse -> question suivante normale
      return await this._getSequentialNextQuestion(currentQuestion);
    }

    // Chercher l'option correspondante à la réponse
    const selectedOption = currentQuestion.options.find(
      option => option.libelle === response || option.valeur === response
    );

    if (!selectedOption) {
      throw new ValidationError('Réponse non valide pour cette question');
    }

    // Si l'option a une logique de saut
    if (selectedOption.goto) {
      const targetQuestion = await this.questionRepository.findById(selectedOption.goto);
      if (!targetQuestion) {
        throw new BusinessLogicError('Question cible du saut introuvable');
      }
      return targetQuestion;
    }

    // Sinon, question suivante normale
    return await this._getSequentialNextQuestion(currentQuestion);
  }

  /**
   * Obtient la question suivante dans l'ordre séquentiel
   */
  async _getSequentialNextQuestion(currentQuestion) {
    const currentCode = currentQuestion.code;
    const currentNumber = parseInt(currentCode.substring(1));
    const nextCode = `Q${(currentNumber + 1).toString().padStart(3, '0')}`;
    
    return await this.questionRepository.findByCode(nextCode);
  }

  /**
   * Calcule le pourcentage de progression dans le questionnaire
   */
  async calculateProgress(currentQuestionCode, responses = {}) {
    const allQuestions = await this.questionRepository.findAll();
    const totalQuestions = allQuestions.length;
    
    if (totalQuestions === 0) {
      return 0;
    }

    // Calculer les questions réellement visitées (en tenant compte des sauts)
    const visitedQuestions = await this._getVisitedQuestions(responses);
    const currentIndex = visitedQuestions.findIndex(q => q.code === currentQuestionCode);
    
    if (currentIndex === -1) {
      return 0;
    }

    return Math.round(((currentIndex + 1) / totalQuestions) * 100);
  }

  /**
   * Obtient la liste des questions visitées selon les réponses et la logique de saut
   */
  async _getVisitedQuestions(responses) {
    const visitedQuestions = [];
    let currentQuestion = await this.questionRepository.findByCode('Q001');
    
    while (currentQuestion) {
      visitedQuestions.push(currentQuestion);
      
      const response = responses[currentQuestion.code];
      if (!response) {
        // Pas de réponse pour cette question, on s'arrête
        break;
      }
      
      currentQuestion = await this.getNextQuestion(currentQuestion, response);
    }
    
    return visitedQuestions;
  }

  /**
   * Valide qu'un ensemble de réponses est complet et cohérent
   */
  async validateResponses(responses) {
    const errors = [];
    
    // Parcourir le questionnaire avec la logique de saut
    const visitedQuestions = await this._getVisitedQuestions(responses);
    
    for (const question of visitedQuestions) {
      const response = responses[question.code];
      
      // Vérifier les questions obligatoires
      if (question.obligatoire && (!response || response.toString().trim() === '')) {
        errors.push(`Réponse obligatoire manquante pour la question ${question.code}`);
        continue;
      }
      
      // Valider le type de réponse
      const validationError = this._validateResponseType(question, response);
      if (validationError) {
        errors.push(validationError);
      }
    }
    
    if (errors.length > 0) {
      throw new ValidationError(`Erreurs de validation: ${errors.join(', ')}`);
    }
    
    return true;
  }

  /**
   * Valide le type de réponse selon le type de question
   */
  _validateResponseType(question, response) {
    if (!response) return null; // Optionnelle et vide
    
    switch (question.type) {
      case 'number':
        if (isNaN(response)) {
          return `La réponse à ${question.code} doit être un nombre`;
        }
        break;
        
      case 'date':
        if (!Date.parse(response)) {
          return `La réponse à ${question.code} doit être une date valide`;
        }
        break;
        
      case 'single_choice':
        const validOptions = question.options.map(opt => opt.libelle);
        if (!validOptions.includes(response)) {
          return `La réponse à ${question.code} doit être une des options: ${validOptions.join(', ')}`;
        }
        break;
        
      case 'multi_choice':
        const responseArray = Array.isArray(response) ? response : [response];
        const validMultiOptions = question.options.map(opt => opt.libelle);
        const invalidResponses = responseArray.filter(r => !validMultiOptions.includes(r));
        if (invalidResponses.length > 0) {
          return `Réponses invalides pour ${question.code}: ${invalidResponses.join(', ')}`;
        }
        break;
        
      case 'boolean':
        if (response !== true && response !== false && response !== 'true' && response !== 'false') {
          return `La réponse à ${question.code} doit être vraie ou fausse`;
        }
        break;
    }
    
    return null;
  }

  /**
   * Génère un rapport de navigation du questionnaire
   */
  async generateNavigationReport() {
    const questions = await this.questionRepository.findAll();
    const questionsWithGoto = questions.filter(q => q.hasGotoLogic());
    
    const report = {
      totalQuestions: questions.length,
      questionsWithGoto: questionsWithGoto.length,
      gotoPercentage: ((questionsWithGoto.length / questions.length) * 100).toFixed(1),
      navigationPaths: []
    };
    
    // Analyser chaque chemin de navigation
    for (const question of questionsWithGoto) {
      for (const option of question.options) {
        if (option.goto) {
          const targetQuestion = await this.questionRepository.findById(option.goto);
          report.navigationPaths.push({
            from: question.code,
            fromText: question.texte,
            option: option.libelle,
            to: targetQuestion ? targetQuestion.code : 'INTROUVABLE',
            toText: targetQuestion ? targetQuestion.texte : 'Question introuvable'
          });
        }
      }
    }
    
    return report;
  }
}

module.exports = QuestionnaireService;