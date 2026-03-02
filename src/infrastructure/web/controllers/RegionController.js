const { 
  CreateRegionUseCase,
  GetRegionUseCase,
  UpdateRegionUseCase,
  DeleteRegionUseCase,
  GetAllRegionsUseCase
} = require('../../../application/use-cases/geographic/RegionUseCases');
const { ValidationError } = require('../../../shared/errors/ValidationError');

/**
 * Contrôleur REST pour la gestion des régions
 */
class RegionController {
  constructor() {
    this.createRegionUseCase = new CreateRegionUseCase();
    this.getRegionUseCase = new GetRegionUseCase();
    this.updateRegionUseCase = new UpdateRegionUseCase();
    this.deleteRegionUseCase = new DeleteRegionUseCase();
    this.getAllRegionsUseCase = new GetAllRegionsUseCase();
  }

  /**
   * POST /api/geographic/regions
   * Créer une nouvelle région
   */
  async create(req, res, next) {
    try {
      const result = await this.createRegionUseCase.execute(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Région créée avec succès',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/geographic/regions/:id
   * Obtenir une région par ID
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const result = await this.getRegionUseCase.execute(id);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/geographic/regions
   * Obtenir toutes les régions avec filtres et pagination
   */
  async getAll(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        actifSeulement = false,
        search = null,
        districtId = null
      } = req.query;

      // Validation des paramètres
      const pageNum = parseInt(page);
      const limitNum = limit ? parseInt(limit) : 0; // 0 = pas de limite
      
      if (isNaN(pageNum) || pageNum < 1) {
        throw new ValidationError('Le numéro de page doit être un entier positif');
      }
      
      // Enlever la contrainte de limite maximale
      if (limit && (isNaN(limitNum) || limitNum < 1)) {
        throw new ValidationError('La limite doit être un entier positif');
      }

      const filters = {
        page: pageNum,
        limit: limitNum,
        actifSeulement: actifSeulement === 'true',
        search: search?.trim() || null,
        districtId: districtId || null
      };

      const result = await this.getAllRegionsUseCase.execute(filters);
      
      res.json({
        success: true,
        data: result.items,
        pagination: {
          page: result.page,
          pages: result.pages,
          total: result.total,
          limit: limitNum
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/geographic/regions/:id
   * Mettre à jour une région
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const result = await this.updateRegionUseCase.execute(id, req.body);
      
      res.json({
        success: true,
        message: 'Région mise à jour avec succès',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/geographic/regions/:id
   * Supprimer une région
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await this.deleteRegionUseCase.execute(id);
      
      res.json({
        success: true,
        message: 'Région supprimée avec succès'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/geographic/regions/:id/statut
   * Changer le statut d'une région (actif/inactif)
   */
  async updateStatut(req, res, next) {
    try {
      const { id } = req.params;
      const { sommeil } = req.body;
      
      if (typeof sommeil !== 'boolean') {
        throw new ValidationError('Le statut sommeil doit être un booléen');
      }

      const result = await this.updateRegionUseCase.execute(id, { sommeil });
      
      res.json({
        success: true,
        message: `Région ${sommeil ? 'désactivée' : 'activée'} avec succès`,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/geographic/regions/stats
   * Obtenir des statistiques sur les régions
   */
  async getStats(req, res, next) {
    try {
      const [allRegions, activesRegions] = await Promise.all([
        this.getAllRegionsUseCase.execute({ actifSeulement: false }),
        this.getAllRegionsUseCase.execute({ actifSeulement: true })
      ]);

      res.json({
        success: true,
        data: {
          total: allRegions.total,
          actives: activesRegions.total,
          inactives: allRegions.total - activesRegions.total
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/geographic/regions/search/:term
   * Rechercher des régions par nom
   */
  async search(req, res, next) {
    try {
      const { term } = req.params;
      const { actifSeulement = false, districtId = null } = req.query;
      
      if (!term || term.trim().length < 2) {
        throw new ValidationError('Le terme de recherche doit contenir au moins 2 caractères');
      }

      const filters = {
        search: term.trim(),
        actifSeulement: actifSeulement === 'true',
        districtId: districtId || null
      };

      const result = await this.getAllRegionsUseCase.execute(filters);
      
      res.json({
        success: true,
        data: result.items
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/geographic/districts/:districtId/regions
   * Obtenir toutes les régions d'un district
   */
  async getByDistrict(req, res, next) {
    try {
      const { districtId } = req.params;
      const { actifSeulement = false } = req.query;

      const filters = {
        districtId,
        actifSeulement: actifSeulement === 'true'
      };

      const result = await this.getAllRegionsUseCase.execute(filters);
      
      res.json({
        success: true,
        data: result.items
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/geographic/districts/:districtId/regions/count
   * Compter les régions d'un district
   */
  async countByDistrict(req, res, next) {
    try {
      const { districtId } = req.params;
      const { actifSeulement = false } = req.query;

      const filters = {
        districtId,
        actifSeulement: actifSeulement === 'true'
      };

      const result = await this.getAllRegionsUseCase.execute(filters);
      
      res.json({
        success: true,
        data: {
          count: result.total,
          districtId
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = { RegionController };