const { ValidationError } = require('../../shared/errors/ValidationError');

/**
 * Value Object pour représenter un libellé (nom générique pour les entités de référence)
 */
class Libelle {
  constructor(value, maxLength = 100) {
    this._value = value;
    this._maxLength = maxLength;
    this._validate();
    Object.freeze(this);
  }

  _validate() {
    if (!this._value || typeof this._value !== 'string') {
      throw new ValidationError('Le libellé doit être une chaîne de caractères');
    }

    if (this._value.trim().length === 0) {
      throw new ValidationError('Le libellé ne peut pas être vide');
    }

    if (this._value.length > this._maxLength) {
      throw new ValidationError(`Le libellé ne peut pas dépasser ${this._maxLength} caractères`);
    }

    // Validation des caractères autorisés (lettres, chiffres, espaces, apostrophes, tirets)
    const pattern = /^[a-zA-ZÀ-ÿ0-9\s'\-().,]+$/;
    if (!pattern.test(this._value)) {
      throw new ValidationError('Le libellé contient des caractères non autorisés');
    }
  }

  get value() {
    return this._value;
  }

  /**
   * Obtient le libellé nettoyé (espaces supprimés)
   */
  getTrimmed() {
    return this._value.trim();
  }

  /**
   * Obtient le libellé en majuscules
   */
  toUpperCase() {
    return this._value.toUpperCase();
  }

  /**
   * Obtient le libellé en minuscules
   */
  toLowerCase() {
    return this._value.toLowerCase();
  }

  /**
   * Obtient le libellé avec la première lettre en majuscule
   */
  toTitleCase() {
    return this._value.charAt(0).toUpperCase() + this._value.slice(1).toLowerCase();
  }

  /**
   * Vérifie si le libellé contient un mot donné
   */
  contains(word) {
    return this._value.toLowerCase().includes(word.toLowerCase());
  }

  /**
   * Obtient la longueur du libellé
   */
  getLength() {
    return this._value.length;
  }

  /**
   * Vérifie si le libellé commence par un préfixe donné
   */
  startsWith(prefix) {
    return this._value.toLowerCase().startsWith(prefix.toLowerCase());
  }

  /**
   * Vérifie si le libellé se termine par un suffixe donné
   */
  endsWith(suffix) {
    return this._value.toLowerCase().endsWith(suffix.toLowerCase());
  }

  toString() {
    return this._value;
  }

  equals(other) {
    if (!(other instanceof Libelle)) return false;
    return this._value === other._value;
  }

  /**
   * Comparaison insensible à la casse
   */
  equalsIgnoreCase(other) {
    if (!(other instanceof Libelle)) return false;
    return this._value.toLowerCase() === other._value.toLowerCase();
  }
}

module.exports = { Libelle };