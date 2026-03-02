const express = require('express');
const authRoutes = require('./auth');
const geographicRoutes = require('./geographic');
// Import des nouvelles routes depuis backend/routes
const usersRoutes = require('../../../../routes/users');
const administrativeRoutes = require('../../../../routes/administrative');
const referenceRoutes = require('../../../../routes/reference');
const agriculturalRoutes = require('../../../../routes/agricultural');
const zonesInterditesRoutes = require('../../../../routes/zones-interdites');
// NOTE: Routes questionnaire et interviews désactivées - les models correspondants ont été supprimés
// const questionnaireRoutes = require('./questionnaire');
// const interviewsRoutes = require('./interviews');
const sigRoutes = require('../../../../routes/sig');

const router = express.Router();

// Middleware global pour les APIs
router.use((req, res, next) => {
  res.header('Content-Type', 'application/json');
  next();
});

// Routes d'authentification
router.use('/auth', authRoutes);

// Routes géographiques (Pays, Districts, Régions)
router.use('/geographic', geographicRoutes);

// Routes utilisateurs et profils
router.use('/users', usersRoutes);

// Routes agricoles (Producteurs, Parcelles) - NOUVELLES ROUTES
router.use('/agricultural', agriculturalRoutes);

// Routes de référence (Professions, Nationalités, Niveaux scolaires, Pièces) - NOUVELLES ROUTES
router.use('/reference', referenceRoutes);

// Routes administratives (Sous-préfectures, Secteurs, Zones, Localités, Ménages) - NOUVELLES ROUTES
router.use('/administrative', administrativeRoutes);

// Routes zones interdites - NOUVELLES ROUTES
router.use('/zones-interdites', zonesInterditesRoutes);

// DÉSACTIVÉ: Routes de questionnaire (Volets, Sections, Questions)
// Les models Questionnaire, Volet, Section, Question ont été supprimés
// router.use('/questionnaire', questionnaireRoutes);

// DÉSACTIVÉ: Routes d'entretiens et autres routes obsolètes
// Les models Interview, Reponse ont été supprimés
// router.use('/', interviewsRoutes);

// Route SIG (Système d'Information Géographique)
router.use('/sig', sigRoutes);

// Route de santé pour l'API
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API eFarmer Clean Architecture est opérationnelle',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Route pour obtenir la documentation des endpoints
router.get('/endpoints', (req, res) => {
  res.json({
    success: true,
    message: 'Documentation des endpoints disponibles',
    endpoints: {
      health: 'GET /api/health',
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        me: 'GET /api/auth/me'
      },
      geographic: {
        pays: {
          list: 'GET /api/geographic/pays',
          create: 'POST /api/geographic/pays',
          get: 'GET /api/geographic/pays/:id',
          update: 'PUT /api/geographic/pays/:id',
          updateStatus: 'PATCH /api/geographic/pays/:id/statut',
          delete: 'DELETE /api/geographic/pays/:id',
          stats: 'GET /api/geographic/pays/stats',
          search: 'GET /api/geographic/pays/search/:term'
        },
        districts: {
          list: 'GET /api/geographic/districts',
          create: 'POST /api/geographic/districts',
          get: 'GET /api/geographic/districts/:id',
          update: 'PUT /api/geographic/districts/:id',
          updateStatus: 'PATCH /api/geographic/districts/:id/statut',
          delete: 'DELETE /api/geographic/districts/:id',
          stats: 'GET /api/geographic/districts/stats',
          search: 'GET /api/geographic/districts/search/:term',
          byCountry: 'GET /api/geographic/pays/:paysId/districts',
          countByCountry: 'GET /api/geographic/pays/:paysId/districts/count'
        },
        regions: {
          list: 'GET /api/geographic/regions',
          create: 'POST /api/geographic/regions',
          get: 'GET /api/geographic/regions/:id',
          update: 'PUT /api/geographic/regions/:id',
          delete: 'DELETE /api/geographic/regions/:id',
          byDistrict: 'GET /api/geographic/districts/:districtId/regions'
        },
        villages: {
          list: 'GET /api/geographic/villages',
          create: 'POST /api/geographic/villages',
          get: 'GET /api/geographic/villages/:id',
          update: 'PUT /api/geographic/villages/:id',
          delete: 'DELETE /api/geographic/villages/:id',
          stats: 'GET /api/geographic/villages/stats',
          search: 'GET /api/geographic/villages/search/:term'
        }
      },
      agricultural: {
        producteurs: {
          list: 'GET /api/agricultural/producteurs',
          create: 'POST /api/agricultural/producteurs',
          get: 'GET /api/agricultural/producteurs/:id',
          update: 'PUT /api/agricultural/producteurs/:id',
          updateStatus: 'PATCH /api/agricultural/producteurs/:id/status',
          delete: 'DELETE /api/agricultural/producteurs/:id',
          byCode: 'GET /api/agricultural/producteurs/code/:code',
          search: 'GET /api/agricultural/producteurs/search',
          statistics: 'GET /api/agricultural/producteurs/statistics'
        },
        parcelles: {
          list: 'GET /api/agricultural/parcelles',
          create: 'POST /api/agricultural/parcelles',
          get: 'GET /api/agricultural/parcelles/:id',
          update: 'PUT /api/agricultural/parcelles/:id',
          updateGPS: 'PATCH /api/agricultural/parcelles/:id/gps',
          delete: 'DELETE /api/agricultural/parcelles/:id',
          byProducteur: 'GET /api/agricultural/parcelles/producteur/:codeProducteur',
          byLocation: 'GET /api/agricultural/parcelles/location',
          search: 'GET /api/agricultural/parcelles/search',
          statistics: 'GET /api/agricultural/parcelles/statistics'
        }
      },
      reference: {
        professions: {
          list: 'GET /api/reference/professions',
          get: 'GET /api/reference/professions/:id',
          create: 'POST /api/reference/professions',
          update: 'PUT /api/reference/professions/:id',
          delete: 'DELETE /api/reference/professions/:id'
        },
        nationalites: {
          list: 'GET /api/reference/nationalites',
          get: 'GET /api/reference/nationalites/:id',
          create: 'POST /api/reference/nationalites',
          update: 'PUT /api/reference/nationalites/:id',
          delete: 'DELETE /api/reference/nationalites/:id'
        },
        niveauxScolaires: {
          list: 'GET /api/reference/niveaux-scolaires',
          get: 'GET /api/reference/niveaux-scolaires/:id',
          create: 'POST /api/reference/niveaux-scolaires',
          update: 'PUT /api/reference/niveaux-scolaires/:id',
          delete: 'DELETE /api/reference/niveaux-scolaires/:id'
        },
        pieces: {
          list: 'GET /api/reference/pieces',
          get: 'GET /api/reference/pieces/:id',
          create: 'POST /api/reference/pieces',
          update: 'PUT /api/reference/pieces/:id',
          delete: 'DELETE /api/reference/pieces/:id'
        }
      },
      administrative: {
        departements: {
          list: 'GET /api/administrative/departements',
          get: 'GET /api/administrative/departements/:id',
          create: 'POST /api/administrative/departements',
          update: 'PUT /api/administrative/departements/:id',
          delete: 'DELETE /api/administrative/departements/:id',
          byRegion: 'GET /api/administrative/regions/:regionId/departements'
        },
        sousprefectures: {
          list: 'GET /api/administrative/sousprefectures',
          get: 'GET /api/administrative/sousprefectures/:id',
          create: 'POST /api/administrative/sousprefectures',
          update: 'PUT /api/administrative/sousprefectures/:id',
          delete: 'DELETE /api/administrative/sousprefectures/:id',
          byDepartement: 'GET /api/administrative/departements/:departementId/sousprefectures'
        },
        secteursAdministratifs: {
          list: 'GET /api/administrative/secteurs-administratifs',
          get: 'GET /api/administrative/secteurs-administratifs/:id',
          create: 'POST /api/administrative/secteurs-administratifs',
          update: 'PUT /api/administrative/secteurs-administratifs/:id',
          delete: 'DELETE /api/administrative/secteurs-administratifs/:id',
          bySousprefecture: 'GET /api/administrative/sousprefectures/:sousprefId/secteurs-administratifs'
        },
        zonesDenombrement: {
          list: 'GET /api/administrative/zones-denombrement',
          get: 'GET /api/administrative/zones-denombrement/:id',
          create: 'POST /api/administrative/zones-denombrement',
          update: 'PUT /api/administrative/zones-denombrement/:id',
          delete: 'DELETE /api/administrative/zones-denombrement/:id',
          bySecteur: 'GET /api/administrative/secteurs-administratifs/:secteurId/zones-denombrement'
        },
        localites: {
          list: 'GET /api/administrative/localites',
          get: 'GET /api/administrative/localites/:id',
          create: 'POST /api/administrative/localites',
          update: 'PUT /api/administrative/localites/:id',
          delete: 'DELETE /api/administrative/localites/:id',
          byVillage: 'GET /api/administrative/villages/:villageId/localites'
        },
        menages: {
          list: 'GET /api/administrative/menages',
          get: 'GET /api/administrative/menages/:id',
          create: 'POST /api/administrative/menages',
          update: 'PUT /api/administrative/menages/:id',
          delete: 'DELETE /api/administrative/menages/:id'
        }
      },
      sig: {
        hierarchy: 'GET /api/sig'
      }
      // NOTE: Les endpoints questionnaire et interviews ont été désactivés
      // car les models correspondants (Questionnaire, Volet, Section, Question, Interview, Reponse) ont été supprimés
    }
  });
});

// Gestion des routes non trouvées
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint non trouvé',
    path: req.originalUrl,
    availableEndpoints: '/api/endpoints'
  });
});

module.exports = router;