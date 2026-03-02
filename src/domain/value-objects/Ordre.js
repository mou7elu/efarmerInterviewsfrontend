const { ValidationError } = require('../../shared/errors/ValidationError');

/**
 * Value Object pour représenter un ordre/position dans une séquence
 */
class Ordre {
  constructor(value) {
    this._value = parseInt(value);
    this._validate();
    Object.freeze(this);
  }

  _validate() {
    if (isNaN(this._value)) {
      throw new ValidationError('L\'ordre doit être un nombre');
    }

    if (this._value < 1) {
      throw new ValidationError('L\'ordre doit être un nombre positif (≥ 1)');
    }

    if (this._value > 9999) {
      throw new ValidationError('L\'ordre ne peut pas dépasser 9999');
    }
  }

  get value() {
    return this._value;
  }

  /**
   * Incrémente l'ordre de 1
   */
  increment() {
    return new Ordre(this._value + 1);
  }

  /**
   * Décrémente l'ordre de 1 (minimum 1)
   */
  decrement() {
    const newValue = Math.max(1, this._value - 1);
    return new Ordre(newValue);
  }

  /**
   * Ajoute une valeur à l'ordre
   */
  add(amount) {
    if (typeof amount !== 'number' || amount < 0) {
      throw new ValidationError('La valeur à ajouter doit être un nombre positif');
    }
    return new Ordre(this._value + amount);
  }

  /**
   * Soustrait une valeur de l'ordre
   */
  subtract(amount) {
    if (typeof amount !== 'number' || amount < 0) {
      throw new ValidationError('La valeur à soustraire doit être un nombre positif');
    }
    const newValue = Math.max(1, this._value - amount);
    return new Ordre(newValue);
  }

  /**
   * Compare avec un autre ordre
   */
  isGreaterThan(other) {
    if (!(other instanceof Ordre)) {
      throw new ValidationError('Comparaison impossible avec un objet non-Ordre');
    }
    return this._value > other._value;
  }

  /**
   * Compare avec un autre ordre
   */
  isLessThan(other) {
    if (!(other instanceof Ordre)) {
      throw new ValidationError('Comparaison impossible avec un objet non-Ordre');
    }
    return this._value < other._value;
  }

  /**
   * Vérifie si c'est le premier ordre
   */
  isFirst() {
    return this._value === 1;
  }

  /**
   * Calcule la différence avec un autre ordre
   */
  difference(other) {
    if (!(other instanceof Ordre)) {
      throw new ValidationError('Comparaison impossible avec un objet non-Ordre');
    }
    return Math.abs(this._value - other._value);
  }

  toString() {
    return this._value.toString();
  }

  equals(other) {
    if (!(other instanceof Ordre)) return false;
    return this._value === other._value;
  }

  /**
   * Convertit en nombre pour les calculs
   */
  toNumber() {
    return this._value;
  }

  /**
   * Formate avec des zéros à gauche
   */
  toFormattedString(digits = 2) {
    return this._value.toString().padStart(digits, '0');
  }
}

module.exports = { Ordre };