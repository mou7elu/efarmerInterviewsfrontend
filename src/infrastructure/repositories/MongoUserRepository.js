/**
 * MongoDB User Repository Implementation
 * Implémente l'interface IUserRepository avec MongoDB/Mongoose
 */

const mongoose = require('mongoose');
const IUserRepository = require('../../domain/repositories/IUserRepository');
const UserEntity = require('../../domain/entities/UserEntity');
const { NotFoundError, DuplicateError } = require('../../shared/errors/DomainErrors');

class MongoUserRepository extends IUserRepository {
  constructor(userModel) {
    super();
    this.userModel = userModel;
  }

  async findById(id) {
    try {
      const userDoc = await this.userModel.findById(id).populate('profileId');
      return userDoc ? this._toEntity(userDoc) : null;
    } catch (error) {
      throw new Error(`Erreur lors de la recherche par ID: ${error.message}`);
    }
  }

  async findByEmail(email) {
    try {
      const userDoc = await this.userModel.findOne({ email }).populate('profileId');
      return userDoc ? this._toEntity(userDoc) : null;
    } catch (error) {
      throw new Error(`Erreur lors de la recherche par email: ${error.message}`);
    }
  }

  async findByProfile(profileId) {
    try {
      const userDocs = await this.userModel.find({ profileId }).populate('profileId');
      return userDocs.map(doc => this._toEntity(doc));
    } catch (error) {
      throw new Error(`Erreur lors de la recherche par profil: ${error.message}`);
    }
  }

  async findActiveUsers() {
    try {
      const userDocs = await this.userModel.find({ sommeil: false }).populate('profileId');
      return userDocs.map(doc => this._toEntity(doc));
    } catch (error) {
      throw new Error(`Erreur lors de la recherche des utilisateurs actifs: ${error.message}`);
    }
  }

  async findByResponsable(responsableId) {
    try {
      const userDocs = await this.userModel.find({ ResponsableId: responsableId }).populate('profileId');
      return userDocs.map(doc => this._toEntity(doc));
    } catch (error) {
      throw new Error(`Erreur lors de la recherche par responsable: ${error.message}`);
    }
  }

  async findAll(criteria = {}, options = {}) {
    try {
      let query = this.userModel.find(criteria).populate('profileId');
      
      // Appliquer les options de pagination et tri
      if (options.skip) query = query.skip(options.skip);
      if (options.limit) query = query.limit(options.limit);
      if (options.sort) query = query.sort(options.sort);
      
      const userDocs = await query;
      return userDocs.map(doc => this._toEntity(doc));
    } catch (error) {
      throw new Error(`Erreur lors de la recherche de tous les utilisateurs: ${error.message}`);
    }
  }

  async create(userEntity) {
    try {
      // Vérifier l'unicité de l'email
      const existingUser = await this.findByEmail(userEntity.email);
      if (existingUser) {
        throw new DuplicateError('Utilisateur', 'email', userEntity.email);
      }

      const userDoc = new this.userModel({
        email: userEntity.email,
        password: userEntity.password,
        Nom_ut: userEntity.nomUt,
        Pren_ut: userEntity.prenomUt,
        Tel: userEntity.telephone,
        Genre: userEntity.genre,
        profileId: userEntity.profileId,
        isGodMode: userEntity.isGodMode,
        Sommeil: userEntity.sommeil,
        ResponsableId: userEntity.responsableId,
        Photo: userEntity.photo
      });

      const savedDoc = await userDoc.save();
      return this._toEntity(savedDoc);
    } catch (error) {
      if (error.code === 11000) { // Duplicate key error
        throw new DuplicateError('Utilisateur', 'email', userEntity.email);
      }
      throw new Error(`Erreur lors de la création: ${error.message}`);
    }
  }

  async update(id, updateData) {
    try {
      const mongoUpdateData = {};

      // Ajouter uniquement les champs définis
      if (updateData.email !== undefined) mongoUpdateData.email = updateData.email;
      if (updateData.nomUt !== undefined) mongoUpdateData.Nom_ut = updateData.nomUt;
      if (updateData.prenomUt !== undefined) mongoUpdateData.Pren_ut = updateData.prenomUt;
      if (updateData.telephone !== undefined) {
        console.log('MongoUserRepository - updateData.telephone:', updateData.telephone);
        mongoUpdateData.Tel = updateData.telephone;
      }
      if (updateData.genre !== undefined) mongoUpdateData.Genre = updateData.genre;
      
      // Gérer profileId - s'assurer que c'est un ObjectId valide ou null
      if (updateData.profileId !== undefined) {
        if (updateData.profileId === null || updateData.profileId === '') {
          mongoUpdateData.profileId = null;
        } else if (mongoose.Types.ObjectId.isValid(updateData.profileId)) {
          mongoUpdateData.profileId = updateData.profileId;
        }
        // Sinon, ne pas mettre à jour profileId si invalide
      }
      
      if (updateData.isGodMode !== undefined) mongoUpdateData.isGodMode = updateData.isGodMode;
      if (updateData.sommeil !== undefined) mongoUpdateData.Sommeil = updateData.sommeil;
      
      // Gérer responsableId - s'assurer que c'est un ObjectId valide ou null
      if (updateData.responsableId !== undefined) {
        if (updateData.responsableId === null || updateData.responsableId === '') {
          mongoUpdateData.ResponsableId = null;
        } else if (mongoose.Types.ObjectId.isValid(updateData.responsableId)) {
          mongoUpdateData.ResponsableId = updateData.responsableId;
        }
        // Sinon, ne pas mettre à jour ResponsableId si invalide
      }
      
      if (updateData.photo !== undefined) mongoUpdateData.Photo = updateData.photo;

      console.log('MongoUserRepository - mongoUpdateData:', mongoUpdateData);

      const updatedDoc = await this.userModel.findByIdAndUpdate(
        id, 
        mongoUpdateData, 
        { new: true, runValidators: true }
      ).populate('profileId');

      if (!updatedDoc) {
        throw new NotFoundError('Utilisateur', id);
      }

      return this._toEntity(updatedDoc);
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
    }
  }

  async updatePassword(userId, hashedPassword) {
    try {
      const updatedDoc = await this.userModel.findByIdAndUpdate(
        userId,
        { password: hashedPassword },
        { new: true }
      );

      if (!updatedDoc) {
        throw new NotFoundError('Utilisateur', userId);
      }

      return this._toEntity(updatedDoc);
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour du mot de passe: ${error.message}`);
    }
  }

  async activateUser(userId) {
    try {
      const updatedDoc = await this.userModel.findByIdAndUpdate(
        userId,
        { Sommeil: false },
        { new: true }
      ).populate('profileId');

      if (!updatedDoc) {
        throw new NotFoundError('Utilisateur', userId);
      }

      return this._toEntity(updatedDoc);
    } catch (error) {
      throw new Error(`Erreur lors de l'activation: ${error.message}`);
    }
  }

  async deactivateUser(userId) {
    try {
      const updatedDoc = await this.userModel.findByIdAndUpdate(
        userId,
        { Sommeil: true },
        { new: true }
      ).populate('profileId');

      if (!updatedDoc) {
        throw new NotFoundError('Utilisateur', userId);
      }

      return this._toEntity(updatedDoc);
    } catch (error) {
      throw new Error(`Erreur lors de la désactivation: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const deletedDoc = await this.userModel.findByIdAndDelete(id);
      if (!deletedDoc) {
        throw new NotFoundError('Utilisateur', id);
      }
      return true;
    } catch (error) {
      throw new Error(`Erreur lors de la suppression: ${error.message}`);
    }
  }

  async exists(id) {
    try {
      const doc = await this.userModel.findById(id).select('_id');
      return !!doc;
    } catch (error) {
      return false;
    }
  }

  async emailExists(email, excludeUserId = null) {
    try {
      const query = { email };
      if (excludeUserId) {
        query._id = { $ne: excludeUserId };
      }
      const doc = await this.userModel.findOne(query).select('_id');
      return !!doc;
    } catch (error) {
      return false;
    }
  }

  async count(criteria = {}) {
    try {
      return await this.userModel.countDocuments(criteria);
    } catch (error) {
      throw new Error(`Erreur lors du comptage: ${error.message}`);
    }
  }

  /**
   * Convertit un document Mongoose en entité utilisateur
   */
  _toEntity(userDoc) {
    return new UserEntity({
      id: userDoc._id.toString(),
      email: userDoc.email,
      password: userDoc.password,
      nomUt: userDoc.Nom_ut,
      prenomUt: userDoc.Pren_ut,
      telephone: userDoc.Tel,
      genre: userDoc.Genre,
      profileId: userDoc.profileId,
      isGodMode: userDoc.isGodMode,
      sommeil: userDoc.Sommeil,
      responsableId: userDoc.ResponsableId,
      photo: userDoc.Photo,
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt
    });
  }
}

module.exports = MongoUserRepository;