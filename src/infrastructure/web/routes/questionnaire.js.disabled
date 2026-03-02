const express = require('express');
const { Volet, Section, Question, Questionnaire } = require('../../../../models');

const router = express.Router();

// ===========================================
// ROUTES POUR LES QUESTIONNAIRES
// ===========================================

// GET /api/questionnaire/questionnaires (pour compatibilité avec l'API frontend)
router.get('/questionnaires', async (req, res) => {
  try {
    const questionnaires = await Questionnaire.find()
      .sort({ createdAt: -1 });
    
    res.json(questionnaires);
  } catch (error) {
    console.error('Erreur lors de la récupération des questionnaires:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des questionnaires',
      error: error.message 
    });
  }
});

// GET /api/questionnaire/questionnaires/:id
router.get('/questionnaires/:id', async (req, res) => {
  try {
    const questionnaire = await Questionnaire.findById(req.params.id);
    
    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire non trouvé' });
    }
    
    res.json(questionnaire);
  } catch (error) {
    console.error('Erreur lors de la récupération du questionnaire:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'ID de questionnaire invalide' 
      });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la récupération du questionnaire',
      error: error.message 
    });
  }
});

// POST /api/questionnaire/questionnaires
router.post('/questionnaires', async (req, res) => {
  try {
    const { titre, version, description } = req.body;
    
    if (!titre) {
      return res.status(400).json({ 
        message: 'Le champ titre est requis' 
      });
    }
    
    const questionnaire = new Questionnaire({
      titre,
      version: version || '1.0',
      description: description || ''
    });
    
    const savedQuestionnaire = await questionnaire.save();
    
    res.status(201).json(savedQuestionnaire);
  } catch (error) {
    console.error('Erreur lors de la création du questionnaire:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Données invalides',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la création du questionnaire',
      error: error.message 
    });
  }
});

// PUT /api/questionnaire/questionnaires/:id
router.put('/questionnaires/:id', async (req, res) => {
  try {
    const { titre, version, description } = req.body;
    
    const questionnaire = await Questionnaire.findByIdAndUpdate(
      req.params.id,
      { titre, version, description },
      { new: true, runValidators: true }
    );
    
    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire non trouvé' });
    }
    
    res.json(questionnaire);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du questionnaire:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'ID de questionnaire invalide' 
      });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Données invalides',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour du questionnaire',
      error: error.message 
    });
  }
});

// DELETE /api/questionnaire/questionnaires/:id
router.delete('/questionnaires/:id', async (req, res) => {
  try {
    const questionnaire = await Questionnaire.findByIdAndDelete(req.params.id);
    
    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire non trouvé' });
    }
    
    res.json({ message: 'Questionnaire supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du questionnaire:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'ID de questionnaire invalide' 
      });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la suppression du questionnaire',
      error: error.message 
    });
  }
});

// ===========================================
// ROUTES POUR LES VOLETS
// ===========================================

// GET /api/questionnaire/volets
router.get('/volets', async (req, res) => {
  try {
    const volets = await Volet.find()
      .populate('questionnaireId', 'titre')
      .sort({ ordre: 1 });
    
    res.json(volets);
  } catch (error) {
    console.error('Erreur lors de la récupération des volets:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des volets',
      error: error.message 
    });
  }
});

// GET /api/questionnaire/volets/:id
router.get('/volets/:id', async (req, res) => {
  try {
    const volet = await Volet.findById(req.params.id)
      .populate('questionnaireId', 'titre');
    
    if (!volet) {
      return res.status(404).json({ message: 'Volet non trouvé' });
    }
    
    res.json(volet);
  } catch (error) {
    console.error('Erreur lors de la récupération du volet:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'ID de volet invalide' 
      });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la récupération du volet',
      error: error.message 
    });
  }
});

// POST /api/questionnaire/volets
router.post('/volets', async (req, res) => {
  try {
    const { titre, ordre, questionnaireId } = req.body;
    
    if (!titre || !ordre || !questionnaireId) {
      return res.status(400).json({ 
        message: 'Les champs titre, ordre et questionnaireId sont requis' 
      });
    }
    
    const volet = new Volet({ titre, ordre, questionnaireId });
    const savedVolet = await volet.save();
    const populatedVolet = await Volet.findById(savedVolet._id)
      .populate('questionnaireId', 'titre');
    
    res.status(201).json(populatedVolet);
  } catch (error) {
    console.error('Erreur lors de la création du volet:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Données invalides',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la création du volet',
      error: error.message 
    });
  }
});

// PUT /api/questionnaire/volets/:id
router.put('/volets/:id', async (req, res) => {
  try {
    const { titre, ordre, questionnaireId } = req.body;
    
    const volet = await Volet.findByIdAndUpdate(
      req.params.id,
      { titre, ordre, questionnaireId },
      { new: true, runValidators: true }
    ).populate('questionnaireId', 'titre');
    
    if (!volet) {
      return res.status(404).json({ message: 'Volet non trouvé' });
    }
    
    res.json(volet);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du volet:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'ID de volet invalide' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Données invalides',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour du volet',
      error: error.message 
    });
  }
});

// DELETE /api/questionnaire/volets/:id
router.delete('/volets/:id', async (req, res) => {
  try {
    const volet = await Volet.findByIdAndDelete(req.params.id);
    
    if (!volet) {
      return res.status(404).json({ message: 'Volet non trouvé' });
    }
    
    res.json({ message: 'Volet supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du volet:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'ID de volet invalide' });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la suppression du volet',
      error: error.message 
    });
  }
});

// ===========================================
// ROUTES POUR LES SECTIONS
// ===========================================

// GET /api/questionnaire/sections
router.get('/sections', async (req, res) => {
  try {
    const sections = await Section.find()
      .populate('voletId', 'titre ordre')
      .sort({ ordre: 1 });
    
    res.json(sections);
  } catch (error) {
    console.error('Erreur lors de la récupération des sections:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des sections',
      error: error.message 
    });
  }
});

// GET /api/questionnaire/sections/:id
router.get('/sections/:id', async (req, res) => {
  try {
    const section = await Section.findById(req.params.id)
      .populate('voletId', 'titre ordre');
    
    if (!section) {
      return res.status(404).json({ message: 'Section non trouvée' });
    }
    
    res.json(section);
  } catch (error) {
    console.error('Erreur lors de la récupération de la section:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'ID de section invalide' });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la récupération de la section',
      error: error.message 
    });
  }
});

// POST /api/questionnaire/sections
router.post('/sections', async (req, res) => {
  try {
    const { titre, ordre, voletId } = req.body;
    
    if (!titre || !ordre || !voletId) {
      return res.status(400).json({ 
        message: 'Les champs titre, ordre et voletId sont requis' 
      });
    }
    
    const section = new Section({ titre, ordre, voletId });
    const savedSection = await section.save();
    const populatedSection = await Section.findById(savedSection._id)
      .populate('voletId', 'titre ordre');
    
    res.status(201).json(populatedSection);
  } catch (error) {
    console.error('Erreur lors de la création de la section:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Données invalides',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la création de la section',
      error: error.message 
    });
  }
});

// PUT /api/questionnaire/sections/:id
router.put('/sections/:id', async (req, res) => {
  try {
    const { titre, ordre, voletId } = req.body;
    
    const section = await Section.findByIdAndUpdate(
      req.params.id,
      { titre, ordre, voletId },
      { new: true, runValidators: true }
    ).populate('voletId', 'titre ordre');
    
    if (!section) {
      return res.status(404).json({ message: 'Section non trouvée' });
    }
    
    res.json(section);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la section:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'ID de section invalide' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Données invalides',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour de la section',
      error: error.message 
    });
  }
});

// DELETE /api/questionnaire/sections/:id
router.delete('/sections/:id', async (req, res) => {
  try {
    const section = await Section.findByIdAndDelete(req.params.id);
    
    if (!section) {
      return res.status(404).json({ message: 'Section non trouvée' });
    }
    
    res.json({ message: 'Section supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la section:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'ID de section invalide' });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la suppression de la section',
      error: error.message 
    });
  }
});

// GET /api/questionnaire/sections/volet/:voletId
router.get('/sections/volet/:voletId', async (req, res) => {
  try {
    const sections = await Section.find({ voletId: req.params.voletId })
      .populate('voletId', 'titre ordre')
      .sort({ ordre: 1 });
    
    res.json(sections);
  } catch (error) {
    console.error('Erreur lors de la récupération des sections par volet:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'ID de volet invalide' });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des sections',
      error: error.message 
    });
  }
});

// ===========================================
// ROUTES POUR LES QUESTIONS
// ===========================================

// GET /api/questionnaire/questions
router.get('/questions', async (req, res) => {
  try {
    const questions = await Question.find()
      .populate('sectionId', 'titre ordre')
      .populate('voletId', 'titre ordre')
      .sort({ 'voletId.ordre': 1, 'sectionId.ordre': 1 });
    
    res.json(questions);
  } catch (error) {
    console.error('Erreur lors de la récupération des questions:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des questions',
      error: error.message 
    });
  }
});

// GET /api/questionnaire/questions/:id
router.get('/questions/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('sectionId', 'titre ordre')
      .populate('voletId', 'titre ordre');
    
    if (!question) {
      return res.status(404).json({ message: 'Question non trouvée' });
    }
    
    res.json(question);
  } catch (error) {
    console.error('Erreur lors de la récupération de la question:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'ID de question invalide' });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la récupération de la question',
      error: error.message 
    });
  }
});

// POST /api/questionnaire/questions
router.post('/questions', async (req, res) => {
  try {
    const { 
      code, texte, type, obligatoire, unite, automatique, 
      options, sectionId, voletId, referenceTable, referenceField 
    } = req.body;
    
    if (!code || !texte || !type || !sectionId || !voletId) {
      return res.status(400).json({ 
        message: 'Les champs code, texte, type, sectionId et voletId sont requis' 
      });
    }
    
    const question = new Question({
      code, texte, type,
      obligatoire: obligatoire || false,
      unite, automatique: automatique || false,
      options: options || [],
      sectionId, voletId,
      referenceTable: referenceTable || '',
      referenceField: referenceField || ''
    });
    
    const savedQuestion = await question.save();
    const populatedQuestion = await Question.findById(savedQuestion._id)
      .populate('sectionId', 'titre ordre')
      .populate('voletId', 'titre ordre');
    
    res.status(201).json(populatedQuestion);
  } catch (error) {
    console.error('Erreur lors de la création de la question:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Données invalides',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Ce code de question existe déjà' });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la création de la question',
      error: error.message 
    });
  }
});

// PUT /api/questionnaire/questions/:id
router.put('/questions/:id', async (req, res) => {
  try {
    const { 
      code, texte, type, obligatoire, unite, automatique, 
      options, sectionId, voletId, referenceTable, referenceField 
    } = req.body;
    
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      {
        code, texte, type, obligatoire, unite, automatique,
        options, sectionId, voletId, referenceTable, referenceField
      },
      { new: true, runValidators: true }
    ).populate('sectionId', 'titre ordre')
     .populate('voletId', 'titre ordre');
    
    if (!question) {
      return res.status(404).json({ message: 'Question non trouvée' });
    }
    
    res.json(question);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la question:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'ID de question invalide' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Données invalides',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Ce code de question existe déjà' });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour de la question',
      error: error.message 
    });
  }
});

// DELETE /api/questionnaire/questions/:id
router.delete('/questions/:id', async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question non trouvée' });
    }
    
    res.json({ message: 'Question supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la question:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'ID de question invalide' });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la suppression de la question',
      error: error.message 
    });
  }
});

// GET /api/questionnaire/questions/section/:sectionId
router.get('/questions/section/:sectionId', async (req, res) => {
  try {
    const questions = await Question.find({ sectionId: req.params.sectionId })
      .populate('sectionId', 'titre ordre')
      .populate('voletId', 'titre ordre')
      .sort({ createdAt: 1 });
    
    res.json(questions);
  } catch (error) {
    console.error('Erreur lors de la récupération des questions par section:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'ID de section invalide' });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des questions',
      error: error.message 
    });
  }
});

// GET /api/questionnaire/questions/volet/:voletId
router.get('/questions/volet/:voletId', async (req, res) => {
  try {
    const questions = await Question.find({ voletId: req.params.voletId })
      .populate('sectionId', 'titre ordre')
      .populate('voletId', 'titre ordre')
      .sort({ 'sectionId.ordre': 1, createdAt: 1 });
    
    res.json(questions);
  } catch (error) {
    console.error('Erreur lors de la récupération des questions par volet:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'ID de volet invalide' });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des questions',
      error: error.message 
    });
  }
});

module.exports = router;