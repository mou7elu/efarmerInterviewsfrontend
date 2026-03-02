/**
 * Password Service - Domain Service
 * Gère la logique métier liée aux mots de passe
 */

const bcrypt = require('bcrypt');
const { ValidationError } = require('../../shared/errors/DomainErrors');

class PasswordService {
  constructor() {
    this.saltRounds = 10;
    this.minLength = 6;
    this.maxLength = 128;
  }

  /**
   * Valide un mot de passe selon les règles métier
   */
  validatePassword(password) {
    if (!password) {
      throw new ValidationError('Le mot de passe est obligatoire');
    }

    if (password.length < this.minLength) {
      throw new ValidationError(`Le mot de passe doit contenir au moins ${this.minLength} caractères`);
    }

    if (password.length > this.maxLength) {
      throw new ValidationError(`Le mot de passe ne peut pas dépasser ${this.maxLength} caractères`);
    }

    // Règles de complexité (optionnelles selon les besoins métier)
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasLowerCase || !hasNumbers) {
      throw new ValidationError('Le mot de passe doit contenir au moins une lettre minuscule et un chiffre');
    }

    return true;
  }

  /**
   * Hache un mot de passe
   */
  async hashPassword(password) {
    this.validatePassword(password);
    return await bcrypt.hash(password, this.saltRounds);
  }

  /**
   * Vérifie un mot de passe contre son hash
   */
  async verifyPassword(password, hashedPassword) {
    if (!password || !hashedPassword) {
      return false;
    }
    return await bcrypt.compare(password, hashedPassword);
  }

  /**
   * Génère un mot de passe temporaire
   */
  generateTemporaryPassword(length = 8) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    // Assurer qu'il y a au moins une lettre et un chiffre
    if (!/[a-zA-Z]/.test(password)) {
      password = 'A' + password.substring(1);
    }
    if (!/\d/.test(password)) {
      password = password.substring(0, length - 1) + '1';
    }
    
    return password;
  }

  /**
   * Vérifie si un mot de passe doit être changé (âge, etc.)
   */
  shouldChangePassword(lastChanged, maxAgeDays = 90) {
    if (!lastChanged) {
      return true; // Premier changement obligatoire
    }

    const now = new Date();
    const daysSinceChange = Math.floor((now - lastChanged) / (1000 * 60 * 60 * 24));
    
    return daysSinceChange > maxAgeDays;
  }
}

module.exports = PasswordService;