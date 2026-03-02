/**
 * User Entity
 * Domain entity representing a system user
 */
class User {
  constructor({
    id, email, code_ut, password, profileId, isGodMode, Nom_ut, Pren_ut, Sommeil,
    Photo, Tel, Genre, ResponsableId, createdAt, updatedAt
  }) {
    this.id = id;
    this.email = email;
    this.code_ut = code_ut;
    this.password = password;
    this.profileId = profileId;
    this.isGodMode = isGodMode || false;
    this.Nom_ut = Nom_ut || '';
    this.Pren_ut = Pren_ut || '';
    this.Sommeil = Sommeil || false;
    this.Photo = Photo || null;
    this.Tel = Tel || '';
    this.Genre = Genre || 0;
    this.ResponsableId = ResponsableId || null;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Validates if the entity is valid
   * @returns {Object} validation result with isValid and errors
   */
  validate() {
    const errors = [];

    if (!this.email || this.email.trim() === '') {
      errors.push('L\'email est requis');
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.email && !emailRegex.test(this.email)) {
      errors.push('Format d\'email invalide');
    }

    if (!this.password || this.password.trim() === '') {
      errors.push('Le mot de passe est requis');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Checks if user is active
   * @returns {boolean}
   */
  isActive() {
    return !this.Sommeil;
  }

  /**
   * Checks if user has God mode privileges
   * @returns {boolean}
   */
  hasGodMode() {
    return this.isGodMode === true;
  }

  /**
   * Converts entity to plain object for data transfer (without password)
   * @returns {Object} DTO
   */
  toDTO() {
    return {
      id: this.id,
      email: this.email,
      code_ut: this.code_ut,
      Nom_ut: this.Nom_ut,
      Pren_ut: this.Pren_ut,
      Tel: this.Tel,
      Genre: this.Genre,
      profileId: this.profileId,
      isGodMode: this.isGodMode,
      Sommeil: this.Sommeil,
      ResponsableId: this.ResponsableId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = User;
