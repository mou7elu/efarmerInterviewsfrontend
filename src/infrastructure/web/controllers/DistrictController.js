const { 
  CreateDistrictUseCase,
  GetDistrictUseCase,
  UpdateDistrictUseCase,
  DeleteDistrictUseCase,
  GetAllDistrictsUseCase
} = require('../../../application/use-cases/geographic/DistrictUseCases');
const { ValidationError } = require('../../../shared/errors/ValidationError');

/**
 * Contrôleur REST pour la gestion des districts
 */
class DistrictController {
  constructor() {
    this.createDistrictUseCase = new CreateDistrictUseCase();
    this.getDistrictUseCase = new GetDistrictUseCase();
    this.updateDistrictUseCase = new UpdateDistrictUseCase();
    this.deleteDistrictUseCase = new DeleteDistrictUseCase();
    this.getAllDistrictsUseCase = new GetAllDistrictsUseCase();
  }

  /**
   * POST /api/districts
   * Créer un nouveau district
   */
  async create(req, res, next) {
    try {
      const result = await this.createDistrictUseCase.execute(req.body);
      
      res.status(201).json({
        success: true,
        message: 'District créé avec succès',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/districts/:id
   * Obtenir un district par ID
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const result = await this.getDistrictUseCase.execute(id);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/districts
   * Obtenir tous les districts avec filtres et pagination
   */
  async getAll(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        paysId = null,
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
        paysId: paysId?.trim() || null,
        actifSeulement: actifSeulement === 'true',
        search: search?.trim() || null
      };

      const result = await this.getAllDistrictsUseCase.execute(filters);
      
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
   * GET /api/pays/:paysId/districts
   * Obtenir tous les districts d'un pays
   */
  async getByPays(req, res, next) {
    try {
      const { paysId } = req.params;
      const { actifSeulement = false } = req.query;
      
      const filters = {
        paysId,
        actifSeulement: actifSeulement === 'true'
      };

      const result = await this.getAllDistrictsUseCase.execute(filters);
      
      res.json({
        success: true,
        data: result.items
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/districts/:id
   * Mettre à jour un district
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const result = await this.updateDistrictUseCase.execute(id, req.body);
      
      res.json({
        success: true,
        message: 'District mis à jour avec succès',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/districts/:id
   * Supprimer un district
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await this.deleteDistrictUseCase.execute(id);
      
      res.json({
        success: true,
        message: 'District supprimé avec succès'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/districts/:id/statut
   * Changer le statut d'un district (actif/inactif)
   */
  async updateStatut(req, res, next) {
    try {
      const { id } = req.params;
      const { sommeil } = req.body;
      
      if (typeof sommeil !== 'boolean') {
        throw new ValidationError('Le statut sommeil doit être un booléen');
      }

      const result = await this.updateDistrictUseCase.execute(id, { sommeil });
      
      res.json({
        success: true,
        message: `District ${sommeil ? 'désactivé' : 'activé'} avec succès`,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/districts/stats
   * Obtenir des statistiques sur les districts
   */
  async getStats(req, res, next) {
    try {
      const { paysId = null } = req.query;
      
      const filters = { paysId };
      const [allDistricts, actifsDistricts] = await Promise.all([
        this.getAllDistrictsUseCase.execute({ ...filters, actifSeulement: false }),
        this.getAllDistrictsUseCase.execute({ ...filters, actifSeulement: true })
      ]);

      res.json({
        success: true,
        data: {
          total: allDistricts.total,
          actifs: actifsDistricts.total,
          inactifs: allDistricts.total - actifsDistricts.total,
          paysId
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/districts/search/:term
   * Rechercher des districts par nom
   */
  async search(req, res, next) {
    try {
      const { term } = req.params;
      const { paysId = null, actifSeulement = false } = req.query;
      
      if (!term || term.trim().length < 2) {
        throw new ValidationError('Le terme de recherche doit contenir au moins 2 caractères');
      }

      const filters = {
        search: term.trim(),
        paysId: paysId?.trim() || null,
        actifSeulement: actifSeulement === 'true'
      };

      const result = await this.getAllDistrictsUseCase.execute(filters);
      
      res.json({
        success: true,
        data: result.items
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/pays/:paysId/districts/count
   * Compter les districts d'un pays
   */
  async countByPays(req, res, next) {
    try {
      const { paysId } = req.params;
      const { actifSeulement = false } = req.query;
      
      const filters = {
        paysId,
        actifSeulement: actifSeulement === 'true'
      };

      const result = await this.getAllDistrictsUseCase.execute(filters);
      
      res.json({
        success: true,
        data: {
          count: result.total,
          paysId
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = { DistrictController };