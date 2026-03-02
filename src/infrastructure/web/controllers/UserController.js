/**
 * User Controller
 * Handles user management using Clean Architecture use cases
 */

const {
  CreateUserUseCase,
  GetUserUseCase,
  GetAllUsersUseCase,
  GetActiveUsersUseCase,
  GetInactiveUsersUseCase,
  GetUsersByProfileUseCase,
  GetUsersByResponsableUseCase,
  UpdateUserUseCase,
  UpdateUserPasswordUseCase,
  UpdateUserProfileUseCase,
  ToggleUserStatusUseCase,
  ChangePasswordUseCase,
  DeleteUserUseCase,
  DeleteUsersByProfileUseCase
} = require('../../../application/use-cases/user/UserUseCases');

class UserController {

  async create(req, res) {
    try {
      console.log('👤 UserController.create - Début');
      console.log('📦 Données reçues:', JSON.stringify(req.body, null, 2));
      
      const useCase = new CreateUserUseCase();
      console.log('🔧 UseCase créé, exécution...');
      
      const user = await useCase.execute(req.body);
      console.log('✅ Utilisateur créé avec succès:', user?.id || user?._id);
      
      res.status(201).json(user);
    } catch (error) {
      console.error('❌ Erreur UserController.create:', error);
      console.error('📍 Stack:', error.stack);
      
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const useCase = new GetUserUseCase();
      const user = await useCase.execute(req.params.id);
      res.json(user);
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const useCase = new GetAllUsersUseCase();
      // Extract query parameters (limit, skip, etc.) if needed
      const filters = req.query || {};
      const users = await useCase.execute(filters);
      
      // Return in standard format
      res.json({
        success: true,
        data: users,
        total: users.length
      });
    } catch (error) {
      console.error('Error in UserController.getAll:', error);
      res.status(500).json({ 
        success: false,
        error: error.message,
        message: 'Erreur lors de la récupération des utilisateurs'
      });
    }
  }

  async getActive(req, res) {
    try {
      const useCase = new GetActiveUsersUseCase();
      const users = await useCase.execute();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getInactive(req, res) {
    try {
      const useCase = new GetInactiveUsersUseCase();
      const users = await useCase.execute();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getByProfile(req, res) {
    try {
      const useCase = new GetUsersByProfileUseCase();
      const users = await useCase.execute(req.params.profileId);
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getByResponsable(req, res) {
    try {
      const useCase = new GetUsersByResponsableUseCase();
      const users = await useCase.execute(req.params.responsableId);
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const useCase = new UpdateUserUseCase();
      const user = await useCase.execute(req.params.id, req.body);
      res.json(user);
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

  async updatePassword(req, res) {
    try {
      const useCase = new UpdateUserPasswordUseCase();
      const user = await useCase.execute(req.params.id, req.body.password);
      res.json(user);
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

  async updateProfile(req, res) {
    try {
      const useCase = new UpdateUserProfileUseCase();
      const user = await useCase.execute(req.params.id, req.body.profileId);
      res.json(user);
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
      const useCase = new ToggleUserStatusUseCase();
      const user = await useCase.execute(req.params.id);
      res.json(user);
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async changePassword(req, res) {
    try {
      const useCase = new ChangePasswordUseCase();
      const user = await useCase.execute(req.params.id, req.body.currentPassword, req.body.newPassword);
      res.json(user);
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.status(404).json({ error: error.message });
      }
      if (error.name === 'ValidationError' || error.message.includes('Mot de passe')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const useCase = new DeleteUserUseCase();
      const result = await useCase.execute(req.params.id);
      res.json(result);
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async deleteByProfile(req, res) {
    try {
      const useCase = new DeleteUsersByProfileUseCase();
      const result = await useCase.execute(req.params.profileId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new UserController();