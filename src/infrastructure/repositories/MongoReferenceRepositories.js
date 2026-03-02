const { INationaliteRepository, INiveauScolaireRepository, IPieceRepository } = require('../../domain/repositories/IReferenceRepositories');
const { NationaliteEntity } = require('../../domain/entities/NationaliteEntity');
const { NiveauScolaireEntity } = require('../../domain/entities/NiveauScolaireEntity');
const { PieceEntity } = require('../../domain/entities/PieceEntity');
const { NotFoundError } = require('../../shared/errors/NotFoundError');
const { DuplicateError } = require('../../shared/errors/DuplicateError');

/**
 * Implémentation MongoDB du repository Nationalite
 */
class MongoNationaliteRepository extends INationaliteRepository {
  constructor() {
    super();
    this.nationaliteModel = require('../../../models/Nationalite');
  }

  async create(entity) {
    try {
      const existing = await this.findByLibelle(entity.libNation);
      if (existing) {
        throw new DuplicateError('Une nationalité avec ce libellé existe déjà');
      }

      const doc = await this.nationaliteModel.create(entity.toPersistence());
      return NationaliteEntity.fromPersistence(doc.toObject());
    } catch (error) {
      if (error.code === 11000) {
        throw new DuplicateError('Une nationalité avec ce libellé existe déjà');
      }
      throw error;
    }
  }

  async findById(id) {
    const doc = await this.nationaliteModel.findById(id);
    return doc ? NationaliteEntity.fromPersistence(doc.toObject()) : null;
  }

  async findAll() {
    const docs = await this.nationaliteModel.find().sort({ Lib_Nation: 1 });
    return docs.map(doc => NationaliteEntity.fromPersistence(doc.toObject()));
  }

  async update(id, entity) {
    const existing = await this.nationaliteModel.findOne({
      Lib_Nation: entity.libNation,
      _id: { $ne: id }
    });

    if (existing) {
      throw new DuplicateError('Une nationalité avec ce libellé existe déjà');
    }

    const doc = await this.nationaliteModel.findByIdAndUpdate(
      id,
      entity.toPersistence(),
      { new: true, runValidators: true }
    );

    if (!doc) {
      throw new NotFoundError('Nationalité non trouvée');
    }

    return NationaliteEntity.fromPersistence(doc.toObject());
  }

  async delete(id) {
    const doc = await this.nationaliteModel.findByIdAndDelete(id);
    if (!doc) {
      throw new NotFoundError('Nationalité non trouvée');
    }
    return true;
  }

  async findByLibelle(libelle) {
    const doc = await this.nationaliteModel.findOne({ Lib_Nation: libelle });
    return doc ? NationaliteEntity.fromPersistence(doc.toObject()) : null;
  }

  async searchByName(searchTerm) {
    const docs = await this.nationaliteModel.find({
      Lib_Nation: { $regex: searchTerm, $options: 'i' }
    }).sort({ Lib_Nation: 1 });
    
    return docs.map(doc => NationaliteEntity.fromPersistence(doc.toObject()));
  }

  async findAllSorted() {
    return this.findAll();
  }

  async existsByLibelle(libelle, excludeId = null) {
    const filter = { Lib_Nation: libelle };
    if (excludeId) {
      filter._id = { $ne: excludeId };
    }
    const count = await this.nationaliteModel.countDocuments(filter);
    return count > 0;
  }

  async findByPrefix(prefix) {
    const docs = await this.nationaliteModel.find({
      Lib_Nation: { $regex: `^${prefix}`, $options: 'i' }
    }).sort({ Lib_Nation: 1 });
    
    return docs.map(doc => NationaliteEntity.fromPersistence(doc.toObject()));
  }

  async count() {
    return this.nationaliteModel.countDocuments();
  }

  async exists(id) {
    const count = await this.nationaliteModel.countDocuments({ _id: id });
    return count > 0;
  }
}

/**
 * Implémentation MongoDB du repository NiveauScolaire
 */
class MongoNiveauScolaireRepository extends INiveauScolaireRepository {
  constructor() {
    super();
    this.niveauScolaireModel = require('../../../models/NiveauScolaire');
  }

  async create(entity) {
    try {
      const existing = await this.findByLibelle(entity.libNiveauScolaire);
      if (existing) {
        throw new DuplicateError('Un niveau scolaire avec ce libellé existe déjà');
      }

      const doc = await this.niveauScolaireModel.create(entity.toPersistence());
      return NiveauScolaireEntity.fromPersistence(doc.toObject());
    } catch (error) {
      if (error.code === 11000) {
        throw new DuplicateError('Un niveau scolaire avec ce libellé existe déjà');
      }
      throw error;
    }
  }

  async findById(id) {
    const doc = await this.niveauScolaireModel.findById(id);
    return doc ? NiveauScolaireEntity.fromPersistence(doc.toObject()) : null;
  }

  async findAll() {
    const docs = await this.niveauScolaireModel.find().sort({ ordre: 1, Lib_NiveauScolaire: 1 });
    return docs.map(doc => NiveauScolaireEntity.fromPersistence(doc.toObject()));
  }

  async update(id, entity) {
    const existing = await this.niveauScolaireModel.findOne({
      Lib_NiveauScolaire: entity.libNiveauScolaire,
      _id: { $ne: id }
    });

    if (existing) {
      throw new DuplicateError('Un niveau scolaire avec ce libellé existe déjà');
    }

    const doc = await this.niveauScolaireModel.findByIdAndUpdate(
      id,
      entity.toPersistence(),
      { new: true, runValidators: true }
    );

    if (!doc) {
      throw new NotFoundError('Niveau scolaire non trouvé');
    }

    return NiveauScolaireEntity.fromPersistence(doc.toObject());
  }

  async delete(id) {
    const doc = await this.niveauScolaireModel.findByIdAndDelete(id);
    if (!doc) {
      throw new NotFoundError('Niveau scolaire non trouvé');
    }
    return true;
  }

  async findByLibelle(libelle) {
    const doc = await this.niveauScolaireModel.findOne({ Lib_NiveauScolaire: libelle });
    return doc ? NiveauScolaireEntity.fromPersistence(doc.toObject()) : null;
  }

  async searchByName(searchTerm) {
    const docs = await this.niveauScolaireModel.find({
      Lib_NiveauScolaire: { $regex: searchTerm, $options: 'i' }
    }).sort({ ordre: 1, Lib_NiveauScolaire: 1 });
    
    return docs.map(doc => NiveauScolaireEntity.fromPersistence(doc.toObject()));
  }

  async findAllSorted() {
    return this.findAllByOrder();
  }

  async existsByLibelle(libelle, excludeId = null) {
    const filter = { Lib_NiveauScolaire: libelle };
    if (excludeId) {
      filter._id = { $ne: excludeId };
    }
    const count = await this.niveauScolaireModel.countDocuments(filter);
    return count > 0;
  }

  async findAllByOrder() {
    const docs = await this.niveauScolaireModel.find().sort({ ordre: 1 });
    return docs.map(doc => NiveauScolaireEntity.fromPersistence(doc.toObject()));
  }

  async findByType(type) {
    const docs = await this.niveauScolaireModel.find({
      Lib_NiveauScolaire: { $regex: type, $options: 'i' }
    }).sort({ ordre: 1 });
    
    return docs.map(doc => NiveauScolaireEntity.fromPersistence(doc.toObject()));
  }

  async updateOrders(updates) {
    const operations = updates.map(update => ({
      updateOne: {
        filter: { _id: update.id },
        update: { ordre: update.ordre, updatedAt: new Date() }
      }
    }));

    await this.niveauScolaireModel.bulkWrite(operations);
  }

  async count() {
    return this.niveauScolaireModel.countDocuments();
  }

  async exists(id) {
    const count = await this.niveauScolaireModel.countDocuments({ _id: id });
    return count > 0;
  }
}

/**
 * Implémentation MongoDB du repository Piece
 */
class MongoPieceRepository extends IPieceRepository {
  constructor() {
    super();
    this.pieceModel = require('../../../models/Piece');
  }

  async create(entity) {
    try {
      const existing = await this.findByLibelle(entity.nomPiece);
      if (existing) {
        throw new DuplicateError('Une pièce avec ce nom existe déjà');
      }

      const doc = await this.pieceModel.create(entity.toPersistence());
      return PieceEntity.fromPersistence(doc.toObject());
    } catch (error) {
      if (error.code === 11000) {
        throw new DuplicateError('Une pièce avec ce nom existe déjà');
      }
      throw error;
    }
  }

  async findById(id) {
    const doc = await this.pieceModel.findById(id);
    return doc ? PieceEntity.fromPersistence(doc.toObject()) : null;
  }

  async findAll() {
    const docs = await this.pieceModel.find().sort({ Nom_piece: 1 });
    return docs.map(doc => PieceEntity.fromPersistence(doc.toObject()));
  }

  async update(id, entity) {
    const existing = await this.pieceModel.findOne({
      Nom_piece: entity.nomPiece,
      _id: { $ne: id }
    });

    if (existing) {
      throw new DuplicateError('Une pièce avec ce nom existe déjà');
    }

    const doc = await this.pieceModel.findByIdAndUpdate(
      id,
      entity.toPersistence(),
      { new: true, runValidators: true }
    );

    if (!doc) {
      throw new NotFoundError('Pièce non trouvée');
    }

    return PieceEntity.fromPersistence(doc.toObject());
  }

  async delete(id) {
    const doc = await this.pieceModel.findByIdAndDelete(id);
    if (!doc) {
      throw new NotFoundError('Pièce non trouvée');
    }
    return true;
  }

  async findByLibelle(libelle) {
    const doc = await this.pieceModel.findOne({ Nom_piece: libelle });
    return doc ? PieceEntity.fromPersistence(doc.toObject()) : null;
  }

  async searchByName(searchTerm) {
    const docs = await this.pieceModel.find({
      Nom_piece: { $regex: searchTerm, $options: 'i' }
    }).sort({ Nom_piece: 1 });
    
    return docs.map(doc => PieceEntity.fromPersistence(doc.toObject()));
  }

  async findAllSorted() {
    return this.findAll();
  }

  async existsByLibelle(libelle, excludeId = null) {
    const filter = { Nom_piece: libelle };
    if (excludeId) {
      filter._id = { $ne: excludeId };
    }
    const count = await this.pieceModel.countDocuments(filter);
    return count > 0;
  }

  async findObligatoires() {
    const docs = await this.pieceModel.find({ obligatoire: true }).sort({ Nom_piece: 1 });
    return docs.map(doc => PieceEntity.fromPersistence(doc.toObject()));
  }

  async findByValiditeDuree(duree) {
    const docs = await this.pieceModel.find({ validiteDuree: duree }).sort({ Nom_piece: 1 });
    return docs.map(doc => PieceEntity.fromPersistence(doc.toObject()));
  }

  async findIdentitesOfficielles() {
    const docs = await this.pieceModel.find({
      Nom_piece: { 
        $regex: 'carte nationale|passeport|permis', 
        $options: 'i' 
      }
    }).sort({ Nom_piece: 1 });
    
    return docs.map(doc => PieceEntity.fromPersistence(doc.toObject()));
  }

  async count() {
    return this.pieceModel.countDocuments();
  }

  async exists(id) {
    const count = await this.pieceModel.countDocuments({ _id: id });
    return count > 0;
  }
}

module.exports = { 
  MongoNationaliteRepository, 
  MongoNiveauScolaireRepository, 
  MongoPieceRepository 
};