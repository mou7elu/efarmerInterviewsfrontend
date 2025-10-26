/**
 * User DTOs
 * Objets de transfert de données pour les utilisateurs
 */

export class UserDTO {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.nomUt = data.nomUt;
    this.prenomUt = data.prenomUt;
    this.telephone = data.telephone;
    this.genre = data.genre;
    this.profileId = data.profileId;
    this.isGodMode = data.isGodMode;
    this.sommeil = data.sommeil;
    this.responsableId = data.responsableId;
    this.photo = data.photo;
    this.fullName = data.fullName;
    this.initials = data.initials;
    this.isActive = data.isActive;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static fromEntity(userEntity) {
    return new UserDTO(userEntity.toPlainObject());
  }

  static fromApiResponse(apiData) {
    return new UserDTO({
      id: apiData.id || apiData._id,
      email: apiData.email,
      nomUt: apiData.nomUt,
      prenomUt: apiData.prenomUt,
      telephone: apiData.telephone,
      genre: apiData.genre,
      profileId: apiData.profileId,
      isGodMode: apiData.isGodMode,
      sommeil: apiData.sommeil,
      responsableId: apiData.responsableId,
      photo: apiData.photo,
      fullName: apiData.fullName || `${apiData.prenomUt} ${apiData.nomUt}`.trim(),
      initials: apiData.initials || `${apiData.prenomUt?.[0] || ''}${apiData.nomUt?.[0] || ''}`.toUpperCase(),
      isActive: apiData.isActive || !apiData.sommeil,
      createdAt: apiData.createdAt,
      updatedAt: apiData.updatedAt
    });
  }
}

export class LoginDTO {
  constructor(email, password, rememberMe = false) {
    this.email = email;
    this.password = password;
    this.rememberMe = rememberMe;
  }

  static fromForm(formData) {
    return new LoginDTO(
      formData.email,
      formData.password,
      formData.rememberMe
    );
  }
}

export class UserCreateDTO {
  constructor(data) {
    this.email = data.email;
    this.password = data.password;
    this.nomUt = data.nomUt;
    this.prenomUt = data.prenomUt;
    this.telephone = data.telephone;
    this.genre = data.genre;
    this.profileId = data.profileId;
    this.isGodMode = data.isGodMode;
  }

  static fromForm(formData) {
    return new UserCreateDTO({
      email: formData.email,
      password: formData.password,
      nomUt: formData.nomUt,
      prenomUt: formData.prenomUt,
      telephone: formData.telephone,
      genre: formData.genre,
      profileId: formData.profileId,
      isGodMode: formData.isGodMode || false
    });
  }

  toApiPayload() {
    return {
      email: this.email,
      password: this.password,
      nomUt: this.nomUt,
      prenomUt: this.prenomUt,
      telephone: this.telephone,
      genre: this.genre,
      profileId: this.profileId,
      isGodMode: this.isGodMode
    };
  }
}

export class UserUpdateDTO {
  constructor(data) {
    this.nomUt = data.nomUt;
    this.prenomUt = data.prenomUt;
    this.telephone = data.telephone;
    this.genre = data.genre;
    this.profileId = data.profileId;
    this.photo = data.photo;
  }

  static fromForm(formData) {
    return new UserUpdateDTO({
      nomUt: formData.nomUt,
      prenomUt: formData.prenomUt,
      telephone: formData.telephone,
      genre: formData.genre,
      profileId: formData.profileId,
      photo: formData.photo
    });
  }

  toApiPayload() {
    const payload = {};
    
    if (this.nomUt !== undefined) payload.nomUt = this.nomUt;
    if (this.prenomUt !== undefined) payload.prenomUt = this.prenomUt;
    if (this.telephone !== undefined) payload.telephone = this.telephone;
    if (this.genre !== undefined) payload.genre = this.genre;
    if (this.profileId !== undefined) payload.profileId = this.profileId;
    if (this.photo !== undefined) payload.photo = this.photo;
    
    return payload;
  }
}

export class ChangePasswordDTO {
  constructor(currentPassword, newPassword, confirmPassword) {
    this.currentPassword = currentPassword;
    this.newPassword = newPassword;
    this.confirmPassword = confirmPassword;
  }

  static fromForm(formData) {
    return new ChangePasswordDTO(
      formData.currentPassword,
      formData.newPassword,
      formData.confirmPassword
    );
  }

  validate() {
    if (!this.currentPassword) {
      throw new Error('Le mot de passe actuel est requis');
    }

    if (!this.newPassword) {
      throw new Error('Le nouveau mot de passe est requis');
    }

    if (this.newPassword !== this.confirmPassword) {
      throw new Error('Les mots de passe ne correspondent pas');
    }

    if (this.newPassword.length < 6) {
      throw new Error('Le mot de passe doit contenir au moins 6 caractères');
    }

    return true;
  }

  toApiPayload() {
    return {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    };
  }
}