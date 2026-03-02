const express = require('express');
const { protect } = require('../../../../middleware/auth');

const router = express.Router();

// Middleware d'authentification
router.use(protect);

// ===========================================
// ROUTES POUR LES DÉPARTEMENTS
// ===========================================

router.get('/departements', async (req, res) => {
  try {
    const Departement = require('../../../../models/Departement');
    const departements = await Departement.find()
      .populate('RegionId', 'Lib_region')
      .sort({ Lib_departement: 1 });
    
    res.json(departements.map(d => ({
      id: d._id,
      Lib_departement: d.Lib_departement,
      Cod_departement: d.Cod_departement,
      RegionId: d.RegionId,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt
    })));
  } catch (error) {
    console.error('Erreur récupération départements:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des départements',
      error: error.message 
    });
  }
});

router.get('/departements/:id', async (req, res) => {
  try {
    const Departement = require('../../../../models/Departement');
    const departement = await Departement.findById(req.params.id)
      .populate('RegionId', 'Lib_region');
    
    if (!departement) {
      return res.status(404).json({ message: 'Département non trouvé' });
    }
    
    res.json({
      id: departement._id,
      Lib_departement: departement.Lib_departement,
      Cod_departement: departement.Cod_departement,
      RegionId: departement.RegionId,
      createdAt: departement.createdAt,
      updatedAt: departement.updatedAt
    });
  } catch (error) {
    console.error('Erreur récupération département:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération du département',
      error: error.message 
    });
  }
});

router.post('/departements', async (req, res) => {
  try {
    const Departement = require('../../../../models/Departement');
    const { Lib_departement, Cod_departement, RegionId } = req.body;

    if (!Lib_departement || !Cod_departement || !RegionId) {
      return res.status(400).json({ 
        message: 'Les champs Lib_departement, Cod_departement et RegionId sont requis' 
      });
    }

    const departement = new Departement({ Lib_departement, Cod_departement, RegionId });
    const saved = await departement.save();
    await saved.populate('RegionId', 'Lib_region');
    
    res.status(201).json({
      id: saved._id,
      Lib_departement: saved.Lib_departement,
      Cod_departement: saved.Cod_departement,
      RegionId: saved.RegionId,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt
    });
  } catch (error) {
    console.error('Erreur création département:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création du département',
      error: error.message 
    });
  }
});

router.put('/departements/:id', async (req, res) => {
  try {
    const Departement = require('../../../../models/Departement');
    const { Lib_departement, Cod_departement, RegionId } = req.body;

    const departement = await Departement.findByIdAndUpdate(
      req.params.id,
      { Lib_departement, Cod_departement, RegionId },
      { new: true, runValidators: true }
    ).populate('RegionId', 'Lib_region');

    if (!departement) {
      return res.status(404).json({ message: 'Département non trouvé' });
    }

    res.json({
      id: departement._id,
      Lib_departement: departement.Lib_departement,
      Cod_departement: departement.Cod_departement,
      RegionId: departement.RegionId,
      createdAt: departement.createdAt,
      updatedAt: departement.updatedAt
    });
  } catch (error) {
    console.error('Erreur mise à jour département:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour du département',
      error: error.message 
    });
  }
});

router.delete('/departements/:id', async (req, res) => {
  try {
    const Departement = require('../../../../models/Departement');
    const departement = await Departement.findByIdAndDelete(req.params.id);

    if (!departement) {
      return res.status(404).json({ message: 'Département non trouvé' });
    }

    res.json({ message: 'Département supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression département:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la suppression du département',
      error: error.message 
    });
  }
});

// Route pour récupérer les départements par région
router.get('/regions/:regionId/departements', async (req, res) => {
  try {
    const Departement = require('../../../../models/Departement');
    const departements = await Departement.find({ RegionId: req.params.regionId })
      .populate('RegionId', 'Lib_region')
      .sort({ Lib_departement: 1 });
    
    res.json(departements.map(d => ({
      id: d._id,
      Lib_departement: d.Lib_departement,
      Cod_departement: d.Cod_departement,
      RegionId: d.RegionId,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt
    })));
  } catch (error) {
    console.error('Erreur récupération départements par région:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des départements',
      error: error.message 
    });
  }
});

// ===========================================
// ROUTES POUR LES SOUS-PRÉFECTURES
// ===========================================

router.get('/sousprefectures', async (req, res) => {
  try {
    const Souspref = require('../../../../models/Souspref');
    const sousprefectures = await Souspref.find()
      .populate('DepartementId', 'Lib_departement')
      .sort({ Lib_souspref: 1 });
    
    res.json(sousprefectures.map(s => ({
      id: s._id,
      Lib_souspref: s.Lib_souspref,
      Cod_souspref: s.Cod_souspref,
      DepartementId: s.DepartementId,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt
    })));
  } catch (error) {
    console.error('Erreur récupération sous-préfectures:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des sous-préfectures',
      error: error.message 
    });
  }
});

router.get('/sousprefectures/:id', async (req, res) => {
  try {
    const Souspref = require('../../../../models/Souspref');
    const souspref = await Souspref.findById(req.params.id)
      .populate('DepartementId', 'Lib_departement');
    
    if (!souspref) {
      return res.status(404).json({ message: 'Sous-préfecture non trouvée' });
    }
    
    res.json({
      id: souspref._id,
      Lib_souspref: souspref.Lib_souspref,
      Cod_souspref: souspref.Cod_souspref,
      DepartementId: souspref.DepartementId,
      createdAt: souspref.createdAt,
      updatedAt: souspref.updatedAt
    });
  } catch (error) {
    console.error('Erreur récupération sous-préfecture:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération de la sous-préfecture',
      error: error.message 
    });
  }
});

router.post('/sousprefectures', async (req, res) => {
  try {
    const Souspref = require('../../../../models/Souspref');
    const { Lib_souspref, Cod_souspref, DepartementId } = req.body;

    if (!Lib_souspref || !Cod_souspref || !DepartementId) {
      return res.status(400).json({ 
        message: 'Les champs Lib_souspref, Cod_souspref et DepartementId sont requis' 
      });
    }

    const souspref = new Souspref({ Lib_souspref, Cod_souspref, DepartementId });
    const saved = await souspref.save();
    await saved.populate('DepartementId', 'Lib_departement');
    
    res.status(201).json({
      id: saved._id,
      Lib_souspref: saved.Lib_souspref,
      Cod_souspref: saved.Cod_souspref,
      DepartementId: saved.DepartementId,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt
    });
  } catch (error) {
    console.error('Erreur création sous-préfecture:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création de la sous-préfecture',
      error: error.message 
    });
  }
});

router.put('/sousprefectures/:id', async (req, res) => {
  try {
    const Souspref = require('../../../../models/Souspref');
    const { Lib_souspref, Cod_souspref, DepartementId } = req.body;

    const souspref = await Souspref.findByIdAndUpdate(
      req.params.id,
      { Lib_souspref, Cod_souspref, DepartementId },
      { new: true, runValidators: true }
    ).populate('DepartementId', 'Lib_departement');

    if (!souspref) {
      return res.status(404).json({ message: 'Sous-préfecture non trouvée' });
    }

    res.json({
      id: souspref._id,
      Lib_souspref: souspref.Lib_souspref,
      Cod_souspref: souspref.Cod_souspref,
      DepartementId: souspref.DepartementId,
      createdAt: souspref.createdAt,
      updatedAt: souspref.updatedAt
    });
  } catch (error) {
    console.error('Erreur mise à jour sous-préfecture:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour de la sous-préfecture',
      error: error.message 
    });
  }
});

router.delete('/sousprefectures/:id', async (req, res) => {
  try {
    const Souspref = require('../../../../models/Souspref');
    const souspref = await Souspref.findByIdAndDelete(req.params.id);

    if (!souspref) {
      return res.status(404).json({ message: 'Sous-préfecture non trouvée' });
    }

    res.json({ message: 'Sous-préfecture supprimée avec succès' });
  } catch (error) {
    console.error('Erreur suppression sous-préfecture:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la suppression de la sous-préfecture',
      error: error.message 
    });
  }
});

// Route pour récupérer les sous-préfectures par département
router.get('/departements/:departementId/sousprefectures', async (req, res) => {
  try {
    const Souspref = require('../../../../models/Souspref');
    const sousprefectures = await Souspref.find({ DepartementId: req.params.departementId })
      .populate('DepartementId', 'Lib_departement')
      .sort({ Lib_souspref: 1 });
    
    res.json(sousprefectures.map(s => ({
      id: s._id,
      Lib_souspref: s.Lib_souspref,
      Cod_souspref: s.Cod_souspref,
      DepartementId: s.DepartementId,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt
    })));
  } catch (error) {
    console.error('Erreur récupération sous-préfectures par département:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des sous-préfectures',
      error: error.message 
    });
  }
});

// ===========================================
// ROUTES POUR LES SECTEURS ADMINISTRATIFS
// ===========================================

router.get('/secteurs-administratifs', async (req, res) => {
  try {
    const SecteurAdministratif = require('../../../../models/SecteurAdministratif');
    const secteurs = await SecteurAdministratif.find()
      .populate('SousprefId', 'Lib_souspref')
      .sort({ Lib_SecteurAdministratif: 1 });
    
    res.json(secteurs.map(s => s.toDTO()));
  } catch (error) {
    console.error('Erreur récupération secteurs administratifs:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des secteurs administratifs',
      error: error.message 
    });
  }
});

router.get('/secteurs-administratifs/:id', async (req, res) => {
  try {
    const SecteurAdministratif = require('../../../../models/SecteurAdministratif');
    const secteur = await SecteurAdministratif.findById(req.params.id)
      .populate('SousprefId', 'Lib_souspref');
    
    if (!secteur) {
      return res.status(404).json({ message: 'Secteur administratif non trouvé' });
    }
    
    res.json(secteur.toDTO());
  } catch (error) {
    console.error('Erreur récupération secteur administratif:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération du secteur administratif',
      error: error.message 
    });
  }
});

router.post('/secteurs-administratifs', async (req, res) => {
  try {
    const SecteurAdministratif = require('../../../../models/SecteurAdministratif');
    const { Lib_SecteurAdministratif, Cod_SecteurAdministratif, SousprefId } = req.body;

    if (!Lib_SecteurAdministratif || !Cod_SecteurAdministratif || !SousprefId) {
      return res.status(400).json({ 
        message: 'Les champs Lib_SecteurAdministratif, Cod_SecteurAdministratif et SousprefId sont requis' 
      });
    }

    const secteur = new SecteurAdministratif({ 
      Lib_SecteurAdministratif, 
      Cod_SecteurAdministratif, 
      SousprefId 
    });
    const saved = await secteur.save();
    await saved.populate('SousprefId', 'Lib_souspref');
    
    res.status(201).json(saved.toDTO());
  } catch (error) {
    console.error('Erreur création secteur administratif:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création du secteur administratif',
      error: error.message 
    });
  }
});

router.put('/secteurs-administratifs/:id', async (req, res) => {
  try {
    const SecteurAdministratif = require('../../../../models/SecteurAdministratif');
    const { Lib_SecteurAdministratif, Cod_SecteurAdministratif, SousprefId } = req.body;

    const secteur = await SecteurAdministratif.findByIdAndUpdate(
      req.params.id,
      { Lib_SecteurAdministratif, Cod_SecteurAdministratif, SousprefId },
      { new: true, runValidators: true }
    ).populate('SousprefId', 'Lib_souspref');

    if (!secteur) {
      return res.status(404).json({ message: 'Secteur administratif non trouvé' });
    }

    res.json(secteur.toDTO());
  } catch (error) {
    console.error('Erreur mise à jour secteur administratif:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour du secteur administratif',
      error: error.message 
    });
  }
});

router.delete('/secteurs-administratifs/:id', async (req, res) => {
  try {
    const SecteurAdministratif = require('../../../../models/SecteurAdministratif');
    const secteur = await SecteurAdministratif.findByIdAndDelete(req.params.id);

    if (!secteur) {
      return res.status(404).json({ message: 'Secteur administratif non trouvé' });
    }

    res.json({ message: 'Secteur administratif supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression secteur administratif:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la suppression du secteur administratif',
      error: error.message 
    });
  }
});

// Route pour récupérer les secteurs administratifs par sous-préfecture
router.get('/sousprefectures/:sousprefId/secteurs-administratifs', async (req, res) => {
  try {
    const SecteurAdministratif = require('../../../../models/SecteurAdministratif');
    const secteurs = await SecteurAdministratif.find({ SousprefId: req.params.sousprefId })
      .populate('SousprefId', 'Lib_souspref')
      .sort({ Lib_SecteurAdministratif: 1 });
    
    res.json(secteurs.map(s => s.toDTO()));
  } catch (error) {
    console.error('Erreur récupération secteurs administratifs par sous-préfecture:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des secteurs administratifs',
      error: error.message 
    });
  }
});

// ===========================================
// ROUTES POUR LES ZONES DE DÉNOMBREMENT
// ===========================================

router.get('/zones-denombrement', async (req, res) => {
  try {
    const Zonedenombre = require('../../../../models/Zonedenombre');
    const zones = await Zonedenombre.find()
      .populate('SecteurAdministratifId', 'Lib_SecteurAdministratif')
      .sort({ Lib_ZD: 1 });
    
    res.json(zones.map(z => z.toDTO()));
  } catch (error) {
    console.error('Erreur récupération zones de dénombrement:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des zones de dénombrement',
      error: error.message 
    });
  }
});

router.get('/zones-denombrement/:id', async (req, res) => {
  try {
    const Zonedenombre = require('../../../../models/Zonedenombre');
    const zone = await Zonedenombre.findById(req.params.id)
      .populate('SecteurAdministratifId', 'Lib_SecteurAdministratif');
    
    if (!zone) {
      return res.status(404).json({ message: 'Zone de dénombrement non trouvée' });
    }
    
    res.json(zone.toDTO());
  } catch (error) {
    console.error('Erreur récupération zone de dénombrement:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération de la zone de dénombrement',
      error: error.message 
    });
  }
});

router.post('/zones-denombrement', async (req, res) => {
  try {
    const Zonedenombre = require('../../../../models/Zonedenombre');
    const { Lib_ZD, Cod_ZD, SecteurAdministratifId } = req.body;

    if (!Lib_ZD || !Cod_ZD || !SecteurAdministratifId) {
      return res.status(400).json({ 
        message: 'Les champs Lib_ZD, Cod_ZD et SecteurAdministratifId sont requis' 
      });
    }

    const zone = new Zonedenombre({ Lib_ZD, Cod_ZD, SecteurAdministratifId });
    const saved = await zone.save();
    await saved.populate('SecteurAdministratifId', 'Lib_SecteurAdministratif');
    
    res.status(201).json(saved.toDTO());
  } catch (error) {
    console.error('Erreur création zone de dénombrement:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création de la zone de dénombrement',
      error: error.message 
    });
  }
});

router.put('/zones-denombrement/:id', async (req, res) => {
  try {
    const Zonedenombre = require('../../../../models/Zonedenombre');
    const { Lib_ZD, Cod_ZD, SecteurAdministratifId } = req.body;

    const zone = await Zonedenombre.findByIdAndUpdate(
      req.params.id,
      { Lib_ZD, Cod_ZD, SecteurAdministratifId },
      { new: true, runValidators: true }
    ).populate('SecteurAdministratifId', 'Lib_SecteurAdministratif');

    if (!zone) {
      return res.status(404).json({ message: 'Zone de dénombrement non trouvée' });
    }

    res.json(zone.toDTO());
  } catch (error) {
    console.error('Erreur mise à jour zone de dénombrement:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour de la zone de dénombrement',
      error: error.message 
    });
  }
});

router.delete('/zones-denombrement/:id', async (req, res) => {
  try {
    const Zonedenombre = require('../../../../models/Zonedenombre');
    const zone = await Zonedenombre.findByIdAndDelete(req.params.id);

    if (!zone) {
      return res.status(404).json({ message: 'Zone de dénombrement non trouvée' });
    }

    res.json({ message: 'Zone de dénombrement supprimée avec succès' });
  } catch (error) {
    console.error('Erreur suppression zone de dénombrement:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la suppression de la zone de dénombrement',
      error: error.message 
    });
  }
});

// Route pour récupérer les zones de dénombrement par secteur administratif
router.get('/secteurs-administratifs/:secteurId/zones-denombrement', async (req, res) => {
  try {
    const Zonedenombre = require('../../../../models/Zonedenombre');
    const zones = await Zonedenombre.find({ SecteurAdministratifId: req.params.secteurId })
      .populate('SecteurAdministratifId', 'Lib_SecteurAdministratif')
      .sort({ Lib_ZD: 1 });
    
    res.json(zones.map(z => z.toDTO()));
  } catch (error) {
    console.error('Erreur récupération zones de dénombrement par secteur:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des zones de dénombrement',
      error: error.message 
    });
  }
});

// ===========================================
// ROUTES POUR LES LOCALITÉS
// ===========================================

router.get('/localites', async (req, res) => {
  try {
    const Localite = require('../../../../models/Localite');
    const localites = await Localite.find()
      .populate('VillageId', 'Lib_village')
      .sort({ Lib_localite: 1 });
    
    res.json(localites.map(l => l.toDTO()));
  } catch (error) {
    console.error('Erreur récupération localités:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des localités',
      error: error.message 
    });
  }
});

router.get('/localites/:id', async (req, res) => {
  try {
    const Localite = require('../../../../models/Localite');
    const localite = await Localite.findById(req.params.id)
      .populate('VillageId', 'Lib_village');
    
    if (!localite) {
      return res.status(404).json({ message: 'Localité non trouvée' });
    }
    
    res.json(localite.toDTO());
  } catch (error) {
    console.error('Erreur récupération localité:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération de la localité',
      error: error.message 
    });
  }
});

router.post('/localites', async (req, res) => {
  try {
    const Localite = require('../../../../models/Localite');
    const { Lib_localite, Cod_localite, VillageId } = req.body;

    if (!Lib_localite || !Cod_localite || !VillageId) {
      return res.status(400).json({ 
        message: 'Les champs Lib_localite, Cod_localite et VillageId sont requis' 
      });
    }

    const localite = new Localite({ Lib_localite, Cod_localite, VillageId });
    const saved = await localite.save();
    await saved.populate('VillageId', 'Lib_village');
    
    res.status(201).json(saved.toDTO());
  } catch (error) {
    console.error('Erreur création localité:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création de la localité',
      error: error.message 
    });
  }
});

router.put('/localites/:id', async (req, res) => {
  try {
    const Localite = require('../../../../models/Localite');
    const { Lib_localite, Cod_localite, VillageId } = req.body;

    const localite = await Localite.findByIdAndUpdate(
      req.params.id,
      { Lib_localite, Cod_localite, VillageId },
      { new: true, runValidators: true }
    ).populate('VillageId', 'Lib_village');

    if (!localite) {
      return res.status(404).json({ message: 'Localité non trouvée' });
    }

    res.json(localite.toDTO());
  } catch (error) {
    console.error('Erreur mise à jour localité:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour de la localité',
      error: error.message 
    });
  }
});

router.delete('/localites/:id', async (req, res) => {
  try {
    const Localite = require('../../../../models/Localite');
    const localite = await Localite.findByIdAndDelete(req.params.id);

    if (!localite) {
      return res.status(404).json({ message: 'Localité non trouvée' });
    }

    res.json({ message: 'Localité supprimée avec succès' });
  } catch (error) {
    console.error('Erreur suppression localité:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la suppression de la localité',
      error: error.message 
    });
  }
});

// Route pour récupérer les localités par village
router.get('/villages/:villageId/localites', async (req, res) => {
  try {
    const Localite = require('../../../../models/Localite');
    const localites = await Localite.find({ VillageId: req.params.villageId })
      .populate('VillageId', 'Lib_village')
      .sort({ Lib_localite: 1 });
    
    res.json(localites.map(l => l.toDTO()));
  } catch (error) {
    console.error('Erreur récupération localités par village:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des localités',
      error: error.message 
    });
  }
});

// ===========================================
// ROUTES POUR LES MÉNAGES
// ===========================================

router.get('/menages', async (req, res) => {
  try {
    const Menage = require('../../../../models/Menage');
    const { page = 1, limit = 20 } = req.query;
    const pageNum = Number.parseInt(page);
    const limitNum = Number.parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [menages, total] = await Promise.all([
      Menage.find()
        .populate('PaysId', 'Lib_pays')
        .populate('DistrictId', 'Lib_district')
        .populate('RegionId', 'Lib_region')
        .populate('DepartementId', 'Lib_departement')
        .populate('SousprefId', 'Lib_souspref')
        .populate('SecteurAdministratifId', 'Lib_SecteurAdministratif')
        .populate('ZonedenombreId', 'Lib_ZD')
        .populate('LocaliteId', 'Lib_localite')
        .populate('EnqueteurId', 'Nom_ut Pren_ut')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Menage.countDocuments()
    ]);
    
    res.json({
      items: menages.map(m => m.toDTO()),
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    });
  } catch (error) {
    console.error('Erreur récupération ménages:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des ménages',
      error: error.message 
    });
  }
});

router.get('/menages/:id', async (req, res) => {
  try {
    const Menage = require('../../../../models/Menage');
    const menage = await Menage.findById(req.params.id)
      .populate('PaysId', 'Lib_pays')
      .populate('DistrictId', 'Lib_district')
      .populate('RegionId', 'Lib_region')
      .populate('DepartementId', 'Lib_departement')
      .populate('SousprefId', 'Lib_souspref')
      .populate('SecteurAdministratifId', 'Lib_SecteurAdministratif')
      .populate('ZonedenombreId', 'Lib_ZD')
      .populate('LocaliteId', 'Lib_localite')
      .populate('EnqueteurId', 'Nom_ut Pren_ut');
    
    if (!menage) {
      return res.status(404).json({ message: 'Ménage non trouvé' });
    }
    
    res.json(menage.toDTO());
  } catch (error) {
    console.error('Erreur récupération ménage:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération du ménage',
      error: error.message 
    });
  }
});

router.post('/menages', async (req, res) => {
  try {
    const Menage = require('../../../../models/Menage');
    const menage = new Menage(req.body);
    const saved = await menage.save();
    
    await saved.populate([
      { path: 'PaysId', select: 'Lib_pays' },
      { path: 'DistrictId', select: 'Lib_district' },
      { path: 'RegionId', select: 'Lib_region' },
      { path: 'DepartementId', select: 'Lib_departement' },
      { path: 'SousprefId', select: 'Lib_souspref' },
      { path: 'SecteurAdministratifId', select: 'Lib_SecteurAdministratif' },
      { path: 'ZonedenombreId', select: 'Lib_ZD' },
      { path: 'LocaliteId', select: 'Lib_localite' },
      { path: 'EnqueteurId', select: 'Nom_ut Pren_ut' }
    ]);
    
    res.status(201).json(saved.toDTO());
  } catch (error) {
    console.error('Erreur création ménage:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la création du ménage',
      error: error.message 
    });
  }
});

router.put('/menages/:id', async (req, res) => {
  try {
    const Menage = require('../../../../models/Menage');
    const menage = await Menage.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate([
      { path: 'PaysId', select: 'Lib_pays' },
      { path: 'DistrictId', select: 'Lib_district' },
      { path: 'RegionId', select: 'Lib_region' },
      { path: 'DepartementId', select: 'Lib_departement' },
      { path: 'SousprefId', select: 'Lib_souspref' },
      { path: 'SecteurAdministratifId', select: 'Lib_SecteurAdministratif' },
      { path: 'ZonedenombreId', select: 'Lib_ZD' },
      { path: 'LocaliteId', select: 'Lib_localite' },
      { path: 'EnqueteurId', select: 'Nom_ut Pren_ut' }
    ]);

    if (!menage) {
      return res.status(404).json({ message: 'Ménage non trouvé' });
    }

    res.json(menage.toDTO());
  } catch (error) {
    console.error('Erreur mise à jour ménage:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la mise à jour du ménage',
      error: error.message 
    });
  }
});

router.delete('/menages/:id', async (req, res) => {
  try {
    const Menage = require('../../../../models/Menage');
    const menage = await Menage.findByIdAndDelete(req.params.id);

    if (!menage) {
      return res.status(404).json({ message: 'Ménage non trouvé' });
    }

    res.json({ message: 'Ménage supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression ménage:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la suppression du ménage',
      error: error.message 
    });
  }
});

module.exports = router;
