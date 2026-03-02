/**
 * Infrastructure Repositories Index
 * Central export point for all repositories
 */

const BaseRepository = require('./BaseRepository');

// Geographic repositories
const PaysRepository = require('./PaysRepository');
const DistrictRepository = require('./DistrictRepository');
const RegionRepository = require('./RegionRepository');
const DepartementRepository = require('./DepartementRepository');
const VillageRepository = require('./VillageRepository');

// Administrative repositories
const SousprefRepository = require('./SousprefRepository');
const SecteurAdministratifRepository = require('./SecteurAdministratifRepository');
const ZonedenombreRepository = require('./ZonedenombreRepository');
const LocaliteRepository = require('./LocaliteRepository');
const MenageRepository = require('./MenageRepository');

// Reference repositories
const ProfessionRepository = require('./ProfessionRepository');
const NationaliteRepository = require('./NationaliteRepository');
const NiveauScolaireRepository = require('./NiveauScolaireRepository');
const PieceRepository = require('./PieceRepository');

// User repositories
const UserRepository = require('./UserRepository');
const ProfileRepository = require('./ProfileRepository');

// Agricultural repositories
const ProducteurRepository = require('./ProducteurRepository');
const ParcelleRepository = require('./ParcelleRepository');

// Other repositories
const ZoneInterditRepository = require('./ZoneInterditRepository');

module.exports = {
  BaseRepository,
  
  // Geographic
  PaysRepository,
  DistrictRepository,
  RegionRepository,
  DepartementRepository,
  VillageRepository,
  
  // Administrative
  SousprefRepository,
  SecteurAdministratifRepository,
  ZonedenombreRepository,
  LocaliteRepository,
  MenageRepository,
  
  // Reference
  ProfessionRepository,
  NationaliteRepository,
  NiveauScolaireRepository,
  PieceRepository,
  
  // User
  UserRepository,
  ProfileRepository,
  
  // Agricultural
  ProducteurRepository,
  ParcelleRepository,
  
  // Other
  ZoneInterditRepository
};
