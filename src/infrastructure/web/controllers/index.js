/**
 * Central export point for all controllers
 * Organizes controllers by domain for clean imports
 */

// Geographic Controllers
const { PaysController } = require('./PaysController');
const { DistrictController } = require('./DistrictController');
const { RegionController } = require('./RegionController');
const { DepartementController } = require('./DepartementController');
const { VillageController } = require('./VillageController');

// Administrative Controllers
const SousprefController = require('./SousprefController');
const SecteurAdministratifController = require('./SecteurAdministratifController');
const ZonedenombreController = require('./ZonedenombreController');
const LocaliteController = require('./LocaliteController');
const MenageController = require('./MenageController');

// Reference Data Controllers
const ReferenceController = require('./ReferenceController');

// User Management Controllers
const UserController = require('./UserController');
const ProfileController = require('./ProfileController');

// Agricultural Controllers
const ProducteurController = require('./ProducteurController');
const ParcelleController = require('./ParcelleController');

// Other Controllers
const ZoneInterditController = require('./ZoneInterditController');

// Export grouped by domain
module.exports = {
  // Geographic
  PaysController,
  DistrictController,
  RegionController,
  DepartementController,
  VillageController,

  // Administrative
  SousprefController,
  SecteurAdministratifController,
  ZonedenombreController,
  LocaliteController,
  MenageController,

  // Reference
  ReferenceController,

  // User
  UserController,
  ProfileController,

  // Agricultural
  ProducteurController,
  ParcelleController,

  // Other
  ZoneInterditController
};
