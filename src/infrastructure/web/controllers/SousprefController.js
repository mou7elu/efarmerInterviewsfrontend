const {
  CreateSousprefUseCase,
  GetSousprefUseCase,
  GetAllSousprefUseCase,
  GetSousprefByDepartementUseCase,
  UpdateSousprefUseCase,
  DeleteSousprefUseCase
} = require('../../../application/use-cases/administrative/SousprefUseCases');

/**
 * Souspref Controller
 */
class SousprefController {
  /**
   * Create a new souspref
   */
  async create(req, res) {
    try {
      console.log('SousprefController.create - Body:', req.body);
      const useCase = new CreateSousprefUseCase();
      const souspref = await useCase.execute(req.body);
      res.status(201).json(souspref);
    } catch (error) {
      console.error('SousprefController.create - Error:', error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get souspref by ID
   */
  async getById(req, res) {
    try {
      const useCase = new GetSousprefUseCase();
      const souspref = await useCase.execute(req.params.id);
      res.json(souspref);
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get all souspref
   */
  async getAll(req, res) {
    try {
      const useCase = new GetAllSousprefUseCase();
      const souspref = await useCase.execute(req.query);
      res.json(souspref);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get souspref by departement
   */
  async getByDepartement(req, res) {
    try {
      const useCase = new GetSousprefByDepartementUseCase();
      const souspref = await useCase.execute(req.params.departementId);
      res.json(souspref);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Update souspref
   */
  async update(req, res) {
    try {
      const useCase = new UpdateSousprefUseCase();
      const souspref = await useCase.execute(req.params.id, req.body);
      res.json(souspref);
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
   * Delete souspref
   */
  async delete(req, res) {
    try {
      const useCase = new DeleteSousprefUseCase();
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

module.exports = new SousprefController();
