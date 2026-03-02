const { IProducteurRepository } = require('../../domain/repositories/IProducteurRepository');
const { ProducteurEntity } = require('../../domain/entities/ProducteurEntity');
const { NotFoundError } = require('../../shared/errors/NotFoundError');
const { DuplicateError } = require('../../shared/errors/DuplicateError');
const mongoose = require('mongoose');

/**
 * Implémentation MongoDB du repository Producteur
 */
class MongoProducteurRepository extends IProducteurRepository {
  constructor() {
    super();
    this.producteurModel = require('../../../models/Producteur');
  }

  /**
   * Vérifie si une chaîne est un ObjectId MongoDB valide
   */
  isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id) && /^[0-9a-fA-F]{24}$/.test(id);
  }

  async create(entity) {
    try {
      // Vérifier l'unicité du code
      const existing = await this.findByCode(entity.code);
      if (existing) {
        throw new DuplicateError('Un producteur avec ce code existe déjà');
      }

      const doc = await this.producteurModel.create(entity.toPersistence());
      return ProducteurEntity.fromPersistence(doc.toObject());
    } catch (error) {
      if (error.code === 11000) {
        throw new DuplicateError('Un producteur avec ce code existe déjà');
      }
      throw error;
    }
  }

  async findById(id) {
    // Si l'ID n'est pas un ObjectId valide, essayer de chercher par code
    if (!this.isValidObjectId(id)) {
      console.log(`⚠️ ID "${id}" n'est pas un ObjectId valide, recherche par code...`);
      return await this.findByCode(id);
    }
    
    const doc = await this.producteurModel.findById(id);
    return doc ? ProducteurEntity.fromPersistence(doc.toObject()) : null;
  }

  async findAll() {
    const docs = await this.producteurModel.find().sort({ Code: 1 });
    return docs.map(doc => ProducteurEntity.fromPersistence(doc.toObject()));
  }

  async update(id, entity) {
    // Si l'ID n'est pas un ObjectId valide, retourner une erreur claire
    if (!this.isValidObjectId(id)) {
      throw new NotFoundError(`ID invalide: "${id}" n'est pas un ObjectId MongoDB valide. Utilisez un ObjectId de 24 caractères hexadécimaux.`);
    }
    
    // Vérifier l'unicité du code (exclure l'ID actuel)
    const existing = await this.producteurModel.findOne({
      Code: entity.code,
      _id: { $ne: id }
    });

    if (existing) {
      throw new DuplicateError('Un producteur avec ce code existe déjà');
    }

    const doc = await this.producteurModel.findByIdAndUpdate(
      id,
      entity.toPersistence(),
      { new: true, runValidators: true }
    );

    if (!doc) {
      throw new NotFoundError('Producteur non trouvé');
    }

    return ProducteurEntity.fromPersistence(doc.toObject());
  }

  async delete(id) {
    const doc = await this.producteurModel.findByIdAndDelete(id);
    if (!doc) {
      throw new NotFoundError('Producteur non trouvé');
    }
    return true;
  }

  async findByCode(code) {
    const doc = await this.producteurModel.findOne({ Code: code });
    return doc ? ProducteurEntity.fromPersistence(doc.toObject()) : null;
  }

  async findByStatut(sommeil) {
    const docs = await this.producteurModel.find({ sommeil: sommeil }).sort({ Code: 1 });
    return docs.map(doc => ProducteurEntity.fromPersistence(doc.toObject()));
  }

  async findByGenre(genre) {
    const docs = await this.producteurModel.find({ Genre: genre }).sort({ Nom: 1, Prenom: 1 });
    return docs.map(doc => ProducteurEntity.fromPersistence(doc.toObject()));
  }

  async searchByName(searchTerm) {
    const docs = await this.producteurModel.find({
      $or: [
        { Nom: { $regex: searchTerm, $options: 'i' } },
        { Prenom: { $regex: searchTerm, $options: 'i' } }
      ]
    }).sort({ Nom: 1, Prenom: 1 });
    
    return docs.map(doc => ProducteurEntity.fromPersistence(doc.toObject()));
  }

  async findPaginated(page = 1, limit = 10, actifSeulement = false) {
    const skip = (page - 1) * limit;
    const filter = {};
    
    if (actifSeulement) {
      filter.sommeil = false;
    }

    const [docs, total] = await Promise.all([
      this.producteurModel.find(filter)
        .sort({ Nom: 1, Prenom: 1 })
        .skip(skip)
        .limit(limit),
      this.producteurModel.countDocuments(filter)
    ]);

    return {
      items: docs.map(doc => ProducteurEntity.fromPersistence(doc.toObject())),
      total,
      page,
      pages: Math.ceil(total / limit)
    };
  }

  async count() {
    return this.producteurModel.countDocuments();
  }

  async exists(id) {
    const count = await this.producteurModel.countDocuments({ _id: id });
    return count > 0;
  }

  async findByTelephone(telephone) {
    const docs = await this.producteurModel.find({
      $or: [
        { Telephone1: telephone },
        { Telephone2: telephone }
      ]
    }).sort({ Nom: 1, Prenom: 1 });
    
    return docs.map(doc => ProducteurEntity.fromPersistence(doc.toObject()));
  }

  async updateStatut(id, sommeil) {
    const doc = await this.producteurModel.findByIdAndUpdate(
      id,
      { sommeil: sommeil, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!doc) {
      throw new NotFoundError('Producteur non trouvé');
    }

    return ProducteurEntity.fromPersistence(doc.toObject());
  }

  /**
   * Recherche avancée des producteurs
   */
  async searchProducteurs(criteria) {
    const filter = {};
    
    if (criteria.nom) {
      filter.Nom = { $regex: criteria.nom, $options: 'i' };
    }
    
    if (criteria.prenom) {
      filter.Prenom = { $regex: criteria.prenom, $options: 'i' };
    }
    
    if (criteria.genre) {
      filter.Genre = criteria.genre;
    }
    
    if (criteria.actifSeulement) {
      filter.sommeil = false;
    }
    
    if (criteria.telephone) {
      filter.$or = [
        { Telephone1: { $regex: criteria.telephone, $options: 'i' } },
        { Telephone2: { $regex: criteria.telephone, $options: 'i' } }
      ];
    }

    const docs = await this.producteurModel.find(filter).sort({ Nom: 1, Prenom: 1 });
    return docs.map(doc => ProducteurEntity.fromPersistence(doc.toObject()));
  }

  /**
   * Obtenir les statistiques des producteurs
   */
  async getStatistiques() {
    const [total, actifs, hommes, femmes] = await Promise.all([
      this.producteurModel.countDocuments(),
      this.producteurModel.countDocuments({ sommeil: false }),
      this.producteurModel.countDocuments({ Genre: 1 }),
      this.producteurModel.countDocuments({ Genre: 2 })
    ]);

    return {
      total,
      actifs,
      inactifs: total - actifs,
      hommes,
      femmes,
      nonDefini: total - hommes - femmes
    };
  }
}

module.exports = { MongoProducteurRepository };