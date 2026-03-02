const { BaseEntity } = require('./BaseEntity');
const { ValidationError } = require('../../shared/errors/ValidationError');

/**
 * Entité représentant une réponse à un questionnaire
 */
class ReponseEntity extends BaseEntity {
  constructor(data) {
    super(data);
    this.exploitantId = data.exploitantId;
    this.questionnaireId = data.questionnaireId;
    this.reponses = data.reponses || [];
    this._validate();
  }

  _validate() {
    super._validate();
    
    if (!this.exploitantId || typeof this.exploitantId !== 'string' || this.exploitantId.trim().length === 0) {
      throw new ValidationError('L\'identifiant de l\'exploitant est obligatoire');
    }

    if (!this.questionnaireId) {
      throw new ValidationError('L\'identifiant du questionnaire est obligatoire');
    }

    if (!Array.isArray(this.reponses)) {
      throw new ValidationError('Les réponses doivent être un tableau');
    }

    // Validation des réponses individuelles
    this.reponses.forEach(reponse => {
      this._validateReponse(reponse);
    });
  }

  _validateReponse(reponse) {
    if (!reponse.questionId) {
      throw new ValidationError('L\'identifiant de la question est obligatoire pour chaque réponse');
    }

    if (reponse.valeur === undefined || reponse.valeur === null) {
      throw new ValidationError('La valeur de la réponse ne peut pas être vide');
    }
  }

  /**
   * Ajoute ou met à jour une réponse à une question
   */
  setReponse(questionId, valeur) {
    if (!questionId) {
      throw new ValidationError('L\'identifiant de la question est obligatoire');
    }

    if (valeur === undefined || valeur === null) {
      throw new ValidationError('La valeur de la réponse ne peut pas être vide');
    }

    // Chercher si une réponse existe déjà pour cette question
    const existingIndex = this.reponses.findIndex(r => r.questionId.toString() === questionId.toString());

    const nouvelleReponse = {
      questionId,
      valeur
    };

    if (existingIndex >= 0) {
      // Mettre à jour la réponse existante
      this.reponses[existingIndex] = nouvelleReponse;
    } else {
      // Ajouter une nouvelle réponse
      this.reponses.push(nouvelleReponse);
    }

    this.updatedAt = new Date();
  }

  /**
   * Obtient la réponse pour une question donnée
   */
  getReponse(questionId) {
    return this.reponses.find(r => r.questionId.toString() === questionId.toString());
  }

  /**
   * Supprime la réponse pour une question donnée
   */
  removeReponse(questionId) {
    const existingIndex = this.reponses.findIndex(r => r.questionId.toString() === questionId.toString());
    
    if (existingIndex >= 0) {
      this.reponses.splice(existingIndex, 1);
      this.updatedAt = new Date();
      return true;
    }
    
    return false;
  }

  /**
   * Obtient toutes les réponses pour un volet donné
   */
  getReponsesByVolet(questions) {
    const questionsVolet = questions.filter(q => q.voletId);
    return this.reponses.filter(r => 
      questionsVolet.some(q => q.id.toString() === r.questionId.toString())
    );
  }

  /**
   * Calcule le pourcentage de completion du questionnaire
   */
  getCompletionPercentage(totalQuestions) {
    if (totalQuestions === 0) return 0;
    return Math.round((this.reponses.length / totalQuestions) * 100);
  }

  /**
   * Vérifie si le questionnaire est complètement rempli
   */
  isComplete(questionsObligatoires) {
    const questionsObligatoiresIds = questionsObligatoires.map(q => q.id.toString());
    const reponsesIds = this.reponses.map(r => r.questionId.toString());
    
    return questionsObligatoiresIds.every(id => reponsesIds.includes(id));
  }

  /**
   * Obtient les questions obligatoires non remplies
   */
  getMissingRequiredQuestions(questionsObligatoires) {
    const reponsesIds = this.reponses.map(r => r.questionId.toString());
    return questionsObligatoires.filter(q => !reponsesIds.includes(q.id.toString()));
  }

  /**
   * Valide les réponses selon les types de questions
   */
  validateResponses(questions) {
    const errors = [];

    this.reponses.forEach(reponse => {
      const question = questions.find(q => q.id.toString() === reponse.questionId.toString());
      
      if (!question) {
        errors.push(`Question non trouvée pour l'ID: ${reponse.questionId}`);
        return;
      }

      try {
        this._validateResponseValue(question, reponse.valeur);
      } catch (error) {
        errors.push(`Question ${question.code}: ${error.message}`);
      }
    });

    if (errors.length > 0) {
      throw new ValidationError(`Erreurs de validation: ${errors.join(', ')}`);
    }
  }

  _validateResponseValue(question, valeur) {
    switch (question.type) {
      case 'number':
        if (isNaN(Number(valeur))) {
          throw new ValidationError('La valeur doit être un nombre');
        }
        break;
      case 'date':
        if (isNaN(Date.parse(valeur))) {
          throw new ValidationError('La valeur doit être une date valide');
        }
        break;
      case 'boolean':
        if (typeof valeur !== 'boolean' && valeur !== 'true' && valeur !== 'false') {
          throw new ValidationError('La valeur doit être un booléen');
        }
        break;
      case 'single_choice':
        if (Array.isArray(valeur)) {
          throw new ValidationError('Une seule option doit être sélectionnée');
        }
        break;
      case 'multi_choice':
        if (!Array.isArray(valeur)) {
          throw new ValidationError('Plusieurs options peuvent être sélectionnées');
        }
        break;
    }
  }

  /**
   * Convertit l'entité en objet pour la persistance
   */
  toPersistence() {
    return {
      _id: this.id,
      exploitantId: this.exploitantId,
      questionnaireId: this.questionnaireId,
      reponses: this.reponses,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Crée une entité à partir des données de persistance
   */
  static fromPersistence(data) {
    return new ReponseEntity({
      id: data._id?.toString() || data.id,
      exploitantId: data.exploitantId,
      questionnaireId: data.questionnaireId,
      reponses: data.reponses || [],
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
  }
}

module.exports = { ReponseEntity };