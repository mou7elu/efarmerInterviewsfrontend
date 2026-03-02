# Entités et Modèles - Architecture Clean Code SOLID

## 📋 Vue d'ensemble

Cette documentation détaille toutes les entités métier de l'application eFarmer Interviews, organisées selon l'architecture Clean Code SOLID.

## 🏗️ Architecture des entités

### Structure hiérarchique
```
Domain/
├── entities/              # Entités métier
├── value-objects/         # Objets valeur immutables
├── repositories/          # Interfaces des repositories
└── services/              # Services domaine
```

## 📊 Catalogue des entités

### 1. Entités Core System

#### UserEntity
- **Responsabilité** : Gestion des utilisateurs du système
- **Attributs** : email, password, nom, prenom, role, isActive
- **Méthodes métier** : 
  - `updateProfile(nom, prenom)`
  - `changePassword(newPassword)`
  - `activate()` / `deactivate()`
- **Validation** : Email unique, mot de passe sécurisé
- **Relations** : Profile (n:1)

#### ProfileEntity
- **Responsabilité** : Gestion des profils et permissions
- **Attributs** : name, permissions[]
- **Méthodes métier** :
  - `addPermission(menuId, canAdd, canEdit, canDelete, canView)`
  - `updatePermission(menuId, permissions)`
  - `hasPermission(menuId, action)`
- **Validation** : Nom unique, permissions cohérentes

#### MenuEntity
- **Responsabilité** : Structure de navigation du système
- **Attributs** : text, icon, path, subMenu[], order
- **Méthodes métier** :
  - `addSubMenuItem(text, path)`
  - `updateOrder(order)`
  - `isParentMenu()` / `isLeafMenu()`
- **Validation** : Path XOR subMenu (exclusivité)

### 2. Entités Géographiques

#### PaysEntity
- **Responsabilité** : Gestion des pays
- **Attributs** : libPays, coordonnee, sommeil
- **Méthodes métier** :
  - `activer()` / `desactiver()`
  - `updateCoordonnees(coordonnees)`
  - `isActif()`
- **Validation** : Libellé unique, coordonnées optionnelles

#### DistrictEntity
- **Responsabilité** : Gestion des districts
- **Attributs** : libDistrict, coordonnee, sommeil, paysId
- **Relations** : Pays (n:1)
- **Hiérarchie** : Pays → District → Région → Département → Sous-préfecture

#### RegionEntity
- **Responsabilité** : Gestion des régions
- **Attributs** : libRegion, coordonnee, sommeil, districtId
- **Relations** : District (n:1)

#### DepartementEntity
- **Responsabilité** : Gestion des départements
- **Attributs** : libDepartement, regionId
- **Relations** : Region (n:1)

#### SousprefEntity
- **Responsabilité** : Gestion des sous-préfectures
- **Attributs** : libSouspref, departementId
- **Relations** : Departement (n:1)

#### VillageEntity
- **Responsabilité** : Gestion des villages
- **Attributs** : libVillage, coordonnee, paysId
- **Méthodes métier** : `hasCoordinates()`
- **Relations** : Pays (n:1)

### 3. Entités de Référence

#### NationaliteEntity
- **Responsabilité** : Gestion des nationalités
- **Attributs** : libNation
- **Méthodes métier** : `normalizeLibelle()`
- **Usage** : Référence dans les questionnaires

#### NiveauScolaireEntity
- **Responsabilité** : Gestion des niveaux scolaires
- **Attributs** : libNiveauScolaire, ordre
- **Méthodes métier** :
  - `isNiveauSuperieur()`
  - `isNiveauProfessionnel()`
  - `updateOrdre(ordre)`
- **Validation** : Ordre séquentiel

#### PieceEntity
- **Responsabilité** : Gestion des pièces d'identité
- **Attributs** : nomPiece, validiteDuree, obligatoire
- **Méthodes métier** :
  - `hasValiditeLimitee()`
  - `isIdentiteOfficielle()`
  - `rendreObligatoire()` / `rendreOptionnelle()`

### 4. Entités Questionnaire

#### QuestionnaireEntity (existant)
- **Responsabilité** : Structure des questionnaires
- **Relations** : Volet (1:n)

#### VoletEntity
- **Responsabilité** : Sections principales du questionnaire
- **Attributs** : titre, ordre, questionnaireId
- **Relations** : Questionnaire (n:1), Section (1:n)
- **Validation** : Ordre unique dans questionnaire

#### SectionEntity
- **Responsabilité** : Sous-sections des volets
- **Attributs** : titre, ordre, voletId
- **Relations** : Volet (n:1), Question (1:n)

#### QuestionEntity (existant)
- **Relations** : Section (n:1), ReferenceTable (optionnel)

#### ReponseEntity
- **Responsabilité** : Stockage des réponses
- **Attributs** : exploitantId, questionnaireId, reponses[]
- **Méthodes métier** :
  - `setReponse(questionId, valeur)`
  - `getCompletionPercentage(totalQuestions)`
  - `isComplete(questionsObligatoires)`
  - `validateResponses(questions)`

### 5. Value Objects

#### Email
- **Responsabilité** : Validation et normalisation des emails
- **Validation** : Format RFC compliant
- **Méthodes** : `normalize()`, `getDomain()`

#### QuestionCode
- **Responsabilité** : Codes uniques des questions
- **Format** : Q[0-9]+ (ex: Q27)
- **Validation** : Format strict

#### Coordonnee
- **Responsabilité** : Données géographiques
- **Formats supportés** : Lat,Lng ou GeoJSON
- **Méthodes** :
  - `isLatLngFormat()`
  - `toGeoJSON()`
  - `getLatitude()` / `getLongitude()`

#### ExploitantId
- **Responsabilité** : Identifiants des exploitants
- **Validation** : Format alphanumérique, longueur limitée

#### Libelle
- **Responsabilité** : Libellés génériques
- **Méthodes** : `toTitleCase()`, `contains(word)`, `startsWith(prefix)`

#### Ordre
- **Responsabilité** : Gestion des positions séquentielles
- **Validation** : Entier positif ≥ 1
- **Méthodes** : `increment()`, `decrement()`, `isFirst()`

## 🔗 Relations entre entités

### Hiérarchie géographique
```
Pays (1:n) District (1:n) Region (1:n) Departement (1:n) Souspref
Pays (1:n) Village
```

### Structure questionnaire
```
Questionnaire (1:n) Volet (1:n) Section (1:n) Question
Question (n:1) ReferenceTable (optionnel)
Reponse (n:1) Questionnaire
Reponse (n:n) Question
```

### Système utilisateur
```
User (n:1) Profile (1:n) Permission (n:1) Menu
```

## 📝 Conventions de nommage

### Entités
- **Suffixe** : `Entity` (ex: `UserEntity`)
- **CamelCase** : Première lettre majuscule
- **Singulier** : Une entité représente un objet

### Value Objects
- **Pas de suffixe** : `Email`, `Coordonnee`
- **CamelCase** : Première lettre majuscule
- **Immutable** : Toujours gelés avec `Object.freeze()`

### Méthodes métier
- **Verbes** : `update`, `change`, `activate`, `validate`
- **CamelCase** : `updateProfile()`, `isActive()`
- **Prédicats** : Préfixe `is`, `has`, `can`

## 🔄 Patterns utilisés

### 1. Entity Pattern
- Encapsulation de la logique métier
- Validation au niveau constructeur
- Méthodes de transformation immutables

### 2. Value Object Pattern
- Objets immutables
- Égalité par valeur
- Validation stricte

### 3. Repository Pattern
- Abstraction de la persistance
- Interface dans Domain
- Implémentation dans Infrastructure

### 4. Factory Pattern
- Méthodes `fromPersistence()` et `toPersistence()`
- Construction cohérente des entités

## 🧪 Testabilité

### Tests unitaires par entité
```javascript
// UserEntity.test.js
describe('UserEntity', () => {
  it('should update profile correctly', () => {
    const user = new UserEntity(validData);
    user.updateProfile('Nouveau', 'Nom');
    expect(user.fullName).toBe('Nouveau Nom');
  });
});
```

### Tests d'intégration
- Validation des relations entre entités
- Tests de persistance avec repositories

### Tests de Value Objects
- Validation des règles métier
- Tests d'immutabilité
- Tests d'égalité

## 🔍 Validation et erreurs

### Hiérarchie d'erreurs
```
DomainError
├── ValidationError      # Données invalides
├── BusinessLogicError   # Règles métier violées
├── NotFoundError       # Entité inexistante
├── DuplicateError      # Contrainte d'unicité
└── AuthorizationError  # Permissions insuffisantes
```

### Validation en couches
1. **Value Objects** : Validation format et contraintes
2. **Entities** : Validation cohérence métier
3. **Use Cases** : Validation règles business
4. **DTOs** : Validation inputs utilisateur

## 📈 Évolutivité

### Ajout d'une nouvelle entité
1. Créer l'entité dans `domain/entities/`
2. Créer l'interface repository dans `domain/repositories/`
3. Créer les DTOs dans `application/dtos/`
4. Créer les use cases dans `application/use-cases/`
5. Implémenter le repository dans `infrastructure/repositories/`
6. Créer le contrôleur dans `infrastructure/web/controllers/`

### Extension d'entité existante
1. Ajouter attributs et méthodes métier
2. Mettre à jour les DTOs correspondants
3. Créer nouveaux use cases si nécessaire
4. Adapter les repositories
5. Mettre à jour les contrôleurs

## 🛡️ Sécurité et performance

### Sécurité
- Validation stricte dans toutes les couches
- Pas de données sensibles dans les DTOs de réponse
- Contrôle d'accès au niveau use cases

### Performance
- Lazy loading des relations
- Pagination systématique
- Index sur les champs de recherche
- Cache au niveau infrastructure

Cette architecture garantit un code maintenable, testable et évolutif, respectant les principes SOLID et les meilleures pratiques du Domain-Driven Design.