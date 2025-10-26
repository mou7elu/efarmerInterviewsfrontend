/**
 * Base Entity Class
 * Classe de base pour toutes les entités métier
 */

import { v4 as uuidv4 } from 'uuid';

export class BaseEntity {
  constructor(id = null) {
    this._id = id || uuidv4();
    this._createdAt = new Date();
    this._updatedAt = new Date();
  }

  get id() {
    return this._id;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  updateTimestamp() {
    this._updatedAt = new Date();
  }

  /**
   * Validation générique - à surcharger dans les entités dérivées
   */
  validate() {
    if (!this._id) {
      throw new Error('L\'ID est requis pour une entité');
    }
  }

  /**
   * Conversion vers un objet plain pour sérialisation
   */
  toPlainObject() {
    return {
      id: this._id,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }

  /**
   * Comparaison d'entités par ID
   */
  equals(other) {
    if (!other || !(other instanceof BaseEntity)) {
      return false;
    }
    return this._id === other._id;
  }

  /**
   * Clone de l'entité
   */
  clone() {
    const cloned = Object.create(Object.getPrototypeOf(this));
    Object.assign(cloned, this);
    return cloned;
  }
}