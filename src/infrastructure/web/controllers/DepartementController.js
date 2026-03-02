const { 
  CreateDepartementUseCase,
  GetDepartementUseCase,
  UpdateDepartementUseCase,
  DeleteDepartementUseCase,
  GetAllDepartementsUseCase
} = require('../../../application/use-cases/geographic/DepartementUseCases');
const { ValidationError } = require('../../../shared/errors/ValidationError');

/**
 * Contrôleur REST pour la gestion des départements
 */
class DepartementController {
  constructor() {
    this.createDepartementUseCase = new CreateDepartementUseCase();
    this.getDepartementUseCase = new GetDepartementUseCase();
    this.updateDepartementUseCase = new UpdateDepartementUseCase();
    this.deleteDepartementUseCase = new DeleteDepartementUseCase();
    this.getAllDepartementsUseCase = new GetAllDepartementsUseCase();
  }

  /**
   * POST /api/geographic/departements
   * Créer un nouveau département
   */
  async create(req, res, next) {
    try {
      const result = await this.createDepartementUseCase.execute(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Département créé avec succès',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/geographic/departements/:id
   * Obtenir un département par ID
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const result = await this.getDepartementUseCase.execute(id);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/geographic/departements
   * Obtenir tous les départements avec filtres et pagination
   */
  async getAll(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        regionId = null,
        actifSeulement = false,
        search = null
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
        regionId: regionId?.trim() || null,
        actifSeulement: actifSeulement === 'true',
        search: search?.trim() || null
      };

      const result = await this.getAllDepartementsUseCase.execute(filters);
      
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
   * GET /api/geographic/regions/:regionId/departements
   * Obtenir tous les départements d'une région
   */
  async getByRegion(req, res, next) {
    try {
      const { regionId } = req.params;
      const { actifSeulement = false } = req.query;
      
      const filters = {
        regionId,
        actifSeulement: actifSeulement === 'true'
      };

      const result = await this.getAllDepartementsUseCase.execute(filters);
      
      res.json({
        success: true,
        data: result.items
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/geographic/departements/:id
   * Mettre à jour un département
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const result = await this.updateDepartementUseCase.execute(id, req.body);
      
      res.json({
        success: true,
        message: 'Département mis à jour avec succès',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/geographic/departements/:id
   * Supprimer un département
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await this.deleteDepartementUseCase.execute(id);
      
      res.json({
        success: true,
        message: 'Département supprimé avec succès'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/geographic/departements/:id/statut
   * Changer le statut d'un département (actif/inactif)
   */
  async updateStatut(req, res, next) {
    try {
      const { id } = req.params;
      const { sommeil } = req.body;
      
      if (typeof sommeil !== 'boolean') {
        throw new ValidationError('Le statut sommeil doit être un booléen');
      }

      const result = await this.updateDepartementUseCase.execute(id, { sommeil });
      
      res.json({
        success: true,
        message: `Département ${sommeil ? 'désactivé' : 'activé'} avec succès`,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/geographic/departements/stats
   * Obtenir des statistiques sur les départements
   */
  async getStats(req, res, next) {
    try {
      const { regionId = null } = req.query;
      
      const filters = { regionId };
      const [allDepartements, actifsDepartements] = await Promise.all([
        this.getAllDepartementsUseCase.execute({ ...filters, actifSeulement: false }),
        this.getAllDepartementsUseCase.execute({ ...filters, actifSeulement: true })
      ]);

      res.json({
        success: true,
        data: {
          total: allDepartements.total,
          actifs: actifsDepartements.total,
          inactifs: allDepartements.total - actifsDepartements.total,
          regionId
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/geographic/departements/search/:term
   * Rechercher des départements par nom
   */
  async search(req, res, next) {
    try {
      const { term } = req.params;
      const { regionId = null, actifSeulement = false } = req.query;
      
      if (!term || term.trim().length < 2) {
        throw new ValidationError('Le terme de recherche doit contenir au moins 2 caractères');
      }

      const filters = {
        search: term.trim(),
        regionId: regionId?.trim() || null,
        actifSeulement: actifSeulement === 'true'
      };

      const result = await this.getAllDepartementsUseCase.execute(filters);
      
      res.json({
        success: true,
        data: result.items
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/geographic/regions/:regionId/departements/count
   * Compter les départements d'une région
   */
  async countByRegion(req, res, next) {
    try {
      const { regionId } = req.params;
      const { actifSeulement = false } = req.query;
      
      const filters = {
        regionId,
        actifSeulement: actifSeulement === 'true'
      };

      const result = await this.getAllDepartementsUseCase.execute(filters);
      
      res.json({
        success: true,
        data: {
          count: result.total,
          regionId
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = { DepartementController };