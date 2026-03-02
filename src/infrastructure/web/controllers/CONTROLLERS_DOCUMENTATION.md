# Controllers Layer Documentation

## Vue d'ensemble

La couche des controllers (située dans `backend/src/infrastructure/web/controllers/`) gère les requêtes HTTP et orchestre l'appel des use cases appropriés.

## Architecture

Chaque controller suit le pattern suivant:
1. **Import des use cases** depuis la couche application
2. **Méthodes async** pour gérer chaque endpoint
3. **Gestion des erreurs** avec codes HTTP appropriés
4. **Export en singleton** pour réutilisation

## Structure des Réponses

### Success Responses
```javascript
// 200 OK - Récupération réussie
res.json(data);

// 201 Created - Création réussie
res.status(201).json(data);
```

### Error Responses
```javascript
// 400 Bad Request - Erreur de validation
res.status(400).json({ error: error.message });

// 404 Not Found - Ressource non trouvée
res.status(404).json({ error: error.message });

// 500 Internal Server Error - Erreur serveur
res.status(500).json({ error: error.message });
```

## Controllers par Domaine

### 1. Geographic Controllers (5)

#### PaysController
**Fichier**: `PaysController.js`  
**Méthodes**:
- `create(req, res)` - Créer un pays
- `getById(req, res)` - Obtenir un pays par ID
- `getAll(req, res)` - Liste tous les pays
- `update(req, res)` - Mettre à jour un pays
- `delete(req, res)` - Supprimer un pays
- `updateStatut(req, res)` - Changer le statut actif/inactif
- `getStats(req, res)` - Obtenir les statistiques
- `search(req, res)` - Rechercher par nom

**Use Cases utilisés**: CreatePaysUseCase, GetPaysUseCase, GetAllPaysUseCase, UpdatePaysUseCase, DeletePaysUseCase

#### DistrictController
**Fichier**: `DistrictController.js`  
**Méthodes similaires** + spécifiques:
- `getByPays(req, res)` - Districts d'un pays
- `countByPays(req, res)` - Compter par pays

#### RegionController
**Fichier**: `RegionController.js`  
**Méthodes similaires** + spécifiques:
- `getByDistrict(req, res)` - Régions d'un district
- `countByDistrict(req, res)` - Compter par district

#### DepartementController
**Fichier**: `DepartementController.js`  
**Méthodes similaires** + spécifiques:
- `getByRegion(req, res)` - Départements d'une région

#### VillageController
**Fichier**: `VillageController.js`  
**Méthodes similaires** + spécifiques:
- `getByDepartement(req, res)` - Villages d'un département

---

### 2. Administrative Controllers (5)

#### SousprefController
**Fichier**: `SousprefController.js`  
**Méthodes** (6):
- `create(req, res)` - POST /souspref
- `getById(req, res)` - GET /souspref/:id
- `getAll(req, res)` - GET /souspref
- `getByDepartement(req, res)` - GET /souspref/departement/:departementId
- `update(req, res)` - PUT /souspref/:id
- `delete(req, res)` - DELETE /souspref/:id

**Use Cases**: 6 from SousprefUseCases (Create, Get, GetAll, GetByDepartement, Update, Delete)

#### SecteurAdministratifController
**Fichier**: `SecteurAdministratifController.js`  
**Méthodes** (6):
- `create`, `getById`, `getAll` - CRUD standard
- `getBySouspref` - Secteurs d'une sous-préfecture
- `update`, `delete`

**Use Cases**: 6 from SecteurAdministratifUseCases

#### ZonedenombreController
**Fichier**: `ZonedenombreController.js`  
**Méthodes** (6):
- CRUD standard
- `getBySecteurAdministratif` - Zones d'un secteur

**Use Cases**: 6 from ZonedenombreUseCases

#### LocaliteController
**Fichier**: `LocaliteController.js`  
**Méthodes** (6):
- CRUD standard
- `getByVillage` - Localités d'un village

**Use Cases**: 6 from LocaliteUseCases

#### MenageController
**Fichier**: `MenageController.js`  
**Méthodes** (9):
- CRUD standard (create, getById, getAll, update, delete)
- `getByLocalite` - Ménages d'une localité
- `getByEnqueteur` - Ménages d'un enquêteur
- `getWithAnacardeProducteurs` - Ménages avec producteurs d'anacarde
- `getWithFullHierarchy` - Ménages avec toute la hiérarchie géographique

**Use Cases**: 9 from MenageUseCases

---

### 3. Reference Data Controller (1)

#### ReferenceController
**Fichier**: `ReferenceController.js`  
**Gère 4 types de références**: Profession, Nationalité, Niveau Scolaire, Pièce

**Méthodes** (20 au total - 5 par type):

**Professions**:
- `createProfession(req, res)` - POST /professions
- `getProfessionById(req, res)` - GET /professions/:id
- `getAllProfessions(req, res)` - GET /professions
- `updateProfession(req, res)` - PUT /professions/:id
- `deleteProfession(req, res)` - DELETE /professions/:id

**Nationalités**:
- `createNationalite`, `getNationaliteById`, `getAllNationalites`
- `updateNationalite`, `deleteNationalite`

**Niveaux Scolaires**:
- `createNiveauScolaire`, `getNiveauScolaireById`, `getAllNiveauxScolaires`
- `updateNiveauScolaire`, `deleteNiveauScolaire`

**Pièces d'identité**:
- `createPiece`, `getPieceById`, `getAllPieces`
- `updatePiece`, `deletePiece`

**Use Cases**: 20 from ReferenceUseCases (5 per entity type)

---

### 4. User Management Controllers (2)

#### UserController
**Fichier**: `UserController.js`  
**Méthodes** (14):
- `create(req, res)` - Créer utilisateur
- `getById(req, res)` - Obtenir par ID
- `getAll(req, res)` - Liste tous
- `getActive(req, res)` - Utilisateurs actifs
- `getInactive(req, res)` - Utilisateurs inactifs
- `getByProfile(req, res)` - Par profil
- `getByResponsable(req, res)` - Par responsable
- `update(req, res)` - Mise à jour complète
- `updatePassword(req, res)` - Changer mot de passe admin
- `updateProfile(req, res)` - Changer profil
- `toggleStatus(req, res)` - Activer/désactiver
- `changePassword(req, res)` - Changer son propre mot de passe
- `delete(req, res)` - Supprimer
- `deleteByProfile(req, res)` - Supprimer par profil

**Use Cases**: 14 from UserUseCases

#### ProfileController
**Fichier**: `ProfileController.js`  
**Méthodes** (8):
- `create(req, res)` - POST /profiles
- `getById(req, res)` - GET /profiles/:id
- `getAll(req, res)` - GET /profiles
- `getWithPermission(req, res)` - GET /profiles/permission/:permission
- `update(req, res)` - PUT /profiles/:id
- `updatePermissions(req, res)` - PUT /profiles/:id/permissions
- `checkPermission(req, res)` - GET /profiles/:id/check/:permission
- `delete(req, res)` - DELETE /profiles/:id

**Use Cases**: 8 from ProfileUseCases

---

### 5. Agricultural Controllers (2)

#### ProducteurController
**Fichier**: `ProducteurController.js`  
**Méthodes** (16):

**CRUD de base**:
- `create`, `getById`, `getAll`, `update`, `delete`

**Requêtes spécialisées**:
- `getByMenage(req, res)` - Producteurs d'un ménage
- `getStatistics(req, res)` - Statistiques globales
- `getWithMobileMoney(req, res)` - Avec mobile money
- `getExploitants(req, res)` - Exploitants uniquement
- `getByAgeRange(req, res)` - Par tranche d'âge (query: minAge, maxAge)
- `getByGender(req, res)` - Par genre
- `getByNationalite(req, res)` - Par nationalité
- `getByProfession(req, res)` - Par profession

**Mises à jour spécialisées**:
- `updateCoordinates(req, res)` - Coordonnées GPS
- `updateContact(req, res)` - Informations de contact
- `toggleStatus(req, res)` - Activer/désactiver

**Use Cases**: 16 from ProducteurUseCases

#### ParcelleController
**Fichier**: `ParcelleController.js`  
**Méthodes** (22):

**CRUD de base**:
- `create`, `getById`, `getAll`, `update`, `delete`

**Requêtes par relation**:
- `getByProducteur(req, res)` - Parcelles d'un producteur
- `getByVillage(req, res)` - Par village
- `getByZone(req, res)` - Par zone

**Requêtes spécialisées**:
- `getStatistics(req, res)` - Statistiques globales
- `getCertified(req, res)` - Parcelles certifiées
- `getByType(req, res)` - Par type de parcelle
- `getByYear(req, res)` - Par année de création
- `getBySizeRange(req, res)` - Par superficie (query: minSize, maxSize)
- `getWithVarieties(req, res)` - Avec variétés spécifiées
- `getWithOrangers(req, res)` - Avec orangers
- `getOldest(req, res)` - Plus anciennes (query: limit)
- `getRecent(req, res)` - Plus récentes (query: limit)

**Mises à jour spécialisées**:
- `updateCoordinates(req, res)` - Coordonnées GPS
- `updateProduction(req, res)` - Données de production
- `updateExpenses(req, res)` - Dépenses
- `toggleCertification(req, res)` - Certification on/off

**Suppression en masse**:
- `deleteByProducteur(req, res)` - Toutes les parcelles d'un producteur

**Use Cases**: 22 from ParcelleUseCases

---

### 6. Other Controllers (1)

#### ZoneInterditController
**Fichier**: `ZoneInterditController.js`  
**Méthodes** (11):

**CRUD de base**:
- `create`, `getById`, `getAll`, `update`, `delete`

**Requêtes filtrées**:
- `getActive(req, res)` - Zones actives
- `getInactive(req, res)` - Zones inactives
- `getWithCoordinates(req, res)` - Avec coordonnées définies
- `getByVillage(req, res)` - Par village

**Mises à jour spécialisées**:
- `updateCoordinates(req, res)` - Coordonnées GPS
- `toggleStatus(req, res)` - Activer/désactiver

**Use Cases**: 11 from ZoneInterditUseCases

---

## Gestion des Erreurs

Tous les controllers implémentent une gestion cohérente des erreurs:

```javascript
try {
  const useCase = new SomeUseCase();
  const result = await useCase.execute(data);
  res.status(201 ou 200).json(result);
} catch (error) {
  // Erreur de validation
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }
  
  // Ressource non trouvée
  if (error.name === 'NotFoundError') {
    return res.status(404).json({ error: error.message });
  }
  
  // Erreur serveur
  res.status(500).json({ error: error.message });
}
```

## Dépendances

Les controllers dépendent uniquement de:
- **Use Cases** (couche application) - Business logic
- **Pas de dépendance directe** aux repositories ou models
- Respect strict du **principe de dépendance inversée**

## Utilisation dans les Routes

Les controllers sont importés et utilisés dans les fichiers de routes:

```javascript
// Example: backend/routes/administrative.js
const { MenageController } = require('../src/infrastructure/web/controllers');

router.post('/menage', protect, MenageController.create);
router.get('/menage/:id', protect, MenageController.getById);
// etc.
```

## Récapitulatif

| Domaine | Controllers | Total Méthodes | Use Cases Utilisés |
|---------|-------------|----------------|-------------------|
| Geographic | 5 | ~40 | 25 |
| Administrative | 5 | 33 | 33 |
| Reference | 1 | 20 | 20 |
| User | 2 | 22 | 22 |
| Agricultural | 2 | 38 | 38 |
| Other | 1 | 11 | 11 |
| **TOTAL** | **16** | **164** | **149** |

## Prochaines Étapes

1. ✅ Tous les controllers créés
2. 🔄 Mettre à jour les routes pour utiliser les nouveaux controllers
3. ⏳ Créer les domain services (validation, business rules)
4. ⏳ Tests unitaires et d'intégration
5. ⏳ Documentation OpenAPI/Swagger

## Notes Importantes

- Tous les controllers exportent des **singletons** (new Controller() dans module.exports)
- Les controllers géographiques utilisent un pattern légèrement différent (export nommé avec class)
- Cohérence dans la gestion des erreurs sur tous les controllers
- Chaque controller respecte le **Single Responsibility Principle**
- Aucune logique métier dans les controllers (déléguée aux use cases)
