const express = require('express');
const { ProducteurController } = require('../ProducteurController');

const router = express.Router();
const producteurController = new ProducteurController();

/**
 * @route GET /api/agricultural/producteurs
 * @desc Récupérer tous les producteurs avec pagination
 * @query {number} page - Numéro de page (défaut: 1)
 * @query {number} limit - Nombre d'éléments par page (défaut: 10)
 * @query {boolean} actif - Filtrer les producteurs actifs seulement
 */
router.get('/', producteurController.getAll);

/**
 * @route GET /api/agricultural/producteurs/search
 * @desc Rechercher des producteurs
 * @query {string} nom - Nom du producteur
 * @query {string} prenom - Prénom du producteur
 * @query {number} genre - Genre (1: Homme, 2: Femme)
 * @query {string} telephone - Numéro de téléphone
 * @query {boolean} actif - Statut actif
 */
router.get('/search', producteurController.search);

/**
 * @route GET /api/agricultural/producteurs/statistics
 * @desc Obtenir les statistiques des producteurs
 */
router.get('/statistics', producteurController.getStatistiques);

/**
 * @route GET /api/agricultural/producteurs/code/:code
 * @desc Récupérer un producteur par code
 * @param {string} code - Code du producteur
 */
router.get('/code/:code', producteurController.getByCode);

/**
 * @route GET /api/agricultural/producteurs/:id
 * @desc Récupérer un producteur par ID
 * @param {string} id - ID du producteur
 */
router.get('/:id', producteurController.getById);

/**
 * @route POST /api/agricultural/producteurs
 * @desc Créer un nouveau producteur
 * @body {string} code - Code unique du producteur (requis)
 * @body {string} nom - Nom du producteur (requis)
 * @body {string} prenom - Prénom du producteur (requis)
 * @body {number} genre - Genre (1: Homme, 2: Femme)
 * @body {string} telephone1 - Téléphone principal
 * @body {string} telephone2 - Téléphone secondaire
 * @body {string} dateNaissance - Date de naissance (ISO string)
 */
router.post('/', producteurController.create);

/**
 * @route PUT /api/agricultural/producteurs/:id
 * @desc Mettre à jour un producteur
 * @param {string} id - ID du producteur
 * @body {string} nom - Nom du producteur
 * @body {string} prenom - Prénom du producteur
 * @body {number} genre - Genre (1: Homme, 2: Femme)
 * @body {string} telephone1 - Téléphone principal
 * @body {string} telephone2 - Téléphone secondaire
 * @body {string} dateNaissance - Date de naissance (ISO string)
 * @body {boolean} sommeil - Statut actif/inactif
 */
router.put('/:id', producteurController.update);

/**
 * @route PATCH /api/agricultural/producteurs/:id/status
 * @desc Mettre à jour le statut d'un producteur
 * @param {string} id - ID du producteur
 * @body {boolean} sommeil - Statut actif/inactif
 */
router.patch('/:id/status', producteurController.updateStatut);

/**
 * @route DELETE /api/agricultural/producteurs/:id
 * @desc Supprimer un producteur
 * @param {string} id - ID du producteur
 */
router.delete('/:id', producteurController.delete);

module.exports = router;