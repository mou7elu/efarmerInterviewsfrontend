# Architecture Clean Code SOLID - eFarmer Interviews Backend

## 📋 Vue d'ensemble

Cette architecture suit les principes **Clean Architecture** et **SOLID** pour créer un backend maintenable, testable et évolutif pour l'application eFarmer Interviews.

## 🏗️ Structure du projet

```
src/
├── domain/                 # Couche Domain (Logique métier pure)
│   ├── entities/          # Entités métier
│   ├── value-objects/     # Objets valeur immutables
│   ├── repositories/      # Interfaces des repositories
│   └── services/          # Services domaine
├── application/           # Couche Application (Cas d'usage)
│   ├── use-cases/        # Cas d'usage de l'application
│   └── dtos/             # Data Transfer Objects
├── infrastructure/       # Couche Infrastructure (Détails techniques)
│   ├── database/         # Configuration base de données
│   ├── repositories/     # Implémentations des repositories
│   └── web/              # Couche présentation web
│       ├── controllers/  # Contrôleurs HTTP
│       ├── middlewares/  # Middlewares Express
│       └── routes/       # Définition des routes
└── shared/               # Code partagé
    ├── errors/           # Classes d'erreurs customisées
    └── utils/            # Utilitaires partagés
```

## 🎯 Principes SOLID appliqués

### S - Single Responsibility Principle (SRP)
- **Entités** : Chaque entité a une seule responsabilité métier
- **Use Cases** : Chaque cas d'usage gère une seule fonctionnalité
- **Controllers** : Chaque contrôleur gère un seul type de ressource
- **Services** : Chaque service a une responsabilité spécifique

### O - Open/Closed Principle (OCP)
- **Interfaces Repository** : Extensibles sans modification
- **Base Classes** : `BaseEntity`, `BaseUseCase`, `BaseController`
- **Error Hierarchy** : Hiérarchie d'erreurs extensible

### L - Liskov Substitution Principle (LSP)
- **Repository Implementations** : Toutes respectent leurs interfaces
- **Entity Inheritance** : Les entités dérivées respectent le contrat de base

### I - Interface Segregation Principle (ISP)
- **Repository Interfaces** : Séparées par domaine (`IUserRepository`, `IQuestionRepository`)
- **Use Case Interfaces** : Spécifiques à chaque fonctionnalité

### D - Dependency Inversion Principle (DIP)
- **Injection de dépendances** : Les couches hautes ne dépendent pas des couches basses
- **Interfaces** : Abstraction des dépendances externes

## 📊 Couches d'architecture

### 1. Domain Layer (Couche Métier)

**Responsabilité** : Contient la logique métier pure, indépendante de toute technologie.

#### Entités
```javascript
// UserEntity.js - Encapsule la logique métier des utilisateurs
class UserEntity extends BaseEntity {
  // Logique métier pure
  updateProfile(nom, prenom) { ... }
  changePassword(newPassword) { ... }
  activate() { ... }
}
```

#### Value Objects
```javascript
// Email.js - Objet valeur immutable
class Email {
  constructor(value) {
    this._validate(value);
    Object.freeze(this); // Immutabilité
  }
}
```

#### Repository Interfaces
```javascript
// IUserRepository.js - Contrat d'accès aux données
class IUserRepository {
  async findByEmail(email) { throw new Error('Must implement'); }
  async create(user) { throw new Error('Must implement'); }
}
```

#### Domain Services
```javascript
// PasswordService.js - Logique métier complexe
class PasswordService {
  validatePassword(password) { ... }
  hashPassword(password) { ... }
}
```

### 2. Application Layer (Couche Application)

**Responsabilité** : Orchestration des cas d'usage, sans logique métier.

#### Use Cases
```javascript
// CreateUserUseCase.js - Cas d'usage spécifique
class CreateUserUseCase extends BaseUseCase {
  async execute(input) {
    // 1. Validation
    // 2. Logique d'orchestration
    // 3. Appel au domaine
    // 4. Persistance via repository
  }
}
```

#### DTOs
```javascript
// UserDTOs.js - Objets de transfert
class CreateUserDTO {
  static fromRequest(req) {
    return new CreateUserDTO({
      email: req.body.email,
      password: req.body.password
    });
  }
}
```

### 3. Infrastructure Layer (Couche Infrastructure)

**Responsabilité** : Détails techniques et interfaces externes.

#### Repository Implementations
```javascript
// MongoUserRepository.js - Implémentation MongoDB
class MongoUserRepository extends IUserRepository {
  async findByEmail(email) {
    const userDoc = await this.userModel.findOne({ email });
    return userDoc ? this._toEntity(userDoc) : null;
  }
}
```

#### Controllers
```javascript
// UserController.js - Point d'entrée HTTP
class UserController extends BaseController {
  create = this.asyncHandler(async (req, res) => {
    const dto = CreateUserDTO.fromRequest(req);
    const user = await this.createUserUseCase.execute(dto);
    return this.handleSuccess(res, user);
  });
}
```

## 🔧 Gestion des erreurs

### Hiérarchie d'erreurs métier
```javascript
DomainError
├── ValidationError
├── BusinessLogicError  
├── NotFoundError
├── DuplicateError
├── AuthorizationError
└── AuthenticationError
```

### Gestion centralisée
```javascript
// BaseController.js
handleError(res, error) {
  const statusCode = this.getStatusCode(error);
  const errorResponse = this.formatError(error);
  return res.status(statusCode).json(errorResponse);
}
```

## 🔄 Flux de données

```
HTTP Request
    ↓
Controller (Infrastructure)
    ↓
Use Case (Application)
    ↓
Domain Service (Domain)
    ↓
Entity (Domain)
    ↓
Repository Interface (Domain)
    ↓
Repository Implementation (Infrastructure)
    ↓
Database
```

## 🧪 Testabilité

### Avantages de cette architecture

1. **Tests unitaires isolés** : Chaque couche peut être testée indépendamment
2. **Mocks faciles** : Les interfaces permettent un mocking simple
3. **Tests de domaine purs** : Pas de dépendances externes
4. **Tests d'intégration ciblés** : Focus sur les points d'intégration

### Exemple de test
```javascript
// UserEntity.test.js
describe('UserEntity', () => {
  it('should update profile correctly', () => {
    const user = new UserEntity({ ... });
    user.updateProfile('Nouveau', 'Nom');
    expect(user.fullName).toBe('Nouveau Nom');
  });
});
```

## 📈 Évolutivité

### Ajout d'une nouvelle fonctionnalité
1. **Domain** : Créer/modifier entités et services domaine
2. **Application** : Créer nouveaux use cases et DTOs
3. **Infrastructure** : Ajouter contrôleurs et routes

### Changement de base de données
1. Créer nouvelle implémentation de repository
2. Aucun changement dans les couches Domain/Application

### Ajout d'une nouvelle interface (GraphQL, gRPC)
1. Créer nouveaux contrôleurs dans Infrastructure
2. Réutiliser les mêmes Use Cases

## 🛡️ Sécurité

### Validation en couches
1. **Controllers** : Validation des inputs HTTP
2. **Use Cases** : Validation business
3. **Entities** : Validation de cohérence métier

### Gestion des permissions
```javascript
// Dans les contrôleurs
this.checkPermission(req, 'CREATE_USER');

// Dans les use cases
if (!user.canModify(targetUser)) {
  throw new AuthorizationError();
}
```

## 📝 Bonnes pratiques

### Naming Conventions
- **Entities** : `UserEntity`, `QuestionEntity`
- **Use Cases** : `CreateUserUseCase`, `GetQuestionUseCase`
- **DTOs** : `CreateUserDTO`, `UserResponseDTO`
- **Repositories** : `IUserRepository`, `MongoUserRepository`

### Gestion des erreurs
- Utiliser les erreurs métier spécialisées
- Jamais d'erreurs techniques dans le domaine
- Logging centralisé dans les contrôleurs

### Performance
- Pagination systématique dans les listes
- Chargement paresseux des relations
- Cache au niveau infrastructure si nécessaire

## 🔄 Migration de l'existant

### Étapes recommandées
1. **Phase 1** : Créer la nouvelle structure en parallèle
2. **Phase 2** : Migrer les modèles vers des entités
3. **Phase 3** : Créer les use cases pour les fonctionnalités critiques
4. **Phase 4** : Remplacer progressivement les anciens contrôleurs
5. **Phase 5** : Supprimer l'ancien code

### Coexistence
- Les anciens modèles Mongoose peuvent coexister
- Wrapper progressif dans des repositories
- Migration par fonctionnalité métier

## 📚 Ressources

- [Clean Architecture (Uncle Bob)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Domain-Driven Design](https://martinfowler.com/tags/domain%20driven%20design.html)
- [Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)