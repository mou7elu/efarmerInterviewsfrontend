const { CreatePaysUseCase } = require('../../../application/use-cases/geographic/CreatePaysUseCase');
const { GetPaysUseCase } = require('../../../application/use-cases/geographic/GetPaysUseCase');
const { UpdatePaysUseCase } = require('../../../application/use-cases/geographic/UpdatePaysUseCase');
const { DeletePaysUseCase } = require('../../../application/use-cases/geographic/DeletePaysUseCase');
const { GetAllPaysUseCase } = require('../../../application/use-cases/geographic/GetAllPaysUseCase');
const { GetLocalPaysUseCase } = require('../../../application/use-cases/geographic/GetLocalPaysUseCase');
const { ValidationError } = require('../../../shared/errors/ValidationError');

/**
 * Contrôleur REST pour la gestion des pays
 */
class PaysController {
  constructor() {
    this.createPaysUseCase = new CreatePaysUseCase();
    this.getPaysUseCase = new GetPaysUseCase();
    this.updatePaysUseCase = new UpdatePaysUseCase();
    this.deletePaysUseCase = new DeletePaysUseCase();
    this.getAllPaysUseCase = new GetAllPaysUseCase();
    this.getLocalPaysUseCase = new GetLocalPaysUseCase();
  }

  /**
   * POST /api/pays
   * Créer un nouveau pays
   */
  async create(req, res, next) {
    try {
      const result = await this.createPaysUseCase.execute(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Pays créé avec succès',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/pays/:id
   * Obtenir un pays par ID
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const result = await this.getPaysUseCase.execute(id);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/pays
   * Obtenir tous les pays avec filtres et pagination
   */
  async getAll(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
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
        actifSeulement: actifSeulement === 'true',
        search: search?.trim() || null
      };

      const result = await this.getAllPaysUseCase.execute(filters);
      
      res.json({
        success: true,
        data: result.items,
        pagination: {
          page: result.page,
          pages: result.pages,
          total: result.total,
          limit: limitNum || result.total // Si pas de limite, retourner le total
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/pays/:id
   * Mettre à jour un pays
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const result = await this.updatePaysUseCase.execute(id, req.body);
      
      res.json({
        success: true,
        message: 'Pays mis à jour avec succès',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/pays/:id
   * Supprimer un pays
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await this.deletePaysUseCase.execute(id);
      
      res.json({
        success: true,
        message: 'Pays supprimé avec succès'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/pays/:id/statut
   * Changer le statut d'un pays (actif/inactif)
   */
  async updateStatut(req, res, next) {
    try {
      const { id } = req.params;
      const { sommeil } = req.body;
      
      if (typeof sommeil !== 'boolean') {
        throw new ValidationError('Le statut sommeil doit être un booléen');
      }

      const result = await this.updatePaysUseCase.execute(id, { sommeil });
      
      res.json({
        success: true,
        message: `Pays ${sommeil ? 'désactivé' : 'activé'} avec succès`,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/pays/stats
   * Obtenir des statistiques sur les pays
   */
  async getStats(req, res, next) {
    try {
      // Cette méthode pourrait être implémentée avec un use case dédié
      const [allPays, actifsPays] = await Promise.all([
        this.getAllPaysUseCase.execute({ actifSeulement: false }),
        this.getAllPaysUseCase.execute({ actifSeulement: true })
      ]);

      res.json({
        success: true,
        data: {
          total: allPays.total,
          actifs: actifsPays.total,
          inactifs: allPays.total - actifsPays.total
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/pays/search/:term
   * Rechercher des pays par nom
   */
  async search(req, res, next) {
    try {
      const { term } = req.params;
      const { actifSeulement = false } = req.query;
      
      if (!term || term.trim().length < 2) {
        throw new ValidationError('Le terme de recherche doit contenir au moins 2 caractères');
      }

      const filters = {
        search: term.trim(),
        actifSeulement: actifSeulement === 'true'
      };

      const result = await this.getAllPaysUseCase.execute(filters);
      
      res.json({
        success: true,
        data: result.items
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/pays/local
   * Obtenir le pays local (Islocal = true)
   */
  async getLocal(req, res, next) {
    try {
      const result = await this.getLocalPaysUseCase.execute();
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = { PaysController };