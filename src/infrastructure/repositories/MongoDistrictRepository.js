const { IDistrictRepository } = require('../../domain/repositories/IDistrictRepository');
const { DistrictEntity } = require('../../domain/entities/DistrictEntity');
const { NotFoundError } = require('../../shared/errors/NotFoundError');
const { DuplicateError } = require('../../shared/errors/DuplicateError');

/**
 * Implémentation MongoDB du repository District
 */
class MongoDistrictRepository extends IDistrictRepository {
  constructor() {
    super();
    this.districtModel = require('../../../models/district');
  }

  async create(entity) {
    try {
      // Vérifier l'unicité du libellé
      const existing = await this.findByLibelle(entity.libDistrict);
      if (existing) {
        throw new DuplicateError('Un district avec ce libellé existe déjà');
      }

      const doc = await this.districtModel.create(entity.toPersistence());
      return DistrictEntity.fromPersistence(doc.toObject());
    } catch (error) {
      if (error.code === 11000) {
        throw new DuplicateError('Un district avec ce libellé existe déjà');
      }
      throw error;
    }
  }

  async findById(id) {
    const doc = await this.districtModel.findById(id);
    return doc ? DistrictEntity.fromPersistence(doc.toObject()) : null;
  }

  async findAll() {
    const docs = await this.districtModel.find().sort({ Lib_district: 1 });
    return docs.map(doc => DistrictEntity.fromPersistence(doc.toObject()));
  }

  async update(id, entity) {
    // Vérifier l'unicité du libellé (exclure l'ID actuel)
    const existing = await this.districtModel.findOne({
      Lib_district: entity.libDistrict,
      _id: { $ne: id }
    });

    if (existing) {
      throw new DuplicateError('Un district avec ce libellé existe déjà');
    }

    const doc = await this.districtModel.findByIdAndUpdate(
      id,
      entity.toPersistence(),
      { new: true, runValidators: true }
    );

    if (!doc) {
      throw new NotFoundError('District non trouvé');
    }

    return DistrictEntity.fromPersistence(doc.toObject());
  }

  async delete(id) {
    const doc = await this.districtModel.findByIdAndDelete(id);
    if (!doc) {
      throw new NotFoundError('District non trouvé');
    }
    return true;
  }

  async findByLibelle(libDistrict) {
    const doc = await this.districtModel.findOne({ Lib_district: libDistrict });
    return doc ? DistrictEntity.fromPersistence(doc.toObject()) : null;
  }

  async findByPaysId(paysId) {
    const docs = await this.districtModel.find({ PaysId: paysId }).sort({ Lib_district: 1 });
    return docs.map(doc => DistrictEntity.fromPersistence(doc.toObject()));
  }

  async findByStatut(sommeil) {
    const docs = await this.districtModel.find({ Sommeil: sommeil }).sort({ Lib_district: 1 });
    return docs.map(doc => DistrictEntity.fromPersistence(doc.toObject()));
  }

  async findActifsByPays(paysId) {
    const docs = await this.districtModel.find({ 
      PaysId: paysId, 
      Sommeil: false 
    }).sort({ Lib_district: 1 });
    return docs.map(doc => DistrictEntity.fromPersistence(doc.toObject()));
  }

  async updateStatut(id, sommeil) {
    const doc = await this.districtModel.findByIdAndUpdate(
      id,
      { Sommeil: sommeil, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!doc) {
      throw new NotFoundError('District non trouvé');
    }

    return DistrictEntity.fromPersistence(doc.toObject());
  }

  async countByPaysId(paysId) {
    return this.districtModel.countDocuments({ PaysId: paysId });
  }

  async count() {
    return this.districtModel.countDocuments();
  }

  async exists(id) {
    const count = await this.districtModel.countDocuments({ _id: id });
    return count > 0;
  }

  /**
   * Recherche par nom partiel
   */
  async searchByName(searchTerm) {
    const docs = await this.districtModel.find({
      Lib_district: { $regex: searchTerm, $options: 'i' }
    }).sort({ Lib_district: 1 });
    
    return docs.map(doc => DistrictEntity.fromPersistence(doc.toObject()));
  }

  /**
   * Obtient des districts avec pagination
   */
  async findPaginated(page = 1, limit = 10, paysId = null, actifSeulement = false) {
    const skip = (page - 1) * limit;
    const filter = {};
    
    if (paysId) {
      filter.PaysId = paysId;
    }
    
    if (actifSeulement) {
      filter.Sommeil = false;
    }

    const [docs, total] = await Promise.all([
      this.districtModel.find(filter)
        .sort({ Lib_district: 1 })
        .skip(skip)
        .limit(limit)
        .populate('PaysId', 'Lib_pays'),
      this.districtModel.countDocuments(filter)
    ]);

    return {
      items: docs.map(doc => DistrictEntity.fromPersistence(doc.toObject())),
      total,
      page,
      pages: Math.ceil(total / limit)
    };
  }
}

module.exports = { MongoDistrictRepository };