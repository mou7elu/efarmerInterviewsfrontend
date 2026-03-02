/**
 * Profile Entity
 * Domain entity representing a user profile with permissions
 */
class Profile {
  constructor({ id, name, permissions, createdAt, updatedAt }) {
    this.id = id;
    this.name = name;
    this.permissions = permissions || [];
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Validates if the entity is valid
   * @returns {Object} validation result with isValid and errors
   */
  validate() {
    const errors = [];

    if (!this.name || this.name.trim() === '') {
      errors.push('Le nom du profil est requis');
    }

    // Validate permissions structure
    if (this.permissions && Array.isArray(this.permissions)) {
      this.permissions.forEach((perm, index) => {
        if (!perm.menuId) {
          errors.push(`Permission ${index}: menuId est requis`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Checks if profile has permission for a specific menu and action
   * @param {string} menuId - The menu ID
   * @param {string} action - The action (canAdd, canEdit, canDelete, canView)
   * @returns {boolean}
   */
  hasPermission(menuId, action) {
    const permission = this.permissions.find(p => p.menuId.toString() === menuId.toString());
    if (!permission) return false;
    return permission[action] === true;
  }

  /**
   * Converts entity to plain object for data transfer
   * @returns {Object} DTO
   */
  toDTO() {
    return {
      id: this.id,
      name: this.name,
      permissions: this.permissions,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Profile;
