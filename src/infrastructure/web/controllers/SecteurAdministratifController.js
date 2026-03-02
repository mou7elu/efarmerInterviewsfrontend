const {
  CreateSecteurAdministratifUseCase,
  GetSecteurAdministratifUseCase,
  GetAllSecteurAdministratifUseCase,
  GetSecteurAdministratifBySousprefUseCase,
  UpdateSecteurAdministratifUseCase,
  DeleteSecteurAdministratifUseCase
} = require('../../../application/use-cases/administrative/SecteurAdministratifUseCases');

/**
 * SecteurAdministratif Controller
 */
class SecteurAdministratifController {
  /**
   * Create a new secteur administratif
   */
  async create(req, res) {
    try {
      console.log('SecteurAdministratifController.create - Body:', req.body);
      const useCase = new CreateSecteurAdministratifUseCase();
      console.log('SecteurAdministratifController.create - UseCase created');
      const secteur = await useCase.execute(req.body);
      console.log('SecteurAdministratifController.create - Secteur created:', secteur);
      res.status(201).json(secteur);
    } catch (error) {
      console.error('SecteurAdministratifController.create - Error:', error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get secteur administratif by ID
   */
  async getById(req, res) {
    try {
      const useCase = new GetSecteurAdministratifUseCase();
      const secteur = await useCase.execute(req.params.id);
      res.json(secteur);
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get all secteurs administratifs
   */
  async getAll(req, res) {
    try {
      const useCase = new GetAllSecteurAdministratifUseCase();
      const secteurs = await useCase.execute(req.query);
      res.json(secteurs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get secteurs administratifs by souspref
   */
  async getBySouspref(req, res) {
    try {
      const useCase = new GetSecteurAdministratifBySousprefUseCase();
      const secteurs = await useCase.execute(req.params.sousprefId);
      res.json(secteurs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Update secteur administratif
   */
  async update(req, res) {
    try {
      const useCase = new UpdateSecteurAdministratifUseCase();
      const secteur = await useCase.execute(req.params.id, req.body);
      res.json(secteur);
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
   * Delete secteur administratif
   */
  async delete(req, res) {
    try {
      const useCase = new DeleteSecteurAdministratifUseCase();
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

module.exports = new SecteurAdministratifController();
