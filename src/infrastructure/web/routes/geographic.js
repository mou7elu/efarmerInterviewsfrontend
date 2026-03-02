const express = require('express');
const { PaysController } = require('../controllers/PaysController');
const { DistrictController } = require('../controllers/DistrictController');
const { RegionController } = require('../controllers/RegionController');
const { DepartementController } = require('../controllers/DepartementController');
const { VillageController } = require('../controllers/VillageController');

const router = express.Router();

// Initialisation des contrôleurs
const paysController = new PaysController();
const districtController = new DistrictController();
const regionController = new RegionController();
const departementController = new DepartementController();
const villageController = new VillageController();

// === ROUTES PAYS ===
// GET /api/geographic/pays
router.get('/pays', (req, res, next) => paysController.getAll(req, res, next));

// GET /api/geographic/pays/local
router.get('/pays/local', (req, res, next) => paysController.getLocal(req, res, next));

// GET /api/geographic/pays/stats
router.get('/pays/stats', (req, res, next) => paysController.getStats(req, res, next));

// GET /api/geographic/pays/search/:term
router.get('/pays/search/:term', (req, res, next) => paysController.search(req, res, next));

// POST /api/geographic/pays
router.post('/pays', (req, res, next) => paysController.create(req, res, next));

// GET /api/geographic/pays/:id
router.get('/pays/:id', (req, res, next) => paysController.getById(req, res, next));

// PUT /api/geographic/pays/:id
router.put('/pays/:id', (req, res, next) => paysController.update(req, res, next));

// PATCH /api/geographic/pays/:id/statut
router.patch('/pays/:id/statut', (req, res, next) => paysController.updateStatut(req, res, next));

// DELETE /api/geographic/pays/:id
router.delete('/pays/:id', (req, res, next) => paysController.delete(req, res, next));

// === ROUTES DISTRICTS ===
// GET /api/geographic/districts
router.get('/districts', (req, res, next) => districtController.getAll(req, res, next));

// GET /api/geographic/districts/stats
router.get('/districts/stats', (req, res, next) => districtController.getStats(req, res, next));

// GET /api/geographic/districts/search/:term
router.get('/districts/search/:term', (req, res, next) => districtController.search(req, res, next));

// POST /api/geographic/districts
router.post('/districts', (req, res, next) => districtController.create(req, res, next));

// GET /api/geographic/districts/:id
router.get('/districts/:id', (req, res, next) => districtController.getById(req, res, next));

// PUT /api/geographic/districts/:id
router.put('/districts/:id', (req, res, next) => districtController.update(req, res, next));

// PATCH /api/geographic/districts/:id/statut
router.patch('/districts/:id/statut', (req, res, next) => districtController.updateStatut(req, res, next));

// DELETE /api/geographic/districts/:id
router.delete('/districts/:id', (req, res, next) => districtController.delete(req, res, next));

// === ROUTES RÉGIONS ===
// GET /api/geographic/regions
router.get('/regions', (req, res, next) => regionController.getAll(req, res, next));

// GET /api/geographic/regions/stats
router.get('/regions/stats', (req, res, next) => regionController.getStats(req, res, next));

// GET /api/geographic/regions/search/:term
router.get('/regions/search/:term', (req, res, next) => regionController.search(req, res, next));

// POST /api/geographic/regions
router.post('/regions', (req, res, next) => regionController.create(req, res, next));

// GET /api/geographic/regions/:id
router.get('/regions/:id', (req, res, next) => regionController.getById(req, res, next));

// PUT /api/geographic/regions/:id
router.put('/regions/:id', (req, res, next) => regionController.update(req, res, next));

// PATCH /api/geographic/regions/:id/statut
router.patch('/regions/:id/statut', (req, res, next) => regionController.updateStatut(req, res, next));

// DELETE /api/geographic/regions/:id
router.delete('/regions/:id', (req, res, next) => regionController.delete(req, res, next));

// === ROUTES DÉPARTEMENTS ===
// GET /api/geographic/departements
router.get('/departements', (req, res, next) => departementController.getAll(req, res, next));

// GET /api/geographic/departements/stats
router.get('/departements/stats', (req, res, next) => departementController.getStats(req, res, next));

// GET /api/geographic/departements/search/:term
router.get('/departements/search/:term', (req, res, next) => departementController.search(req, res, next));

// POST /api/geographic/departements
router.post('/departements', (req, res, next) => departementController.create(req, res, next));

// GET /api/geographic/departements/:id
router.get('/departements/:id', (req, res, next) => departementController.getById(req, res, next));

// PUT /api/geographic/departements/:id
router.put('/departements/:id', (req, res, next) => departementController.update(req, res, next));

// PATCH /api/geographic/departements/:id/statut
router.patch('/departements/:id/statut', (req, res, next) => departementController.updateStatut(req, res, next));

// DELETE /api/geographic/departements/:id
router.delete('/departements/:id', (req, res, next) => departementController.delete(req, res, next));

// === ROUTES RELATIONNELLES ===
// GET /api/geographic/pays/:paysId/districts
router.get('/pays/:paysId/districts', (req, res, next) => districtController.getByPays(req, res, next));

// GET /api/geographic/pays/:paysId/districts/count
router.get('/pays/:paysId/districts/count', (req, res, next) => districtController.countByPays(req, res, next));

// GET /api/geographic/districts/:districtId/regions
router.get('/districts/:districtId/regions', (req, res, next) => regionController.getByDistrict(req, res, next));

// GET /api/geographic/districts/:districtId/regions/count
router.get('/districts/:districtId/regions/count', (req, res, next) => regionController.countByDistrict(req, res, next));

// GET /api/geographic/regions/:regionId/departements
router.get('/regions/:regionId/departements', (req, res, next) => departementController.getByRegion(req, res, next));

// GET /api/geographic/regions/:regionId/departements/count
router.get('/regions/:regionId/departements/count', (req, res, next) => departementController.countByRegion(req, res, next));

// === ROUTES VILLAGES ===
// GET /api/geographic/villages
router.get('/villages', (req, res, next) => villageController.getAll(req, res, next));

// GET /api/geographic/villages/stats
router.get('/villages/stats', (req, res, next) => villageController.getStats(req, res, next));

// GET /api/geographic/villages/search/:term
router.get('/villages/search/:term', (req, res, next) => villageController.search(req, res, next));

// POST /api/geographic/villages
router.post('/villages', (req, res, next) => villageController.create(req, res, next));

// GET /api/geographic/villages/:id
router.get('/villages/:id', (req, res, next) => villageController.getById(req, res, next));

// PUT /api/geographic/villages/:id
router.put('/villages/:id', (req, res, next) => villageController.update(req, res, next));

// DELETE /api/geographic/villages/:id
router.delete('/villages/:id', (req, res, next) => villageController.delete(req, res, next));

module.exports = router;