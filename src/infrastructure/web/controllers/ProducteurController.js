const {
  CreateProducteurUseCase,
  GetProducteurUseCase,
  GetAllProducteursUseCase,
  GetProducteursByMenageUseCase,
  GetProducteursStatisticsUseCase,
  GetProducteursWithMobileMoneyUseCase,
  GetExploitantsUseCase,
  GetProducteursByAgeRangeUseCase,
  GetProducteursByGenderUseCase,
  GetProducteursByNationaliteUseCase,
  GetProducteursByProfessionUseCase,
  UpdateProducteurUseCase,
  UpdateProducteurCoordinatesUseCase,
  UpdateProducteurContactUseCase,
  ToggleProducteurStatusUseCase,
  DeleteProducteurUseCase
} = require('../../../application/use-cases/agricultural/ProducteurUseCases');

/**
 * Producteur Controller
 * Handles farmer/producer management
 */
class ProducteurController {
  async create(req, res) {
    try {
      console.log('ProducteurController.create - start');
      console.log('ProducteurController.create - body:', JSON.stringify(req.body, null, 2));
      const useCase = new CreateProducteurUseCase();
      const producteur = await useCase.execute(req.body);
      console.log('ProducteurController.create - created:', producteur?.id || producteur?._id || producteur?.Code);
      res.status(201).json(producteur);
    } catch (error) {
      console.error('ProducteurController.create - error:', error.message);
      console.error('ProducteurController.create - stack:', error.stack);
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const useCase = new GetProducteurUseCase();
      const producteur = await useCase.execute(req.params.id);
      res.json(producteur);
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const useCase = new GetAllProducteursUseCase();
      const producteurs = await useCase.execute();
      res.json(producteurs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getByMenage(req, res) {
    try {
      const useCase = new GetProducteursByMenageUseCase();
      const producteurs = await useCase.execute(req.params.menageId);
      res.json(producteurs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getStatistics(req, res) {
    try {
      const useCase = new GetProducteursStatisticsUseCase();
      const statistics = await useCase.execute();
      res.json(statistics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getWithMobileMoney(req, res) {
    try {
      const useCase = new GetProducteursWithMobileMoneyUseCase();
      const producteurs = await useCase.execute();
      res.json(producteurs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getExploitants(req, res) {
    try {
      const useCase = new GetExploitantsUseCase();
      const exploitants = await useCase.execute();
      res.json(exploitants);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getByAgeRange(req, res) {
    try {
      const { minAge, maxAge } = req.query;
      if (!minAge || !maxAge) {
        return res.status(400).json({ error: 'minAge and maxAge query parameters are required' });
      }

      const useCase = new GetProducteursByAgeRangeUseCase();
      const producteurs = await useCase.execute(parseInt(minAge), parseInt(maxAge));
      res.json(producteurs);
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async getByGender(req, res) {
    try {
      const useCase = new GetProducteursByGenderUseCase();
      const producteurs = await useCase.execute(req.params.gender);
      res.json(producteurs);
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async getByNationalite(req, res) {
    try {
      const useCase = new GetProducteursByNationaliteUseCase();
      const producteurs = await useCase.execute(req.params.nationaliteId);
      res.json(producteurs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getByProfession(req, res) {
    try {
      const useCase = new GetProducteursByProfessionUseCase();
      const producteurs = await useCase.execute(req.params.professionId);
      res.json(producteurs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const useCase = new UpdateProducteurUseCase();
      const producteur = await useCase.execute(req.params.id, req.body);
      res.json(producteur);
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
      const useCase = new UpdateProducteurCoordinatesUseCase();
      const producteur = await useCase.execute(req.params.id, req.body);
      res.json(producteur);
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

  async updateContact(req, res) {
    try {
      const useCase = new UpdateProducteurContactUseCase();
      const producteur = await useCase.execute(req.params.id, req.body);
      res.json(producteur);
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
      const useCase = new ToggleProducteurStatusUseCase();
      const producteur = await useCase.execute(req.params.id);
      res.json(producteur);
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const useCase = new DeleteProducteurUseCase();
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

module.exports = new ProducteurController();
