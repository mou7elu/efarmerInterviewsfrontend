const { BaseEntity } = require('./BaseEntity');
const { ValidationError } = require('../../shared/errors/ValidationError');

/**
 * Entité représentant un menu dans le système
 */
class MenuEntity extends BaseEntity {
  constructor(data) {
    super(data);
    this.text = data.text;
    this.icon = data.icon || null;
    this.path = data.path || null;
    this.subMenu = data.subMenu || [];
    this.order = data.order || 0;
    this._validate();
  }

  _validate() {
    super._validate();
    
    if (!this.text || typeof this.text !== 'string' || this.text.trim().length === 0) {
      throw new ValidationError('Le texte du menu est obligatoire');
    }

    if (this.text.length > 100) {
      throw new ValidationError('Le texte du menu ne peut pas dépasser 100 caractères');
    }

    if (this.icon && typeof this.icon !== 'string') {
      throw new ValidationError('L\'icône doit être une chaîne de caractères');
    }

    if (this.path && typeof this.path !== 'string') {
      throw new ValidationError('Le chemin doit être une chaîne de caractères');
    }

    if (!Array.isArray(this.subMenu)) {
      throw new ValidationError('Le sous-menu doit être un tableau');
    }

    if (typeof this.order !== 'number') {
      throw new ValidationError('L\'ordre doit être un nombre');
    }

    // Validation: un menu doit avoir soit un path soit un subMenu, pas les deux
    if (!this.path && this.subMenu.length === 0) {
      throw new ValidationError('Un menu doit avoir soit un chemin soit un sous-menu');
    }

    if (this.path && this.subMenu.length > 0) {
      throw new ValidationError('Un menu ne peut pas avoir à la fois un chemin et un sous-menu');
    }

    // Validation des sous-menus
    this.subMenu.forEach(subMenuItem => {
      this._validateSubMenuItem(subMenuItem);
    });
  }

  _validateSubMenuItem(subMenuItem) {
    if (!subMenuItem.text || typeof subMenuItem.text !== 'string' || subMenuItem.text.trim().length === 0) {
      throw new ValidationError('Le texte du sous-menu est obligatoire');
    }

    if (!subMenuItem.path || typeof subMenuItem.path !== 'string' || subMenuItem.path.trim().length === 0) {
      throw new ValidationError('Le chemin du sous-menu est obligatoire');
    }

    if (subMenuItem.text.length > 100) {
      throw new ValidationError('Le texte du sous-menu ne peut pas dépasser 100 caractères');
    }
  }

  /**
   * Met à jour le texte du menu
   */
  updateText(nouveauTexte) {
    if (!nouveauTexte || typeof nouveauTexte !== 'string' || nouveauTexte.trim().length === 0) {
      throw new ValidationError('Le nouveau texte du menu est obligatoire');
    }

    if (nouveauTexte.length > 100) {
      throw new ValidationError('Le texte du menu ne peut pas dépasser 100 caractères');
    }

    this.text = nouveauTexte.trim();
    this.updatedAt = new Date();
  }

  /**
   * Met à jour l'icône du menu
   */
  updateIcon(nouvelleIcone) {
    if (nouvelleIcone && typeof nouvelleIcone !== 'string') {
      throw new ValidationError('L\'icône doit être une chaîne de caractères');
    }

    this.icon = nouvelleIcone;
    this.updatedAt = new Date();
  }

  /**
   * Met à jour le chemin du menu
   */
  updatePath(nouveauChemin) {
    if (nouveauChemin && typeof nouveauChemin !== 'string') {
      throw new ValidationError('Le chemin doit être une chaîne de caractères');
    }

    // Si on définit un chemin, on doit vider le sous-menu
    if (nouveauChemin && this.subMenu.length > 0) {
      throw new ValidationError('Un menu ne peut pas avoir à la fois un chemin et un sous-menu');
    }

    this.path = nouveauChemin;
    this.updatedAt = new Date();
  }

  /**
   * Met à jour l'ordre du menu
   */
  updateOrder(nouvelOrdre) {
    if (typeof nouvelOrdre !== 'number') {
      throw new ValidationError('L\'ordre doit être un nombre');
    }

    this.order = nouvelOrdre;
    this.updatedAt = new Date();
  }

  /**
   * Ajoute un sous-menu
   */
  addSubMenuItem(text, path) {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      throw new ValidationError('Le texte du sous-menu est obligatoire');
    }

    if (!path || typeof path !== 'string' || path.trim().length === 0) {
      throw new ValidationError('Le chemin du sous-menu est obligatoire');
    }

    // Si on ajoute un sous-menu, on doit vider le chemin principal
    if (this.path) {
      throw new ValidationError('Un menu ne peut pas avoir à la fois un chemin et un sous-menu');
    }

    const newSubMenuItem = {
      text: text.trim(),
      path: path.trim()
    };

    this._validateSubMenuItem(newSubMenuItem);
    this.subMenu.push(newSubMenuItem);
    this.updatedAt = new Date();
  }

  /**
   * Supprime un sous-menu par son texte
   */
  removeSubMenuItem(text) {
    const index = this.subMenu.findIndex(item => item.text === text);
    
    if (index === -1) {
      throw new ValidationError('Sous-menu non trouvé');
    }

    this.subMenu.splice(index, 1);
    this.updatedAt = new Date();
  }

  /**
   * Vérifie si c'est un menu parent (avec sous-menus)
   */
  isParentMenu() {
    return this.subMenu.length > 0;
  }

  /**
   * Vérifie si c'est un menu feuille (avec chemin direct)
   */
  isLeafMenu() {
    return this.path !== null && this.subMenu.length === 0;
  }

  /**
   * Convertit l'entité en objet pour la persistance
   */
  toPersistence() {
    return {
      _id: this.id,
      text: this.text,
      icon: this.icon,
      path: this.path,
      subMenu: this.subMenu,
      order: this.order,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Crée une entité à partir des données de persistance
   */
  static fromPersistence(data) {
    return new MenuEntity({
      id: data._id?.toString() || data.id,
      text: data.text,
      icon: data.icon,
      path: data.path,
      subMenu: data.subMenu || [],
      order: data.order || 0,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
  }
}

module.exports = { MenuEntity };