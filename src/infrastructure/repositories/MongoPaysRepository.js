const { IPaysRepository } = require('../../domain/repositories/IPaysRepository');
const { PaysEntity } = require('../../domain/entities/PaysEntity');
const { NotFoundError } = require('../../shared/errors/NotFoundError');
const { DuplicateError } = require('../../shared/errors/DuplicateError');

/**
 * Implémentation MongoDB du repository Pays
 */
class MongoPaysRepository extends IPaysRepository {
  constructor() {
    super();
    this.paysModel = require('../../../models/Pays');
  }

  async create(entity) {
    try {
      // Vérifier l'unicité du libellé
      const existing = await this.findByLibelle(entity.libPays);
      if (existing) {
        throw new DuplicateError('Un pays avec ce libellé existe déjà');
      }

      const doc = await this.paysModel.create(entity.toPersistence());
      return PaysEntity.fromPersistence(doc.toObject());
    } catch (error) {
      if (error.code === 11000) {
        throw new DuplicateError('Un pays avec ce libellé existe déjà');
      }
      throw error;
    }
  }

  async findById(id) {
    const doc = await this.paysModel.findById(id);
    return doc ? PaysEntity.fromPersistence(doc.toObject()) : null;
  }

  async findAll() {
    const docs = await this.paysModel.find().sort({ Lib_pays: 1 });
    return docs.map(doc => PaysEntity.fromPersistence(doc.toObject()));
  }

  async update(id, entity) {
    // Vérifier l'unicité du libellé (exclure l'ID actuel)
    const existing = await this.paysModel.findOne({
      Lib_pays: entity.libPays,
      _id: { $ne: id }
    });

    if (existing) {
      throw new DuplicateError('Un pays avec ce libellé existe déjà');
    }

    const doc = await this.paysModel.findByIdAndUpdate(
      id,
      entity.toPersistence(),
      { new: true, runValidators: true }
    );

    if (!doc) {
      throw new NotFoundError('Pays non trouvé');
    }

    return PaysEntity.fromPersistence(doc.toObject());
  }

  async delete(id) {
    const doc = await this.paysModel.findByIdAndDelete(id);
    if (!doc) {
      throw new NotFoundError('Pays non trouvé');
    }
    return true;
  }

  async findByLibelle(libPays) {
    const doc = await this.paysModel.findOne({ Lib_pays: libPays });
    return doc ? PaysEntity.fromPersistence(doc.toObject()) : null;
  }

  async findByStatut(sommeil) {
    const docs = await this.paysModel.find({ Sommeil: sommeil }).sort({ Lib_pays: 1 });
    return docs.map(doc => PaysEntity.fromPersistence(doc.toObject()));
  }

  async findActifs() {
    return this.findByStatut(false);
  }

  async updateStatut(id, sommeil) {
    const doc = await this.paysModel.findByIdAndUpdate(
      id,
      { Sommeil: sommeil, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!doc) {
      throw new NotFoundError('Pays non trouvé');
    }

    return PaysEntity.fromPersistence(doc.toObject());
  }

  async findByCoordinates(bounds) {
    // Pour une implémentation future avec recherche géospatiale
    const docs = await this.paysModel.find({
      Coordonnee: { $exists: true, $ne: null }
    }).sort({ Lib_pays: 1 });
    
    return docs.map(doc => PaysEntity.fromPersistence(doc.toObject()));
  }

  async count() {
    return this.paysModel.countDocuments();
  }

  async exists(id) {
    const count = await this.paysModel.countDocuments({ _id: id });
    return count > 0;
  }

  /**
   * Recherche par nom partiel
   */
  async searchByName(searchTerm) {
    const docs = await this.paysModel.find({
      Lib_pays: { $regex: searchTerm, $options: 'i' }
    }).sort({ Lib_pays: 1 });
    
    return docs.map(doc => PaysEntity.fromPersistence(doc.toObject()));
  }

  /**
   * Obtient des pays avec pagination
   */
  async findPaginated(page = 1, limit = 10, actifSeulement = false) {
    const skip = (page - 1) * limit;
    const filter = actifSeulement ? { Sommeil: false } : {};

    const [docs, total] = await Promise.all([
      this.paysModel.find(filter)
        .sort({ Lib_pays: 1 })
        .skip(skip)
        .limit(limit),
      this.paysModel.countDocuments(filter)
    ]);

    return {
      items: docs.map(doc => PaysEntity.fromPersistence(doc.toObject())),
      total,
      page,
      pages: Math.ceil(total / limit)
    };
  }
}

module.exports = { MongoPaysRepository };