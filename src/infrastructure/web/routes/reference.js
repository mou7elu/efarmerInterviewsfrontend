const express = require('express');
const { protect } = require('../../../../middleware/auth');

const router = express.Router();

// Middleware d'authentification pour toutes les routes de référence
router.use(protect);

// ===========================================
// ROUTES POUR LES PROFESSIONS
// ===========================================

router.get('/professions', async (req, res) => {
  try {
    const Profession = require('../../../../models/Profession');
    const professions = await Profession.find().sort({ Lib_Profession: 1 });
    res.json(professions.map(p => p.toDTO()));
  } catch (error) {
    console.error('Erreur récupération professions:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des professions',
      error: error.message 
    });
  }
});

router.get('/professions/:id', async (req, res) => {
  try {
    const Profession = require('../../../../models/Profession');
    const profession = await Profession.findById(req.params.id);
    
    if (!profession) {
      return res.status(404).json({ message: 'Profession non trouvée' });
    }
    
    res.json(profession.toDTO());
  } catch (error) {
    console.error('Erreur récupération profession:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération de la profession',
      error: error.message 
    });
  }
});

router.post('/professions', async (req, res) => {
  try {
    const Profession = require('../../../../models/Profession');
    const { Lib_Profession } = req.body;

    if (!Lib_Profession || !Lib_Profession.trim()) {
      return res.status(400).json({ message: 'Le libellé de la profession est requis' });
    }

    const profession = new Profession({ Lib_Profession: Lib_Profession.trim() });
    const saved = await profession.save();
    
    res.status(201).json(saved.toDTO());
  } catch (error) {
    console.error('Erreur création profession:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création de la profession',
      error: error.message 
    });
  }
});

router.put('/professions/:id', async (req, res) => {
  try {
    const Profession = require('../../../../models/Profession');
    const { Lib_Profession } = req.body;

    if (!Lib_Profession || !Lib_Profession.trim()) {
      return res.status(400).json({ message: 'Le libellé de la profession est requis' });
    }

    const profession = await Profession.findByIdAndUpdate(
      req.params.id,
      { Lib_Profession: Lib_Profession.trim() },
      { new: true, runValidators: true }
    );

    if (!profession) {
      return res.status(404).json({ message: 'Profession non trouvée' });
    }

    res.json(profession.toDTO());
  } catch (error) {
    console.error('Erreur mise à jour profession:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour de la profession',
      error: error.message 
    });
  }
});

router.delete('/professions/:id', async (req, res) => {
  try {
    const Profession = require('../../../../models/Profession');
    const profession = await Profession.findByIdAndDelete(req.params.id);

    if (!profession) {
      return res.status(404).json({ message: 'Profession non trouvée' });
    }

    res.json({ message: 'Profession supprimée avec succès' });
  } catch (error) {
    console.error('Erreur suppression profession:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la suppression de la profession',
      error: error.message 
    });
  }
});

// ===========================================
// ROUTES POUR LES NATIONALITÉS
// ===========================================

router.get('/nationalites', async (req, res) => {
  try {
    const Nationalite = require('../../../../models/Nationalite');
    const nationalites = await Nationalite.find().sort({ Lib_Nation: 1 });
    res.json(nationalites.map(n => ({
      id: n._id,
      Lib_Nation: n.Lib_Nation,
      createdAt: n.createdAt,
      updatedAt: n.updatedAt
    })));
  } catch (error) {
    console.error('Erreur récupération nationalités:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des nationalités',
      error: error.message 
    });
  }
});

router.get('/nationalites/:id', async (req, res) => {
  try {
    const Nationalite = require('../../../../models/Nationalite');
    const nationalite = await Nationalite.findById(req.params.id);
    
    if (!nationalite) {
      return res.status(404).json({ message: 'Nationalité non trouvée' });
    }
    
    res.json({
      id: nationalite._id,
      Lib_Nation: nationalite.Lib_Nation,
      createdAt: nationalite.createdAt,
      updatedAt: nationalite.updatedAt
    });
  } catch (error) {
    console.error('Erreur récupération nationalité:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération de la nationalité',
      error: error.message 
    });
  }
});

router.post('/nationalites', async (req, res) => {
  try {
    const Nationalite = require('../../../../models/Nationalite');
    const { Lib_Nation } = req.body;

    if (!Lib_Nation || !Lib_Nation.trim()) {
      return res.status(400).json({ message: 'Le libellé de la nationalité est requis' });
    }

    const nationalite = new Nationalite({ Lib_Nation: Lib_Nation.trim() });
    const saved = await nationalite.save();
    
    res.status(201).json({
      id: saved._id,
      Lib_Nation: saved.Lib_Nation,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt
    });
  } catch (error) {
    console.error('Erreur création nationalité:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création de la nationalité',
      error: error.message 
    });
  }
});

router.put('/nationalites/:id', async (req, res) => {
  try {
    const Nationalite = require('../../../../models/Nationalite');
    const { Lib_Nation } = req.body;

    if (!Lib_Nation || !Lib_Nation.trim()) {
      return res.status(400).json({ message: 'Le libellé de la nationalité est requis' });
    }

    const nationalite = await Nationalite.findByIdAndUpdate(
      req.params.id,
      { Lib_Nation: Lib_Nation.trim() },
      { new: true, runValidators: true }
    );

    if (!nationalite) {
      return res.status(404).json({ message: 'Nationalité non trouvée' });
    }

    res.json({
      id: nationalite._id,
      Lib_Nation: nationalite.Lib_Nation,
      createdAt: nationalite.createdAt,
      updatedAt: nationalite.updatedAt
    });
  } catch (error) {
    console.error('Erreur mise à jour nationalité:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour de la nationalité',
      error: error.message 
    });
  }
});

router.delete('/nationalites/:id', async (req, res) => {
  try {
    const Nationalite = require('../../../../models/Nationalite');
    const nationalite = await Nationalite.findByIdAndDelete(req.params.id);

    if (!nationalite) {
      return res.status(404).json({ message: 'Nationalité non trouvée' });
    }

    res.json({ message: 'Nationalité supprimée avec succès' });
  } catch (error) {
    console.error('Erreur suppression nationalité:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la suppression de la nationalité',
      error: error.message 
    });
  }
});

// ===========================================
// ROUTES POUR LES NIVEAUX SCOLAIRES
// ===========================================

router.get('/niveaux-scolaires', async (req, res) => {
  try {
    const NiveauScolaire = require('../../../../models/NiveauScolaire');
    const niveaux = await NiveauScolaire.find().sort({ Lib_NiveauScolaire: 1 });
    res.json(niveaux.map(n => ({
      id: n._id,
      Lib_NiveauScolaire: n.Lib_NiveauScolaire,
      createdAt: n.createdAt,
      updatedAt: n.updatedAt
    })));
  } catch (error) {
    console.error('Erreur récupération niveaux scolaires:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des niveaux scolaires',
      error: error.message 
    });
  }
});

router.get('/niveaux-scolaires/:id', async (req, res) => {
  try {
    const NiveauScolaire = require('../../../../models/NiveauScolaire');
    const niveau = await NiveauScolaire.findById(req.params.id);
    
    if (!niveau) {
      return res.status(404).json({ message: 'Niveau scolaire non trouvé' });
    }
    
    res.json({
      id: niveau._id,
      Lib_NiveauScolaire: niveau.Lib_NiveauScolaire,
      createdAt: niveau.createdAt,
      updatedAt: niveau.updatedAt
    });
  } catch (error) {
    console.error('Erreur récupération niveau scolaire:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération du niveau scolaire',
      error: error.message 
    });
  }
});

router.post('/niveaux-scolaires', async (req, res) => {
  try {
    const NiveauScolaire = require('../../../../models/NiveauScolaire');
    const { Lib_NiveauScolaire } = req.body;

    if (!Lib_NiveauScolaire || !Lib_NiveauScolaire.trim()) {
      return res.status(400).json({ message: 'Le libellé du niveau scolaire est requis' });
    }

    const niveau = new NiveauScolaire({ Lib_NiveauScolaire: Lib_NiveauScolaire.trim() });
    const saved = await niveau.save();
    
    res.status(201).json({
      id: saved._id,
      Lib_NiveauScolaire: saved.Lib_NiveauScolaire,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt
    });
  } catch (error) {
    console.error('Erreur création niveau scolaire:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création du niveau scolaire',
      error: error.message 
    });
  }
});

router.put('/niveaux-scolaires/:id', async (req, res) => {
  try {
    const NiveauScolaire = require('../../../../models/NiveauScolaire');
    const { Lib_NiveauScolaire } = req.body;

    if (!Lib_NiveauScolaire || !Lib_NiveauScolaire.trim()) {
      return res.status(400).json({ message: 'Le libellé du niveau scolaire est requis' });
    }

    const niveau = await NiveauScolaire.findByIdAndUpdate(
      req.params.id,
      { Lib_NiveauScolaire: Lib_NiveauScolaire.trim() },
      { new: true, runValidators: true }
    );

    if (!niveau) {
      return res.status(404).json({ message: 'Niveau scolaire non trouvé' });
    }

    res.json({
      id: niveau._id,
      Lib_NiveauScolaire: niveau.Lib_NiveauScolaire,
      createdAt: niveau.createdAt,
      updatedAt: niveau.updatedAt
    });
  } catch (error) {
    console.error('Erreur mise à jour niveau scolaire:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour du niveau scolaire',
      error: error.message 
    });
  }
});

router.delete('/niveaux-scolaires/:id', async (req, res) => {
  try {
    const NiveauScolaire = require('../../../../models/NiveauScolaire');
    const niveau = await NiveauScolaire.findByIdAndDelete(req.params.id);

    if (!niveau) {
      return res.status(404).json({ message: 'Niveau scolaire non trouvé' });
    }

    res.json({ message: 'Niveau scolaire supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression niveau scolaire:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la suppression du niveau scolaire',
      error: error.message 
    });
  }
});

// ===========================================
// ROUTES POUR LES PIÈCES
// ===========================================

router.get('/pieces', async (req, res) => {
  try {
    const Piece = require('../../../../models/Piece');
    const pieces = await Piece.find().sort({ Nom_piece: 1 });
    res.json(pieces.map(p => ({
      id: p._id,
      Nom_piece: p.Nom_piece,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt
    })));
  } catch (error) {
    console.error('Erreur récupération pièces:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des pièces',
      error: error.message 
    });
  }
});

router.get('/pieces/:id', async (req, res) => {
  try {
    const Piece = require('../../../../models/Piece');
    const piece = await Piece.findById(req.params.id);
    
    if (!piece) {
      return res.status(404).json({ message: 'Pièce non trouvée' });
    }
    
    res.json({
      id: piece._id,
      Nom_piece: piece.Nom_piece,
      createdAt: piece.createdAt,
      updatedAt: piece.updatedAt
    });
  } catch (error) {
    console.error('Erreur récupération pièce:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération de la pièce',
      error: error.message 
    });
  }
});

router.post('/pieces', async (req, res) => {
  try {
    const Piece = require('../../../../models/Piece');
    const { Nom_piece } = req.body;

    if (!Nom_piece || !Nom_piece.trim()) {
      return res.status(400).json({ message: 'Le nom de la pièce est requis' });
    }

    const piece = new Piece({ Nom_piece: Nom_piece.trim() });
    const saved = await piece.save();
    
    res.status(201).json({
      id: saved._id,
      Nom_piece: saved.Nom_piece,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt
    });
  } catch (error) {
    console.error('Erreur création pièce:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création de la pièce',
      error: error.message 
    });
  }
});

router.put('/pieces/:id', async (req, res) => {
  try {
    const Piece = require('../../../../models/Piece');
    const { Nom_piece } = req.body;

    if (!Nom_piece || !Nom_piece.trim()) {
      return res.status(400).json({ message: 'Le nom de la pièce est requis' });
    }

    const piece = await Piece.findByIdAndUpdate(
      req.params.id,
      { Nom_piece: Nom_piece.trim() },
      { new: true, runValidators: true }
    );

    if (!piece) {
      return res.status(404).json({ message: 'Pièce non trouvée' });
    }

    res.json({
      id: piece._id,
      Nom_piece: piece.Nom_piece,
      createdAt: piece.createdAt,
      updatedAt: piece.updatedAt
    });
  } catch (error) {
    console.error('Erreur mise à jour pièce:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour de la pièce',
      error: error.message 
    });
  }
});

router.delete('/pieces/:id', async (req, res) => {
  try {
    const Piece = require('../../../../models/Piece');
    const piece = await Piece.findByIdAndDelete(req.params.id);

    if (!piece) {
      return res.status(404).json({ message: 'Pièce non trouvée' });
    }

    res.json({ message: 'Pièce supprimée avec succès' });
  } catch (error) {
    console.error('Erreur suppression pièce:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la suppression de la pièce',
      error: error.message 
    });
  }
});

module.exports = router;
