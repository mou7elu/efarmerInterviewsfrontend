const {
  CreateProfileUseCase,
  GetProfileUseCase,
  GetAllProfilesUseCase,
  GetProfilesWithPermissionUseCase,
  UpdateProfileUseCase,
  UpdateProfilePermissionsUseCase,
  CheckProfilePermissionUseCase,
  DeleteProfileUseCase
} = require('../../../application/use-cases/user/ProfileUseCases');

/**
 * Profile Controller
 * Handles profile and permission management
 */
class ProfileController {
  async create(req, res) {
    try {
      const useCase = new CreateProfileUseCase();
      const profile = await useCase.execute(req.body);
      res.status(201).json(profile);
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const useCase = new GetProfileUseCase();
      const profile = await useCase.execute(req.params.id);
      res.json(profile);
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const useCase = new GetAllProfilesUseCase();
      const profiles = await useCase.execute();
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getWithPermission(req, res) {
    try {
      const useCase = new GetProfilesWithPermissionUseCase();
      const profiles = await useCase.execute(req.params.permission);
      res.json(profiles);
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const useCase = new UpdateProfileUseCase();
      const profile = await useCase.execute(req.params.id, req.body);
      res.json(profile);
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

  async updatePermissions(req, res) {
    try {
      const useCase = new UpdateProfilePermissionsUseCase();
      const profile = await useCase.execute(req.params.id, req.body.permissions);
      res.json(profile);
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

  async checkPermission(req, res) {
    try {
      const useCase = new CheckProfilePermissionUseCase();
      const hasPermission = await useCase.execute(req.params.id, req.params.permission);
      res.json({ hasPermission });
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const useCase = new DeleteProfileUseCase();
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

module.exports = new ProfileController();
