const {
  CreateParcelleUseCase,
  GetParcelleUseCase,
  GetAllParcellesUseCase,
  GetParcellesByProducteurUseCase,
  GetParcellesStatisticsUseCase,
  GetCertifiedParcellesUseCase,
  GetParcellesByVillageUseCase,
  GetParcellesByZoneUseCase,
  GetParcellesByTypeUseCase,
  GetParcellesByYearUseCase,
  GetParcellesBySizeRangeUseCase,
  GetParcellesWithVarietiesUseCase,
  GetParcellesWithOrangersUseCase,
  GetOldestParcellesUseCase,
  GetRecentParcellesUseCase,
  UpdateParcelleUseCase,
  UpdateParcelleCoordinatesUseCase,
  UpdateParcelleProductionUseCase,
  UpdateParcelleExpensesUseCase,
  ToggleCertificationUseCase,
  DeleteParcelleUseCase,
  DeleteParcellesByProducteurUseCase
} = require('../../../application/use-cases/agricultural/ParcelleUseCases');

/**
 * Parcelle Controller
 * Handles agricultural plot/parcel management
 */
class ParcelleController {
  async create(req, res) {
    try {
      console.log('🌾 ParcelleController.create - start');
      console.log('📦 ParcelleController.create - body:', JSON.stringify(req.body, null, 2));
      const useCase = new CreateParcelleUseCase();
      const parcelle = await useCase.execute(req.body);
      console.log('✅ ParcelleController.create - created:', parcelle?.id || parcelle?._id || parcelle?.Code);
      res.status(201).json(parcelle);
    } catch (error) {
      console.error('❌ ParcelleController.create - error:', error.message);
      console.error('📋 ParcelleController.create - stack:', error.stack);
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const useCase = new GetParcelleUseCase();
      const parcelle = await useCase.execute(req.params.id);
      res.json(parcelle);
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const useCase = new GetAllParcellesUseCase();
      const parcelles = await useCase.execute();
      res.json(parcelles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getByProducteur(req, res) {
    try {
      const useCase = new GetParcellesByProducteurUseCase();
      const parcelles = await useCase.execute(req.params.producteurId);
      res.json(parcelles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getStatistics(req, res) {
    try {
      const useCase = new GetParcellesStatisticsUseCase();
      const statistics = await useCase.execute();
      res.json(statistics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCertified(req, res) {
    try {
      const useCase = new GetCertifiedParcellesUseCase();
      const parcelles = await useCase.execute();
      res.json(parcelles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getByVillage(req, res) {
    try {
      const useCase = new GetParcellesByVillageUseCase();
      const parcelles = await useCase.execute(req.params.villageId);
      res.json(parcelles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getByZone(req, res) {
    try {
      const useCase = new GetParcellesByZoneUseCase();
      const parcelles = await useCase.execute(req.params.zoneId);
      res.json(parcelles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getByType(req, res) {
    try {
      const useCase = new GetParcellesByTypeUseCase();
      const parcelles = await useCase.execute(req.params.type);
      res.json(parcelles);
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async getByYear(req, res) {
    try {
      const useCase = new GetParcellesByYearUseCase();
      const parcelles = await useCase.execute(parseInt(req.params.year));
      res.json(parcelles);
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async getBySizeRange(req, res) {
    try {
      const { minSize, maxSize } = req.query;
      if (!minSize || !maxSize) {
        return res.status(400).json({ error: 'minSize and maxSize query parameters are required' });
      }

      const useCase = new GetParcellesBySizeRangeUseCase();
      const parcelles = await useCase.execute(parseFloat(minSize), parseFloat(maxSize));
      res.json(parcelles);
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async getWithVarieties(req, res) {
    try {
      const useCase = new GetParcellesWithVarietiesUseCase();
      const parcelles = await useCase.execute();
      res.json(parcelles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getWithOrangers(req, res) {
    try {
      const useCase = new GetParcellesWithOrangersUseCase();
      const parcelles = await useCase.execute();
      res.json(parcelles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getOldest(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const useCase = new GetOldestParcellesUseCase();
      const parcelles = await useCase.execute(limit);
      res.json(parcelles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getRecent(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const useCase = new GetRecentParcellesUseCase();
      const parcelles = await useCase.execute(limit);
      res.json(parcelles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const useCase = new UpdateParcelleUseCase();
      const parcelle = await useCase.execute(req.params.id, req.body);
      res.json(parcelle);
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

  async updateCoordinates(req, res) {
    try {
      const useCase = new UpdateParcelleCoordinatesUseCase();
      const parcelle = await useCase.execute(req.params.id, req.body);
      res.json(parcelle);
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

  async updateProduction(req, res) {
    try {
      const useCase = new UpdateParcelleProductionUseCase();
      const parcelle = await useCase.execute(req.params.id, req.body);
      res.json(parcelle);
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

  async updateExpenses(req, res) {
    try {
      const useCase = new UpdateParcelleExpensesUseCase();
      const parcelle = await useCase.execute(req.params.id, req.body);
      res.json(parcelle);
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

  async toggleCertification(req, res) {
    try {
      const useCase = new ToggleCertificationUseCase();
      const parcelle = await useCase.execute(req.params.id);
      res.json(parcelle);
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const useCase = new DeleteParcelleUseCase();
      const result = await useCase.execute(req.params.id);
      res.json(result);
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async deleteByProducteur(req, res) {
    try {
      const useCase = new DeleteParcellesByProducteurUseCase();
      const result = await useCase.execute(req.params.producteurId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ParcelleController();
