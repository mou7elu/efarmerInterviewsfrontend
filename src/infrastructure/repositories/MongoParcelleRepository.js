const { IParcelleRepository } = require('../../domain/repositories/IParcelleRepository');
const { ParcelleEntity } = require('../../domain/entities/ParcelleEntity');
const { NotFoundError } = require('../../shared/errors/NotFoundError');
const { DuplicateError } = require('../../shared/errors/DuplicateError');
const mongoose = require('mongoose');

/**
 * Implémentation MongoDB du repository Parcelle
 */
class MongoParcelleRepository extends IParcelleRepository {
  constructor() {
    super();
    this.parcelleModel = require('../../../models/Parcelle');
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
      // Vérifier l'existence du producteur
      if (entity.codeProducteur) {
        const producteurExists = await this.producteurModel.exists({ Code: entity.codeProducteur });
        if (!producteurExists) {
          throw new Error('Le producteur spécifié n\'existe pas');
        }
      }

      const doc = await this.parcelleModel.create(entity.toPersistence());
      return ParcelleEntity.fromPersistence(doc.toObject());
    } catch (error) {
      if (error.code === 11000) {
        throw new DuplicateError('Une parcelle avec ces coordonnées existe déjà');
      }
      throw error;
    }
  }

  async findById(id) {
    // Si l'ID n'est pas un ObjectId valide, retourner null
    if (!this.isValidObjectId(id)) {
      console.log(`⚠️ ID "${id}" n'est pas un ObjectId valide`);
      return null;
    }
    
    const doc = await this.parcelleModel.findById(id);
    return doc ? ParcelleEntity.fromPersistence(doc.toObject()) : null;
  }

  async findAll() {
    const docs = await this.parcelleModel.find().sort({ NumParcelle: 1 });
    return docs.map(doc => ParcelleEntity.fromPersistence(doc.toObject()));
  }

  async update(id, entity) {
    // Si l'ID n'est pas un ObjectId valide, retourner une erreur claire
    if (!this.isValidObjectId(id)) {
      throw new NotFoundError(`ID invalide: "${id}" n'est pas un ObjectId MongoDB valide. Utilisez un ObjectId de 24 caractères hexadécimaux.`);
    }
    
    // Vérifier l'existence du producteur
    if (entity.codeProducteur) {
      const producteurExists = await this.producteurModel.exists({ Code: entity.codeProducteur });
      if (!producteurExists) {
        throw new Error('Le producteur spécifié n\'existe pas');
      }
    }

    const doc = await this.parcelleModel.findByIdAndUpdate(
      id,
      entity.toPersistence(),
      { new: true, runValidators: true }
    );

    if (!doc) {
      throw new NotFoundError('Parcelle non trouvée');
    }

    return ParcelleEntity.fromPersistence(doc.toObject());
  }

  async delete(id) {
    const doc = await this.parcelleModel.findByIdAndDelete(id);
    if (!doc) {
      throw new NotFoundError('Parcelle non trouvée');
    }
    return true;
  }

  async findByProducteur(codeProducteur) {
    const docs = await this.parcelleModel.find({ CodeProducteur: codeProducteur }).sort({ NumParcelle: 1 });
    return docs.map(doc => ParcelleEntity.fromPersistence(doc.toObject()));
  }

  async findBySurfaceRange(surfaceMin, surfaceMax) {
    const docs = await this.parcelleModel.find({
      Surface: { $gte: surfaceMin, $lte: surfaceMax }
    }).sort({ Surface: 1 });
    
    return docs.map(doc => ParcelleEntity.fromPersistence(doc.toObject()));
  }

  async findByLocation(latitude, longitude, radiusKm) {
    // Conversion km vers radians pour MongoDB
    const earthRadiusKm = 6371;
    const radiusRadians = radiusKm / earthRadiusKm;

    const docs = await this.parcelleModel.find({
      GPSLatitude: {
        $gte: latitude - (radiusRadians * 180 / Math.PI),
        $lte: latitude + (radiusRadians * 180 / Math.PI)
      },
      GPSLongitude: {
        $gte: longitude - (radiusRadians * 180 / Math.PI),
        $lte: longitude + (radiusRadians * 180 / Math.PI)
      }
    }).sort({ NumParcelle: 1 });

    return docs.map(doc => ParcelleEntity.fromPersistence(doc.toObject()));
  }

  async getTotalSurface() {
    const result = await this.parcelleModel.aggregate([
      {
        $group: {
          _id: null,
          totalSurface: { $sum: '$Surface' }
        }
      }
    ]);

    return result.length > 0 ? result[0].totalSurface : 0;
  }

  async getTotalSurfaceByProducteur(codeProducteur) {
    const result = await this.parcelleModel.aggregate([
      {
        $match: { CodeProducteur: codeProducteur }
      },
      {
        $group: {
          _id: null,
          totalSurface: { $sum: '$Surface' }
        }
      }
    ]);

    return result.length > 0 ? result[0].totalSurface : 0;
  }

  async count() {
    return this.parcelleModel.countDocuments();
  }

  async exists(id) {
    const count = await this.parcelleModel.countDocuments({ _id: id });
    return count > 0;
  }

  async findPaginated(page = 1, limit = 10, codeProducteur = null) {
    const skip = (page - 1) * limit;
    const filter = {};
    
    if (codeProducteur) {
      filter.CodeProducteur = codeProducteur;
    }

    const [docs, total] = await Promise.all([
      this.parcelleModel.find(filter)
        .sort({ NumParcelle: 1 })
        .skip(skip)
        .limit(limit),
      this.parcelleModel.countDocuments(filter)
    ]);

    return {
      items: docs.map(doc => ParcelleEntity.fromPersistence(doc.toObject())),
      total,
      page,
      pages: Math.ceil(total / limit)
    };
  }

  /**
   * Recherche avancée des parcelles
   */
  async searchParcelles(criteria) {
    const filter = {};
    
    if (criteria.codeProducteur) {
      filter.CodeProducteur = criteria.codeProducteur;
    }
    
    if (criteria.surfaceMin !== undefined) {
      filter.Surface = { ...filter.Surface, $gte: criteria.surfaceMin };
    }
    
    if (criteria.surfaceMax !== undefined) {
      filter.Surface = { ...filter.Surface, $lte: criteria.surfaceMax };
    }
    
    if (criteria.numParcelle) {
      filter.NumParcelle = { $regex: criteria.numParcelle, $options: 'i' };
    }

    const docs = await this.parcelleModel.find(filter).sort({ NumParcelle: 1 });
    return docs.map(doc => ParcelleEntity.fromPersistence(doc.toObject()));
  }

  /**
   * Obtenir les statistiques des parcelles
   */
  async getStatistiques() {
    const [total, surfaceStats, parcellesParProducteur] = await Promise.all([
      this.parcelleModel.countDocuments(),
      this.parcelleModel.aggregate([
        {
          $group: {
            _id: null,
            totalSurface: { $sum: '$Surface' },
            surfaceMoyenne: { $avg: '$Surface' },
            surfaceMin: { $min: '$Surface' },
            surfaceMax: { $max: '$Surface' }
          }
        }
      ]),
      this.parcelleModel.aggregate([
        {
          $group: {
            _id: '$CodeProducteur',
            nombreParcelles: { $sum: 1 },
            surfaceTotale: { $sum: '$Surface' }
          }
        },
        {
          $group: {
            _id: null,
            nombreProducteurs: { $sum: 1 },
            parcellesParProducteurMoyenne: { $avg: '$nombreParcelles' }
          }
        }
      ])
    ]);

    const surface = surfaceStats.length > 0 ? surfaceStats[0] : {
      totalSurface: 0,
      surfaceMoyenne: 0,
      surfaceMin: 0,
      surfaceMax: 0
    };

    const producteurs = parcellesParProducteur.length > 0 ? parcellesParProducteur[0] : {
      nombreProducteurs: 0,
      parcellesParProducteurMoyenne: 0
    };

    return {
      totalParcelles: total,
      totalSurface: surface.totalSurface,
      surfaceMoyenne: Math.round(surface.surfaceMoyenne * 100) / 100,
      surfaceMin: surface.surfaceMin,
      surfaceMax: surface.surfaceMax,
      nombreProducteurs: producteurs.nombreProducteurs,
      parcellesParProducteurMoyenne: Math.round(producteurs.parcellesParProducteurMoyenne * 100) / 100
    };
  }

  /**
   * Trouver les parcelles avec GPS valide
   */
  async findWithValidGPS() {
    const docs = await this.parcelleModel.find({
      GPSLatitude: { $ne: null, $exists: true },
      GPSLongitude: { $ne: null, $exists: true },
      GPSLatitude: { $gte: -90, $lte: 90 },
      GPSLongitude: { $gte: -180, $lte: 180 }
    }).sort({ NumParcelle: 1 });

    return docs.map(doc => ParcelleEntity.fromPersistence(doc.toObject()));
  }

  /**
   * Mise à jour des coordonnées GPS
   */
  async updateGPS(id, latitude, longitude) {
    const doc = await this.parcelleModel.findByIdAndUpdate(
      id,
      { 
        GPSLatitude: latitude,
        GPSLongitude: longitude,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!doc) {
      throw new NotFoundError('Parcelle non trouvée');
    }

    return ParcelleEntity.fromPersistence(doc.toObject());
  }
}

module.exports = { MongoParcelleRepository };