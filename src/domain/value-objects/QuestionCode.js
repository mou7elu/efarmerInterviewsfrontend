/**
 * Question Code Value Object
 * Représente et valide un code de question (ex: Q27)
 */

export class QuestionCode {
  constructor(value) {
    this._value = this._validate(value);
    Object.freeze(this); // Immutabilité
  }

  get value() {
    return this._value;
  }

  get number() {
    return parseInt(this._value.substring(1));
  }

  _validate(code) {
    if (!code || typeof code !== 'string') {
      throw new Error('Le code de question doit être une chaîne de caractères');
    }

    const trimmedCode = code.trim().toUpperCase();
    
    if (trimmedCode.length === 0) {
      throw new Error('Le code de question ne peut pas être vide');
    }

    // Format: Q suivi d'un ou plusieurs chiffres (ex: Q1, Q27, Q145)
    const codeRegex = /^Q\d+$/;
    
    if (!codeRegex.test(trimmedCode)) {
      throw new Error('Format de code de question invalide. Attendu: Q suivi de chiffres (ex: Q27)');
    }

    return trimmedCode;
  }

  equals(other) {
    return other instanceof QuestionCode && this._value === other._value;
  }

  toString() {
    return this._value;
  }

  toJSON() {
    return this._value;
  }

  // Méthodes utilitaires
  static isValidFormat(code) {
    try {
      new QuestionCode(code);
      return true;
    } catch {
      return false;
    }
  }

  static fromNumber(number) {
    if (!Number.isInteger(number) || number < 1) {
      throw new Error('Le numéro de question doit être un entier positif');
    }
    return new QuestionCode(`Q${number}`);
  }
}