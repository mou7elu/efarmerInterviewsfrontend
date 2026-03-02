const {
  CreateZonedenombreUseCase,
  GetZonedenombreUseCase,
  GetAllZonedenombreUseCase,
  GetZonedenombreBySecteurAdministratifUseCase,
  UpdateZonedenombreUseCase,
  DeleteZonedenombreUseCase
} = require('../../../application/use-cases/administrative/ZonedenombreUseCases');

/**
 * Zonedenombre Controller
 */
class ZonedenombreController {
  /**
   * Create a new zone de dénombrement
   */
  async create(req, res) {
    try {
      const useCase = new CreateZonedenombreUseCase();
      const zone = await useCase.execute(req.body);
      res.status(201).json(zone);
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get zone de dénombrement by ID
   */
  async getById(req, res) {
    try {
      const useCase = new GetZonedenombreUseCase();
      const zone = await useCase.execute(req.params.id);
      res.json(zone);
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get all zones de dénombrement
   */
  async getAll(req, res) {
    try {
      const useCase = new GetAllZonedenombreUseCase();
      const zones = await useCase.execute(req.query);
      res.json(zones);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get zones de dénombrement by secteur administratif
   */
  async getBySecteurAdministratif(req, res) {
    try {
      const useCase = new GetZonedenombreBySecteurAdministratifUseCase();
      const zones = await useCase.execute(req.params.secteurId);
      res.json(zones);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Update zone de dénombrement
   */
  async update(req, res) {
    try {
      const useCase = new UpdateZonedenombreUseCase();
      const zone = await useCase.execute(req.params.id, req.body);
      res.json(zone);
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.status(404).json({ error: error.message });
      }
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Delete zone de dénombrement
   */
  async delete(req, res) {
    try {
      const useCase = new DeleteZonedenombreUseCase();
      const result = await useCase.execute(req.params.id);
      res.json(result);
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ZonedenombreController();
