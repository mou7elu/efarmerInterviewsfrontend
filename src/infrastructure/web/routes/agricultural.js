const express = require('express');
const producteurRoutes = require('./producteurs');
const parcelleRoutes = require('./parcelles');

const router = express.Router();

/**
 * Routes principales pour le module agricole
 * Base URL: /api/agricultural
 */

// Routes pour les producteurs
router.use('/producteurs', producteurRoutes);

// Routes pour les parcelles
router.use('/parcelles', parcelleRoutes);

/**
 * @route GET /api/agricultural/health
 * @desc Vérifier le statut du module agricole
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Module agricole opérationnel',
    timestamp: new Date().toISOString(),
    modules: {
      producteurs: 'OK',
      parcelles: 'OK'
    }
  });
});

/**
 * @route GET /api/agricultural
 * @desc Information sur l'API agricole
 */
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API de gestion agricole - eFarmer',
    version: '1.0.0',
    endpoints: {
      producteurs: '/api/agricultural/producteurs',
      parcelles: '/api/agricultural/parcelles'
    },
    documentation: {
      producteurs: {
        list: 'GET /producteurs',
        create: 'POST /producteurs',
        get: 'GET /producteurs/:id',
        update: 'PUT /producteurs/:id',
        delete: 'DELETE /producteurs/:id',
        search: 'GET /producteurs/search',
        byCode: 'GET /producteurs/code/:code',
        statistics: 'GET /producteurs/statistics'
      },
      parcelles: {
        list: 'GET /parcelles',
        create: 'POST /parcelles',
        get: 'GET /parcelles/:id',
        update: 'PUT /parcelles/:id',
        delete: 'DELETE /parcelles/:id',
        search: 'GET /parcelles/search',
        byProducteur: 'GET /parcelles/producteur/:codeProducteur',
        byLocation: 'GET /parcelles/location',
        statistics: 'GET /parcelles/statistics'
      }
    }
  });
});

module.exports = router;