const { 
  GetAllVillagesUseCase,
  GetVillageUseCase,
  CreateVillageUseCase,
  UpdateVillageUseCase,
  DeleteVillageUseCase
} = require('../../../application/use-cases/geographic/VillageUseCases');

/**
 * Contrôleur pour la gestion des villages dans l'architecture Clean
 */
class VillageController {
  constructor() {
    this.getAllVillagesUseCase = new GetAllVillagesUseCase();
    this.getVillageUseCase = new GetVillageUseCase();
    this.createVillageUseCase = new CreateVillageUseCase();
    this.updateVillageUseCase = new UpdateVillageUseCase();
    this.deleteVillageUseCase = new DeleteVillageUseCase();
  }

  /**
   * Récupère tous les villages avec pagination et filtres
   */
  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 10, search } = req.query;
      
      const result = await this.getAllVillagesUseCase.execute({
        page: parseInt(page),
        limit: parseInt(limit),
        search
      });

      res.json({
        success: true,
        message: 'Villages récupérés avec succès',
        data: result.items,
        pagination: {
          currentPage: result.page,
          totalPages: result.pages,
          totalItems: result.total,
          itemsPerPage: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Erreur dans VillageController.getAll:', error);
      next(error);
    }
  }

  /**
   * Récupère un village par son ID
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const result = await this.getVillageUseCase.execute(id);

      res.json({
        success: true,
        message: 'Village récupéré avec succès',
        data: result
      });
    } catch (error) {
      console.error('Erreur dans VillageController.getById:', error);
      next(error);
    }
  }

  /**
   * Crée un nouveau village
   */
  async create(req, res, next) {
    try {
      const result = await this.createVillageUseCase.execute(req.body);

      res.status(201).json({
        success: true,
        message: 'Village créé avec succès',
        data: result
      });
    } catch (error) {
      console.error('Erreur dans VillageController.create:', error);
      next(error);
    }
  }

  /**
   * Met à jour un village
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const result = await this.updateVillageUseCase.execute(id, req.body);

      res.json({
        success: true,
        message: 'Village mis à jour avec succès',
        data: result
      });
    } catch (error) {
      console.error('Erreur dans VillageController.update:', error);
      next(error);
    }
  }

  /**
   * Supprime un village
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const result = await this.deleteVillageUseCase.execute(id);

      res.json({
        success: true,
        message: result.message || 'Village supprimé avec succès'
      });
    } catch (error) {
      console.error('Erreur dans VillageController.delete:', error);
      next(error);
    }
  }

  /**
   * Recherche des villages
   */
  async search(req, res, next) {
    try {
      const { term } = req.params;
      const { page = 1, limit = 10 } = req.query;
      
      const result = await this.searchVillagesUseCase.execute({
        searchTerm: term,
        page: parseInt(page),
        limit: parseInt(limit)
      });

      res.json({
        success: true,
        message: 'Recherche effectuée avec succès',
        data: result.items,
        pagination: {
          currentPage: result.page,
          totalPages: result.pages,
          totalItems: result.total,
          itemsPerPage: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Erreur dans VillageController.search:', error);
      next(error);
    }
  }

  /**
   * Récupère les statistiques des villages
   */
  async getStats(req, res, next) {
    try {
      const result = await this.getVillageStatsUseCase.execute();

      res.json({
        success: true,
        message: 'Statistiques récupérées avec succès',
        data: result
      });
    } catch (error) {
      console.error('Erreur dans VillageController.getStats:', error);
      next(error);
    }
  }
}

module.exports = { VillageController };