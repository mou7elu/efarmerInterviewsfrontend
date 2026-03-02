const {
  CreateZoneInterditUseCase,
  GetZoneInterditUseCase,
  GetAllZoneInterditUseCase,
  GetZoneInterditByPaysUseCase,
  GetActiveZoneInterditUseCase,
  GetInactiveZoneInterditUseCase,
  GetZoneInterditWithCoordinatesUseCase,
  GetZoneInterditWithPaysUseCase,
  UpdateZoneInterditUseCase,
  ToggleZoneInterditStatusUseCase,
  DeleteZoneInterditUseCase
} = require('../../../application/use-cases/other/ZoneInterditUseCases');

/**
 * Zone Interdite Controller
 * Handles prohibited/restricted zone management
 */
class ZoneInterditController {
  async create(req, res) {
    try {
      const useCase = new CreateZoneInterditUseCase();
      const zone = await useCase.execute(req.body);
      res.status(201).json(zone);
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const useCase = new GetZoneInterditUseCase();
      const zone = await useCase.execute(req.params.id);
      res.json(zone);
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const useCase = new GetAllZoneInterditUseCase();
      const zones = await useCase.execute(req.query);
      res.json(zones);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getActive(req, res) {
    try {
      const useCase = new GetActiveZoneInterditUseCase();
      const zones = await useCase.execute();
      res.json(zones);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getInactive(req, res) {
    try {
      const useCase = new GetInactiveZoneInterditUseCase();
      const zones = await useCase.execute();
      res.json(zones);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getWithCoordinates(req, res) {
    try {
      const useCase = new GetZoneInterditWithCoordinatesUseCase();
      const zones = await useCase.execute();
      res.json(zones);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getByPays(req, res) {
    try {
      const useCase = new GetZoneInterditByPaysUseCase();
      const zones = await useCase.execute(req.params.paysId);
      res.json(zones);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getWithPays(req, res) {
    try {
      const useCase = new GetZoneInterditWithPaysUseCase();
      const zones = await useCase.execute();
      res.json(zones);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const useCase = new UpdateZoneInterditUseCase();
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

  async toggleStatus(req, res) {
    try {
      const useCase = new ToggleZoneInterditStatusUseCase();
      const zone = await useCase.execute(req.params.id);
      res.json(zone);
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const useCase = new DeleteZoneInterditUseCase();
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

module.exports = new ZoneInterditController();
