/**
 * User Entity - Domain Layer
 * Représente un utilisateur dans le domaine métier
 */

import { BaseEntity } from './BaseEntity.js';
import { ValidationError } from '@shared/errors/DomainErrors.js';

export class UserEntity extends BaseEntity {
  constructor({
    id,
    email,
    nomUt,
    prenomUt,
    telephone = '',
    genre = 0,
    profileId,
    isGodMode = false,
    sommeil = false,
    responsableId = null,
    photo = null,
    createdAt,
    updatedAt
  }) {
    super(id);
    
    this._email = email;
    this._nomUt = nomUt || '';
    this._prenomUt = prenomUt || '';
    this._telephone = telephone;
    this._genre = genre;
    this._profileId = profileId;
    this._isGodMode = isGodMode;
    this._sommeil = sommeil;
    this._responsableId = responsableId;
    this._photo = photo;
    
    if (createdAt) this._createdAt = new Date(createdAt);
    if (updatedAt) this._updatedAt = new Date(updatedAt);
    
    this.validate();
  }

  // Getters
  get email() { return this._email; }
  get nomUt() { return this._nomUt; }
  get prenomUt() { return this._prenomUt; }
  get telephone() { return this._telephone; }
  get genre() { return this._genre; }
  get profileId() { return this._profileId; }
  get isGodMode() { return this._isGodMode; }
  get sommeil() { return this._sommeil; }
  get responsableId() { return this._responsableId; }
  get photo() { return this._photo; }

  // Propriétés calculées
  get fullName() {
    return `${this._prenomUt} ${this._nomUt}`.trim();
  }

  get initials() {
    const prenomInitial = this._prenomUt ? this._prenomUt.charAt(0).toUpperCase() : '';
    const nomInitial = this._nomUt ? this._nomUt.charAt(0).toUpperCase() : '';
    return `${prenomInitial}${nomInitial}`;
  }

  get isActive() {
    return !this._sommeil;
  }

  // Méthodes métier
  updateProfile(nomUt, prenomUt, telephone = null) {
    if (!nomUt || nomUt.trim().length === 0) {
      throw new ValidationError('Le nom est requis');
    }
    if (!prenomUt || prenomUt.trim().length === 0) {
      throw new ValidationError('Le prénom est requis');
    }

    this._nomUt = nomUt.trim();
    this._prenomUt = prenomUt.trim();
    if (telephone !== null) {
      this._telephone = telephone.trim();
    }
    this.updateTimestamp();
  }

  updatePhoto(photoUrl) {
    this._photo = photoUrl;
    this.updateTimestamp();
  }

  activate() {
    this._sommeil = false;
    this.updateTimestamp();
  }

  deactivate() {
    this._sommeil = true;
    this.updateTimestamp();
  }

  assignProfile(profileId) {
    if (!profileId) {
      throw new ValidationError('L\'ID du profil est requis');
    }
    this._profileId = profileId;
    this.updateTimestamp();
  }

  // Validation
  validate() {
    super.validate();

    if (!this._email || this._email.trim().length === 0) {
      throw new ValidationError('L\'email est requis');
    }

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this._email)) {
      throw new ValidationError('Format d\'email invalide');
    }

    if (!this._nomUt || this._nomUt.trim().length === 0) {
      throw new ValidationError('Le nom est requis');
    }

    if (!this._prenomUt || this._prenomUt.trim().length === 0) {
      throw new ValidationError('Le prénom est requis');
    }
  }

  // Conversion vers objet simple
  toPlainObject() {
    return {
      ...super.toPlainObject(),
      email: this._email,
      nomUt: this._nomUt,
      prenomUt: this._prenomUt,
      telephone: this._telephone,
      genre: this._genre,
      profileId: this._profileId,
      isGodMode: this._isGodMode,
      sommeil: this._sommeil,
      responsableId: this._responsableId,
      photo: this._photo,
      fullName: this.fullName,
      initials: this.initials,
      isActive: this.isActive
    };
  }

  // Factory method pour créer à partir de données API
  static fromApiData(data) {
    return new UserEntity({
      id: data.id || data._id,
      email: data.email,
      nomUt: data.nomUt,
      prenomUt: data.prenomUt,
      telephone: data.telephone,
      genre: data.genre,
      profileId: data.profileId,
      isGodMode: data.isGodMode,
      sommeil: data.sommeil,
      responsableId: data.responsableId,
      photo: data.photo,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
  }
}