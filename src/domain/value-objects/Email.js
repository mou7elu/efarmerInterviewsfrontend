/**
 * Email Value Object
 * Représente et valide une adresse email
 */

export class Email {
  constructor(value) {
    this._value = this._validate(value);
    Object.freeze(this); // Immutabilité
  }

  get value() {
    return this._value;
  }

  get domain() {
    return this._value.split('@')[1];
  }

  get localPart() {
    return this._value.split('@')[0];
  }

  _validate(email) {
    if (!email || typeof email !== 'string') {
      throw new Error('L\'email doit être une chaîne de caractères');
    }

    const trimmedEmail = email.trim().toLowerCase();
    
    if (trimmedEmail.length === 0) {
      throw new Error('L\'email ne peut pas être vide');
    }

    // Regex complète pour la validation d'email (RFC 5322 simplifié)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!emailRegex.test(trimmedEmail)) {
      throw new Error('Format d\'email invalide');
    }

    if (trimmedEmail.length > 254) {
      throw new Error('L\'email est trop long (maximum 254 caractères)');
    }

    return trimmedEmail;
  }

  equals(other) {
    return other instanceof Email && this._value === other._value;
  }

  toString() {
    return this._value;
  }

  toJSON() {
    return this._value;
  }
}