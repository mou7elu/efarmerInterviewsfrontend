const { BaseEntity } = require('./BaseEntity');
const { ValidationError } = require('../../shared/errors/ValidationError');

/**
 * Entité représentant un profil utilisateur dans le système
 */
class ProfileEntity extends BaseEntity {
  constructor(data) {
    super(data);
    this.name = data.name;
    this.permissions = data.permissions || [];
    this._validate();
  }

  _validate() {
    super._validate();
    
    if (!this.name || typeof this.name !== 'string' || this.name.trim().length === 0) {
      throw new ValidationError('Le nom du profil est obligatoire');
    }

    if (this.name.length > 50) {
      throw new ValidationError('Le nom du profil ne peut pas dépasser 50 caractères');
    }

    if (!Array.isArray(this.permissions)) {
      throw new ValidationError('Les permissions doivent être un tableau');
    }

    // Validation des permissions
    this.permissions.forEach(permission => {
      this._validatePermission(permission);
    });
  }

  _validatePermission(permission) {
    if (!permission.menuId) {
      throw new ValidationError('L\'identifiant du menu est obligatoire pour une permission');
    }

    const requiredBooleanFields = ['canAdd', 'canEdit', 'canDelete', 'canView'];
    requiredBooleanFields.forEach(field => {
      if (typeof permission[field] !== 'boolean') {
        throw new ValidationError(`${field} doit être un booléen`);
      }
    });
  }

  /**
   * Met à jour le nom du profil
   */
  updateName(nouveauNom) {
    if (!nouveauNom || typeof nouveauNom !== 'string' || nouveauNom.trim().length === 0) {
      throw new ValidationError('Le nouveau nom du profil est obligatoire');
    }

    if (nouveauNom.length > 50) {
      throw new ValidationError('Le nom du profil ne peut pas dépasser 50 caractères');
    }

    this.name = nouveauNom.trim();
    this.updatedAt = new Date();
  }

  /**
   * Ajoute une permission pour un menu
   */
  addPermission(menuId, canAdd = false, canEdit = false, canDelete = false, canView = false) {
    if (!menuId) {
      throw new ValidationError('L\'identifiant du menu est obligatoire');
    }

    // Vérifier si la permission existe déjà
    const existingIndex = this.permissions.findIndex(p => p.menuId.toString() === menuId.toString());
    
    if (existingIndex >= 0) {
      throw new ValidationError('Une permission existe déjà pour ce menu');
    }

    const newPermission = {
      menuId,
      canAdd,
      canEdit,
      canDelete,
      canView
    };

    this._validatePermission(newPermission);
    this.permissions.push(newPermission);
    this.updatedAt = new Date();
  }

  /**
   * Met à jour une permission existante
   */
  updatePermission(menuId, canAdd, canEdit, canDelete, canView) {
    const existingIndex = this.permissions.findIndex(p => p.menuId.toString() === menuId.toString());
    
    if (existingIndex === -1) {
      throw new ValidationError('Aucune permission trouvée pour ce menu');
    }

    const updatedPermission = {
      menuId,
      canAdd,
      canEdit,
      canDelete,
      canView
    };

    this._validatePermission(updatedPermission);
    this.permissions[existingIndex] = updatedPermission;
    this.updatedAt = new Date();
  }

  /**
   * Supprime une permission pour un menu
   */
  removePermission(menuId) {
    const existingIndex = this.permissions.findIndex(p => p.menuId.toString() === menuId.toString());
    
    if (existingIndex === -1) {
      throw new ValidationError('Aucune permission trouvée pour ce menu');
    }

    this.permissions.splice(existingIndex, 1);
    this.updatedAt = new Date();
  }

  /**
   * Vérifie si le profil a une permission spécifique pour un menu
   */
  hasPermission(menuId, action) {
    const permission = this.permissions.find(p => p.menuId.toString() === menuId.toString());
    
    if (!permission) {
      return false;
    }

    switch (action.toLowerCase()) {
      case 'add':
        return permission.canAdd;
      case 'edit':
        return permission.canEdit;
      case 'delete':
        return permission.canDelete;
      case 'view':
        return permission.canView;
      default:
        return false;
    }
  }

  /**
   * Obtient toutes les permissions pour un menu donné
   */
  getPermissionsForMenu(menuId) {
    return this.permissions.find(p => p.menuId.toString() === menuId.toString()) || null;
  }

  /**
   * Vérifie si c'est un profil administrateur (toutes les permissions)
   */
  isAdmin() {
    return this.name.toLowerCase().includes('admin');
  }

  /**
   * Convertit l'entité en objet pour la persistance
   */
  toPersistence() {
    return {
      _id: this.id,
      name: this.name,
      permissions: this.permissions,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Crée une entité à partir des données de persistance
   */
  static fromPersistence(data) {
    return new ProfileEntity({
      id: data._id?.toString() || data.id,
      name: data.name,
      permissions: data.permissions || [],
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
  }
}

module.exports = { ProfileEntity };