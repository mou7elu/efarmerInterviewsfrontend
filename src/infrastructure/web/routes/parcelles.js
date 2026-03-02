const express = require('express');
const { ParcelleController } = require('../ParcelleController');

const router = express.Router();
const parcelleController = new ParcelleController();

/**
 * @route GET /api/agricultural/parcelles
 * @desc Récupérer toutes les parcelles avec pagination
 * @query {number} page - Numéro de page (défaut: 1)
 * @query {number} limit - Nombre d'éléments par page (défaut: 10)
 * @query {string} producteur - Code du producteur pour filtrer
 */
router.get('/', parcelleController.getAll);

/**
 * @route GET /api/agricultural/parcelles/search
 * @desc Rechercher des parcelles
 * @query {string} codeProducteur - Code du producteur
 * @query {number} surfaceMin - Surface minimale
 * @query {number} surfaceMax - Surface maximale
 * @query {string} numParcelle - Numéro de parcelle
 */
router.get('/search', parcelleController.search);

/**
 * @route GET /api/agricultural/parcelles/statistics
 * @desc Obtenir les statistiques des parcelles
 */
router.get('/statistics', parcelleController.getStatistiques);

/**
 * @route GET /api/agricultural/parcelles/location
 * @desc Rechercher des parcelles par localisation
 * @query {number} latitude - Latitude du point central
 * @query {number} longitude - Longitude du point central
 * @query {number} radius - Rayon de recherche en km (défaut: 10)
 */
router.get('/location', parcelleController.getByLocation);

/**
 * @route GET /api/agricultural/parcelles/producteur/:codeProducteur
 * @desc Récupérer les parcelles d'un producteur
 * @param {string} codeProducteur - Code du producteur
 */
router.get('/producteur/:codeProducteur', parcelleController.getByProducteur);

/**
 * @route GET /api/agricultural/parcelles/:id
 * @desc Récupérer une parcelle par ID
 * @param {string} id - ID de la parcelle
 */
router.get('/:id', parcelleController.getById);

/**
 * @route POST /api/agricultural/parcelles
 * @desc Créer une nouvelle parcelle
 * @body {string} numParcelle - Numéro de la parcelle (requis)
 * @body {string} codeProducteur - Code du producteur propriétaire
 * @body {number} surface - Surface de la parcelle en hectares (requis)
 * @body {number} gpsLatitude - Latitude GPS
 * @body {number} gpsLongitude - Longitude GPS
 */
router.post('/', parcelleController.create);

/**
 * @route PUT /api/agricultural/parcelles/:id
 * @desc Mettre à jour une parcelle
 * @param {string} id - ID de la parcelle
 * @body {string} numParcelle - Numéro de la parcelle
 * @body {string} codeProducteur - Code du producteur propriétaire
 * @body {number} surface - Surface de la parcelle en hectares
 * @body {number} gpsLatitude - Latitude GPS
 * @body {number} gpsLongitude - Longitude GPS
 */
router.put('/:id', parcelleController.update);

/**
 * @route PATCH /api/agricultural/parcelles/:id/gps
 * @desc Mettre à jour les coordonnées GPS d'une parcelle
 * @param {string} id - ID de la parcelle
 * @body {number} latitude - Latitude GPS (requis)
 * @body {number} longitude - Longitude GPS (requis)
 */
router.patch('/:id/gps', parcelleController.updateGPS);

/**
 * @route DELETE /api/agricultural/parcelles/:id
 * @desc Supprimer une parcelle
 * @param {string} id - ID de la parcelle
 */
router.delete('/:id', parcelleController.delete);

module.exports = router;