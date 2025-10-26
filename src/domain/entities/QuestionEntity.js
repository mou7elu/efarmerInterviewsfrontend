/**
 * Question Entity - Domain Layer
 * Représente une question du questionnaire dans le domaine métier
 */

import { BaseEntity } from './BaseEntity.js';
import { ValidationError } from '@shared/errors/DomainErrors.js';

export class QuestionEntity extends BaseEntity {
  constructor({
    id,
    code,
    texte,
    type,
    obligatoire = false,
    unite = null,
    automatique = false,
    options = [],
    sectionId,
    voletId,
    referenceTable = null,
    referenceField = null,
    createdAt,
    updatedAt
  }) {
    super(id);
    
    this._code = code;
    this._texte = texte;
    this._type = type;
    this._obligatoire = obligatoire;
    this._unite = unite;
    this._automatique = automatique;
    this._options = options || [];
    this._sectionId = sectionId;
    this._voletId = voletId;
    this._referenceTable = referenceTable;
    this._referenceField = referenceField;
    
    if (createdAt) this._createdAt = new Date(createdAt);
    if (updatedAt) this._updatedAt = new Date(updatedAt);
    
    this.validate();
  }

  // Types de questions autorisés
  static get TYPES() {
    return {
      TEXT: 'text',
      NUMBER: 'number', 
      DATE: 'date',
      SINGLE_CHOICE: 'single_choice',
      MULTI_CHOICE: 'multi_choice',
      BOOLEAN: 'boolean'
    };
  }

  // Tables de référence autorisées
  static get REFERENCE_TABLES() {
    return [
      'District', 'Region', 'Departement', 'Souspref', 
      'Village', 'Pays', 'Nationalite', 'NiveauScolaire', 
      'Piece', 'Producteur', 'Parcelle'
    ];
  }

  // Getters
  get code() { return this._code; }
  get texte() { return this._texte; }
  get type() { return this._type; }
  get obligatoire() { return this._obligatoire; }
  get unite() { return this._unite; }
  get automatique() { return this._automatique; }
  get options() { return [...this._options]; } // Copie défensive
  get sectionId() { return this._sectionId; }
  get voletId() { return this._voletId; }
  get referenceTable() { return this._referenceTable; }
  get referenceField() { return this._referenceField; }

  // Propriétés calculées
  get hasOptions() {
    return this._options.length > 0;
  }

  get hasGotoLogic() {
    return this._options.some(option => option.goto && option.goto.trim() !== '');
  }

  get isReferenceQuestion() {
    return this._referenceTable !== null && this._referenceField !== null;
  }

  get isChoiceQuestion() {
    return this._type === QuestionEntity.TYPES.SINGLE_CHOICE || 
           this._type === QuestionEntity.TYPES.MULTI_CHOICE;
  }

  get requiresOptions() {
    return this.isChoiceQuestion;
  }

  // Méthodes métier
  updateTexte(nouveauTexte) {
    if (!nouveauTexte || nouveauTexte.trim().length === 0) {
      throw new ValidationError('Le texte de la question est requis');
    }
    this._texte = nouveauTexte.trim();
    this.updateTimestamp();
  }

  makeObligatoire() {
    this._obligatoire = true;
    this.updateTimestamp();
  }

  makeOptionnelle() {
    this._obligatoire = false;
    this.updateTimestamp();
  }

  setUnite(unite) {
    this._unite = unite;
    this.updateTimestamp();
  }

  addOption(option) {
    if (!option || !option.libelle) {
      throw new ValidationError('Une option doit avoir un libellé');
    }
    
    // Vérifier que l'option n'existe pas déjà
    const existsAlready = this._options.some(opt => opt.libelle === option.libelle);
    if (existsAlready) {
      throw new ValidationError('Cette option existe déjà');
    }
    
    this._options.push({
      libelle: option.libelle,
      valeur: option.valeur || option.libelle,
      goto: option.goto || null,
      ordre: option.ordre || this._options.length + 1
    });
    this.updateTimestamp();
  }

  removeOption(optionLibelle) {
    const index = this._options.findIndex(opt => opt.libelle === optionLibelle);
    if (index > -1) {
      this._options.splice(index, 1);
      this.updateTimestamp();
    }
  }

  updateOption(optionLibelle, newData) {
    const index = this._options.findIndex(opt => opt.libelle === optionLibelle);
    if (index === -1) {
      throw new ValidationError('Option non trouvée');
    }

    this._options[index] = {
      ...this._options[index],
      ...newData
    };
    this.updateTimestamp();
  }

  setReferenceTable(table, field) {
    if (!QuestionEntity.REFERENCE_TABLES.includes(table)) {
      throw new ValidationError('Table de référence non autorisée');
    }
    if (!field) {
      throw new ValidationError('Le champ de référence est requis');
    }
    
    this._referenceTable = table;
    this._referenceField = field;
    this.updateTimestamp();
  }

  clearReferenceTable() {
    this._referenceTable = null;
    this._referenceField = null;
    this.updateTimestamp();
  }

  // Validation des réponses
  validateResponse(response) {
    if (this._obligatoire && (response === null || response === undefined || response === '')) {
      throw new ValidationError('Cette question est obligatoire');
    }

    if (response === null || response === undefined || response === '') {
      return true; // Question optionnelle non remplie
    }

    switch (this._type) {
      case QuestionEntity.TYPES.NUMBER:
        if (isNaN(response)) {
          throw new ValidationError('Une valeur numérique est requise');
        }
        break;

      case QuestionEntity.TYPES.DATE:
        if (!(response instanceof Date) && isNaN(Date.parse(response))) {
          throw new ValidationError('Une date valide est requise');
        }
        break;

      case QuestionEntity.TYPES.BOOLEAN:
        if (typeof response !== 'boolean' && response !== 'true' && response !== 'false') {
          throw new ValidationError('Une valeur booléenne est requise');
        }
        break;

      case QuestionEntity.TYPES.SINGLE_CHOICE:
        if (!this._options.some(opt => opt.valeur === response)) {
          throw new ValidationError('La valeur sélectionnée n\'est pas valide');
        }
        break;

      case QuestionEntity.TYPES.MULTI_CHOICE:
        if (!Array.isArray(response)) {
          throw new ValidationError('Un tableau de valeurs est requis pour les choix multiples');
        }
        const invalidValues = response.filter(val => !this._options.some(opt => opt.valeur === val));
        if (invalidValues.length > 0) {
          throw new ValidationError('Certaines valeurs sélectionnées ne sont pas valides');
        }
        break;
    }

    return true;
  }

  // Obtenir la prochaine question selon la logique de saut
  getNextQuestionCode(response) {
    if (!this.hasGotoLogic || !response) {
      return null;
    }

    const selectedOption = this._options.find(opt => opt.valeur === response);
    return selectedOption?.goto || null;
  }

  // Validation
  validate() {
    super.validate();

    if (!this._code || this._code.trim().length === 0) {
      throw new ValidationError('Le code de la question est requis');
    }

    if (!this._texte || this._texte.trim().length === 0) {
      throw new ValidationError('Le texte de la question est requis');
    }

    if (!this._type || !Object.values(QuestionEntity.TYPES).includes(this._type)) {
      throw new ValidationError('Type de question invalide');
    }

    // Vérifier que les questions à choix ont des options
    if (this.requiresOptions && this._options.length === 0) {
      throw new ValidationError('Les questions à choix doivent avoir au moins une option');
    }

    // Vérifier la cohérence des tables de référence
    if (this._referenceTable && !QuestionEntity.REFERENCE_TABLES.includes(this._referenceTable)) {
      throw new ValidationError('Table de référence non autorisée');
    }

    if (this._referenceTable && !this._referenceField) {
      throw new ValidationError('Le champ de référence est requis');
    }
  }

  // Conversion vers objet simple
  toPlainObject() {
    return {
      ...super.toPlainObject(),
      code: this._code,
      texte: this._texte,
      type: this._type,
      obligatoire: this._obligatoire,
      unite: this._unite,
      automatique: this._automatique,
      options: this._options,
      sectionId: this._sectionId,
      voletId: this._voletId,
      referenceTable: this._referenceTable,
      referenceField: this._referenceField,
      // Propriétés calculées
      hasOptions: this.hasOptions,
      hasGotoLogic: this.hasGotoLogic,
      isReferenceQuestion: this.isReferenceQuestion,
      isChoiceQuestion: this.isChoiceQuestion,
      requiresOptions: this.requiresOptions
    };
  }

  // Factory method pour créer à partir de données API
  static fromApiData(data) {
    return new QuestionEntity({
      id: data.id || data._id,
      code: data.code,
      texte: data.texte,
      type: data.type,
      obligatoire: data.obligatoire,
      unite: data.unite,
      automatique: data.automatique,
      options: data.options,
      sectionId: data.sectionId,
      voletId: data.voletId,
      referenceTable: data.referenceTable,
      referenceField: data.referenceField,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
  }
}