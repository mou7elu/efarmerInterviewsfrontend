const {
  CreateProfessionUseCase,
  GetProfessionUseCase,
  GetAllProfessionUseCase,
  UpdateProfessionUseCase,
  DeleteProfessionUseCase,
  CreateNationaliteUseCase,
  GetNationaliteUseCase,
  GetAllNationaliteUseCase,
  UpdateNationaliteUseCase,
  DeleteNationaliteUseCase,
  CreateNiveauScolaireUseCase,
  GetNiveauScolaireUseCase,
  GetAllNiveauScolaireUseCase,
  UpdateNiveauScolaireUseCase,
  DeleteNiveauScolaireUseCase,
  CreatePieceUseCase,
  GetPieceUseCase,
  GetAllPieceUseCase,
  UpdatePieceUseCase,
  DeletePieceUseCase
} = require('../../../application/use-cases/reference/ReferenceUseCases');

/**
 * Reference Data Controller
 * Handles CRUD operations for all reference entities
 */
class ReferenceController {
  // ===== PROFESSION METHODS =====
  
  async createProfession(req, res) {
    try {
      const useCase = new CreateProfessionUseCase();
      const profession = await useCase.execute(req.body);
      res.status(201).json(profession);
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async getProfessionById(req, res) {
    try {
      const useCase = new GetProfessionUseCase();
      const profession = await useCase.execute(req.params.id);
      res.json(profession);
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async getAllProfessions(req, res) {
    try {
      const useCase = new GetAllProfessionUseCase();
      const professions = await useCase.execute();
      res.json(professions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateProfession(req, res) {
    try {
      const useCase = new UpdateProfessionUseCase();
      const profession = await useCase.execute(req.params.id, req.body);
      res.json(profession);
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

  async deleteProfession(req, res) {
    try {
      const useCase = new DeleteProfessionUseCase();
      const result = await useCase.execute(req.params.id);
      res.json(result);
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // ===== NATIONALITE METHODS =====
  
  async createNationalite(req, res) {
    try {
      const useCase = new CreateNationaliteUseCase();
      const nationalite = await useCase.execute(req.body);
      res.status(201).json(nationalite);
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async getNationaliteById(req, res) {
    try {
      const useCase = new GetNationaliteUseCase();
      const nationalite = await useCase.execute(req.params.id);
      res.json(nationalite);
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async getAllNationalites(req, res) {
    try {
      const useCase = new GetAllNationaliteUseCase();
      const nationalites = await useCase.execute();
      res.json(nationalites);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateNationalite(req, res) {
    try {
      const useCase = new UpdateNationaliteUseCase();
      const nationalite = await useCase.execute(req.params.id, req.body);
      res.json(nationalite);
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

  async deleteNationalite(req, res) {
    try {
      const useCase = new DeleteNationaliteUseCase();
      const result = await useCase.execute(req.params.id);
      res.json(result);
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // ===== NIVEAU SCOLAIRE METHODS =====
  
  async createNiveauScolaire(req, res) {
    try {
      const useCase = new CreateNiveauScolaireUseCase();
      const niveauScolaire = await useCase.execute(req.body);
      res.status(201).json(niveauScolaire);
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async getNiveauScolaireById(req, res) {
    try {
      const useCase = new GetNiveauScolaireUseCase();
      const niveauScolaire = await useCase.execute(req.params.id);
      res.json(niveauScolaire);
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async getAllNiveauxScolaires(req, res) {
    try {
      const useCase = new GetAllNiveauScolaireUseCase();
      const niveaux = await useCase.execute();
      res.json(niveaux);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateNiveauScolaire(req, res) {
    try {
      const useCase = new UpdateNiveauScolaireUseCase();
      const niveauScolaire = await useCase.execute(req.params.id, req.body);
      res.json(niveauScolaire);
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

  async deleteNiveauScolaire(req, res) {
    try {
      const useCase = new DeleteNiveauScolaireUseCase();
      const result = await useCase.execute(req.params.id);
      res.json(result);
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // ===== PIECE METHODS =====
  
  async createPiece(req, res) {
    try {
      const useCase = new CreatePieceUseCase();
      const piece = await useCase.execute(req.body);
      res.status(201).json(piece);
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async getPieceById(req, res) {
    try {
      const useCase = new GetPieceUseCase();
      const piece = await useCase.execute(req.params.id);
      res.json(piece);
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async getAllPieces(req, res) {
    try {
      const useCase = new GetAllPieceUseCase();
      const pieces = await useCase.execute();
      res.json(pieces);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updatePiece(req, res) {
    try {
      const useCase = new UpdatePieceUseCase();
      const piece = await useCase.execute(req.params.id, req.body);
      res.json(piece);
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

  async deletePiece(req, res) {
    try {
      const useCase = new DeletePieceUseCase();
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

module.exports = new ReferenceController();
