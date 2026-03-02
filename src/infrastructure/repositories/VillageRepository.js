const Village = require('../../../models/Village');

/**
 * Repository pour la gestion des villages
 */
class VillageRepository {
  constructor() {
    this.model = Village;
  }

  /**
   * Trouve tous les villages
   */
  async findAll() {
    return await this.model.find().populate('PaysId', 'Lib_pays').lean();
  }

  /**
   * Trouve les villages avec pagination
   */
  async findPaginated(page = 1, limit = 10, search = null) {
    const skip = (page - 1) * limit;
    let query = {};

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query = {
        $or: [
          { Lib_village: searchRegex },
          { 'Coordonnee.latitude': searchRegex },
          { 'Coordonnee.longitude': searchRegex }
        ]
      };
    }

    const [items, total] = await Promise.all([
      this.model.find(query)
        .populate('PaysId', 'Lib_pays')
        .sort({ Lib_village: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.model.countDocuments(query)
    ]);

    return {
      items,
      total,
      page,
      pages: Math.ceil(total / limit)
    };
  }

  /**
   * Trouve un village par ID
   */
  async findById(id) {
    return await this.model.findById(id).populate('PaysId', 'Lib_pays').lean();
  }

  /**
   * Crée un nouveau village
   */
  async create(villageData) {
    const village = new this.model(villageData);
    const savedVillage = await village.save();
    return await this.findById(savedVillage._id);
  }

  /**
   * Met à jour un village
   */
  async update(id, updateData) {
    await this.model.findByIdAndUpdate(id, updateData, { new: true });
    return await this.findById(id);
  }

  /**
   * Supprime un village
   */
  async delete(id) {
    return await this.model.findByIdAndDelete(id);
  }

  /**
   * Recherche des villages par nom
   */
  async searchByName(searchTerm) {
    const searchRegex = new RegExp(searchTerm, 'i');
    return await this.model.find({
      Lib_village: searchRegex
    }).populate('PaysId', 'Lib_pays').lean();
  }

  /**
   * Compte le nombre total de villages
   */
  async count() {
    return await this.model.countDocuments();
  }

  /**
   * Compte les villages avec coordonnées
   */
  async countWithCoordinates() {
    return await this.model.countDocuments({
      'Coordonnee.latitude': { $exists: true, $ne: null },
      'Coordonnee.longitude': { $exists: true, $ne: null }
    });
  }

  /**
   * Obtient la répartition des villages par pays
   */
  async getDistributionByCountry() {
    return await this.model.aggregate([
      {
        $lookup: {
          from: 'pays',
          localField: 'PaysId',
          foreignField: '_id',
          as: 'pays'
        }
      },
      {
        $unwind: '$pays'
      },
      {
        $group: {
          _id: '$pays._id',
          paysNom: { $first: '$pays.Lib_pays' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
  }

  /**
   * Obtient les statistiques des coordonnées
   */
  async getCoordinateStats() {
    const result = await this.model.aggregate([
      {
        $match: {
          'Coordonnee.latitude': { $exists: true, $ne: null },
          'Coordonnee.longitude': { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: null,
          avgLatitude: { $avg: '$Coordonnee.latitude' },
          avgLongitude: { $avg: '$Coordonnee.longitude' },
          minLatitude: { $min: '$Coordonnee.latitude' },
          maxLatitude: { $max: '$Coordonnee.latitude' },
          minLongitude: { $min: '$Coordonnee.longitude' },
          maxLongitude: { $max: '$Coordonnee.longitude' }
        }
      }
    ]);

    return result.length > 0 ? result[0] : {
      avgLatitude: 0,
      avgLongitude: 0,
      minLatitude: 0,
      maxLatitude: 0,
      minLongitude: 0,
      maxLongitude: 0
    };
  }

  /**
   * Compte les villages récents (créés dans les N derniers jours)
   */
  async countRecent(days = 30) {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);
    
    return await this.model.countDocuments({
      createdAt: { $gte: dateLimit }
    });
  }
}

module.exports = { VillageRepository };