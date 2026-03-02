# Guide de Migration - eFarmer Interviews Backend

## 🔄 Vue d'ensemble

Ce guide détaille la migration de l'architecture actuelle vers la nouvelle architecture Clean Code SOLID.

## 📊 État actuel vs. Architecture cible

### Architecture actuelle
```
models/
├── Users.js              # Modèle Mongoose direct
├── Questions.js          # Logique métier mélangée
├── Questionnaire.js      # Couplage base de données
└── ...                   # 23 modèles avec préoccupations mélangées
```

### Architecture cible
```
src/
├── domain/               # Logique métier pure
├── application/          # Cas d'usage
├── infrastructure/       # Détails techniques
└── shared/               # Code partagé
```

## 🎯 Plan de migration en phases

### Phase 1 : Préparation (1-2 jours)
**Objectif** : Mettre en place la nouvelle structure sans casser l'existant

#### Étapes :
1. **Créer la nouvelle structure de dossiers** ✅
2. **Configurer l'environnement de développement** ✅
3. **Mettre en place les outils de build et test** ⏳
4. **Documenter l'architecture** ✅

#### Actions :
```bash
# Installation des nouvelles dépendances
npm install joi express-rate-limit helmet compression

# Configuration ESLint pour la nouvelle architecture
npm install --save-dev eslint eslint-config-airbnb-base

# Setup des tests
npm install --save-dev jest supertest mongodb-memory-server
```

### Phase 2 : Migration des modèles critiques (3-5 jours)
**Objectif** : Migrer les entités les plus importantes

#### Priorité 1 : Système d'authentification
- [x] `Users.js` → `UserEntity.js` + `MongoUserRepository.js`
- [ ] Migration des contrôleurs d'authentification
- [ ] Tests unitaires et d'intégration

#### Priorité 2 : Gestion des questionnaires
- [x] `Questions.js` → `QuestionEntity.js` + `MongoQuestionRepository.js`
- [x] `Questionnaire.js` → `QuestionnaireEntity.js`
- [ ] `Reponses.js` → `ReponseEntity.js`

#### Exemple de migration - Users.js :

**Avant (models/Users.js)** :
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nom: String,
  prenom: String,
  // Logique métier mélangée avec la persistance
  async comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  }
});

module.exports = mongoose.model('User', userSchema);
```

**Après (Migration en 3 étapes)** :

1. **Domain Entity** :
```javascript
// src/domain/entities/UserEntity.js
class UserEntity extends BaseEntity {
  constructor(data) {
    super(data);
    this.email = new Email(data.email);
    this.nom = data.nom;
    this.prenom = data.prenom;
    // Logique métier pure, pas de persistance
  }

  updateProfile(nom, prenom) {
    this.nom = nom;
    this.prenom = prenom;
    this.updatedAt = new Date();
  }
}
```

2. **Repository Implementation** :
```javascript
// src/infrastructure/repositories/MongoUserRepository.js
class MongoUserRepository extends IUserRepository {
  constructor() {
    super();
    this.userModel = require('../../models/Users'); // Réutilise l'ancien modèle
  }

  async findByEmail(email) {
    const userDoc = await this.userModel.findOne({ email: email.value });
    return userDoc ? this._toEntity(userDoc) : null;
  }

  _toEntity(doc) {
    return new UserEntity({
      id: doc._id.toString(),
      email: doc.email,
      nom: doc.nom,
      prenom: doc.prenom,
      hashedPassword: doc.password
    });
  }
}
```

3. **Use Case** :
```javascript
// src/application/use-cases/user/CreateUserUseCase.js
class CreateUserUseCase extends BaseUseCase {
  constructor(userRepository, passwordService) {
    super();
    this.userRepository = userRepository;
    this.passwordService = passwordService;
  }

  async execute(input) {
    // Validation et orchestration
    const existingUser = await this.userRepository.findByEmail(new Email(input.email));
    if (existingUser) {
      throw new DuplicateError('Email déjà utilisé');
    }

    const hashedPassword = await this.passwordService.hashPassword(input.password);
    const user = new UserEntity({
      email: input.email,
      nom: input.nom,
      prenom: input.prenom,
      hashedPassword
    });

    return await this.userRepository.create(user);
  }
}
```

### Phase 3 : Migration des contrôleurs (2-3 jours)
**Objectif** : Remplacer les contrôleurs existants par la nouvelle architecture

#### Migration des routes principales :
```javascript
// Avant (routes/users.js)
router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Après (infrastructure/web/controllers/UserController.js)
class UserController extends BaseController {
  create = this.asyncHandler(async (req, res) => {
    const dto = CreateUserDTO.fromRequest(req);
    const result = await this.createUserUseCase.execute(dto);
    return this.handleSuccess(res, result);
  });
}
```

### Phase 4 : Tests et validation (2-3 jours)
**Objectif** : Assurer la qualité et la non-régression

#### Tests par couche :
1. **Tests unitaires du domaine** :
```javascript
// tests/domain/entities/UserEntity.test.js
describe('UserEntity', () => {
  it('should validate email format', () => {
    expect(() => new UserEntity({ email: 'invalid' }))
      .toThrow(ValidationError);
  });

  it('should update profile correctly', () => {
    const user = new UserEntity(validUserData);
    user.updateProfile('Nouveau', 'Nom');
    expect(user.fullName).toBe('Nouveau Nom');
  });
});
```

2. **Tests d'intégration des repositories** :
```javascript
// tests/infrastructure/repositories/MongoUserRepository.test.js
describe('MongoUserRepository', () => {
  beforeEach(async () => {
    await setupTestDatabase();
  });

  it('should create and retrieve user', async () => {
    const user = new UserEntity(userData);
    const savedUser = await repository.create(user);
    const retrievedUser = await repository.findById(savedUser.id);
    expect(retrievedUser.email.value).toBe(userData.email);
  });
});
```

3. **Tests E2E des APIs** :
```javascript
// tests/api/users.test.js
describe('User API', () => {
  it('should register new user', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send(validUserData)
      .expect(201);
    
    expect(response.body.data.email).toBe(validUserData.email);
  });
});
```

### Phase 5 : Nettoyage et optimisation (1-2 jours)
**Objectif** : Supprimer l'ancien code et optimiser

#### Actions :
1. **Supprimer les anciens modèles** après validation complète
2. **Nettoyer les dépendances** inutiles
3. **Optimiser les performances** (cache, requêtes)
4. **Documentation finale** et formation équipe

## 🔄 Stratégies de migration

### 1. Migration graduelle (Recommandée)

**Principe** : Faire coexister les deux architectures temporairement

```javascript
// Wrapper pour transition graduelle
class LegacyUserService {
  constructor() {
    this.newUserRepository = new MongoUserRepository();
    this.createUserUseCase = new CreateUserUseCase(this.newUserRepository);
  }

  async createUser(userData) {
    // Utilise la nouvelle architecture
    return await this.createUserUseCase.execute(userData);
  }

  async findUser(id) {
    // Utilise encore l'ancien modèle temporairement
    return await User.findById(id);
  }
}
```

### 2. Migration par fonctionnalité

**Ordre recommandé** :
1. Authentification (critique)
2. Gestion des questionnaires (cœur métier)
3. Système de réponses
4. Fonctionnalités administratives
5. Fonctionnalités secondaires

### 3. Tests de régression

**Checklist de validation** :
- [ ] Authentification fonctionne
- [ ] Création de questionnaires
- [ ] Navigation entre questions
- [ ] Sauvegarde des réponses
- [ ] Export des données
- [ ] Performance acceptable

## 🛡️ Gestion des risques

### Risques identifiés

1. **Interruption de service**
   - **Mitigation** : Migration par fonctionnalité
   - **Plan B** : Rollback rapide vers l'ancien code

2. **Perte de données**
   - **Mitigation** : Backup complet avant migration
   - **Tests** : Migration sur environnement de test

3. **Performance dégradée**
   - **Mitigation** : Benchmarks avant/après
   - **Monitoring** : Suivi des temps de réponse

4. **Bugs introduits**
   - **Mitigation** : Tests complets à chaque étape
   - **Review** : Code review systématique

### Plan de rollback

```javascript
// Système de feature flags pour rollback rapide
const featureFlags = {
  useNewUserService: process.env.USE_NEW_USER_SERVICE === 'true',
  useNewQuestionService: process.env.USE_NEW_QUESTION_SERVICE === 'true'
};

class UserServiceFactory {
  static create() {
    return featureFlags.useNewUserService 
      ? new NewUserService()
      : new LegacyUserService();
  }
}
```

## 📈 Métriques de succès

### KPIs techniques
- **Couverture de tests** : > 80%
- **Temps de réponse** : < 200ms (95e percentile)
- **Taux d'erreur** : < 1%
- **Complexité cyclomatique** : < 10 par fonction

### KPIs métier
- **Disponibilité** : > 99.5%
- **Temps de développement** nouvelles fonctionnalités : -30%
- **Temps de résolution bugs** : -50%
- **Onboarding nouveaux développeurs** : -60%

## 📋 Checklist de migration

### Pré-migration
- [ ] Backup complet de la base de données
- [ ] Tests de l'application existante
- [ ] Benchmark des performances actuelles
- [ ] Setup de l'environnement de test

### Phase 1 - Infrastructure
- [x] Structure de dossiers créée
- [x] Configuration des outils de développement
- [ ] Scripts de build et déploiement
- [ ] CI/CD adapté

### Phase 2 - Domain Layer
- [x] Entités de base (User, Question)
- [x] Value Objects (Email, etc.)
- [x] Services domaine
- [x] Interfaces repositories

### Phase 3 - Application Layer
- [x] Use Cases principaux
- [x] DTOs
- [ ] Validation des inputs
- [ ] Gestion des erreurs métier

### Phase 4 - Infrastructure Layer
- [x] Repositories MongoDB
- [x] Contrôleurs de base
- [ ] Middlewares
- [ ] Routes configuration

### Phase 5 - Tests
- [ ] Tests unitaires domaine
- [ ] Tests intégration repositories
- [ ] Tests E2E APIs
- [ ] Tests de performance

### Phase 6 - Déploiement
- [ ] Migration en environnement de test
- [ ] Validation par les utilisateurs
- [ ] Migration en production
- [ ] Monitoring post-migration

## 🕐 Calendrier estimé

| Phase | Durée | Responsable | Dépendances |
|-------|--------|-------------|-------------|
| Phase 1 | 2 jours | Dev Lead | Aucune |
| Phase 2 | 5 jours | Dev Team | Phase 1 |
| Phase 3 | 3 jours | Dev Team | Phase 2 |
| Phase 4 | 3 jours | QA + Dev | Phase 3 |
| Phase 5 | 2 jours | Dev Team | Phase 4 |
| **Total** | **15 jours** | | |

## 🎓 Formation de l'équipe

### Sessions de formation
1. **Architecture Clean Code** (2h)
2. **Principes SOLID** (2h)
3. **Domain-Driven Design** (3h)
4. **Nouvelle structure de code** (2h)
5. **Outils et processus** (1h)

### Documentation à étudier
- Guide d'architecture (ARCHITECTURE.md)
- Guide de setup (SETUP.md)
- Conventions de code
- Processus de développement

Cette migration, bien que complexe, permettra d'avoir un code plus maintenable, testable et évolutif, respectant les meilleures pratiques du développement logiciel.