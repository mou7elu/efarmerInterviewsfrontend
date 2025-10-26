# Frontend - Interview Management System

## 🏗️ Architecture Clean Code

Cette application frontend suit les principes de la **Clean Architecture** et du **Clean Code**, avec une séparation claire des responsabilités en couches.

### 📁 Structure du Projet

```
src/
├── domain/                      # Couche Domaine (Business Logic)
│   ├── entities/               # Entités métier
│   │   ├── UserEntity.js
│   │   ├── InterviewEntity.js
│   │   └── QuestionEntity.js
│   ├── value-objects/          # Objets valeur
│   │   ├── Email.js
│   │   └── QuestionCode.js
│   └── errors/                 # Erreurs domaine
│       └── DomainError.js
│
├── application/                 # Couche Application (Use Cases)
│   ├── use-cases/              # Cas d'usage
│   │   ├── BaseUseCase.js
│   │   ├── LoginUseCase.js
│   │   ├── GetInterviewsUseCase.js
│   │   └── CreateInterviewUseCase.js
│   └── dtos/                   # Data Transfer Objects
│       ├── LoginDTO.js
│       └── InterviewDTO.js
│
├── infrastructure/              # Couche Infrastructure
│   ├── http/                   # Client HTTP
│   │   └── httpClient.js
│   ├── storage/                # Stockage local
│   │   └── storageService.js
│   └── repositories/           # Implémentations des repositories
│       ├── UserRepository.js
│       └── InterviewRepository.js
│
├── presentation/                # Couche Présentation (UI)
│   ├── components/             # Composants réutilisables
│   │   ├── common/
│   │   ├── forms/
│   │   └── layout/
│   ├── pages/                  # Pages de l'application
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── InterviewsPage.jsx
│   │   ├── CreateInterviewPage.jsx
│   │   ├── InterviewDetailPage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── UsersPage.jsx
│   └── stores/                 # État global (Zustand)
│       ├── authStore.js
│       └── uiStore.js
│
└── shared/                      # Utilitaires partagés
    ├── constants/              # Constantes
    ├── utils/                  # Fonctions utilitaires
    ├── hooks/                  # Hooks personnalisés
    └── styles/                 # Thème et styles
```

## 🎯 Principes Architecturaux

### 1. Séparation des Responsabilités
- **Domaine** : Logique métier pure, sans dépendances externes
- **Application** : Orchestration des cas d'usage
- **Infrastructure** : Détails techniques (API, stockage)
- **Présentation** : Interface utilisateur et interactions

### 2. Inversion des Dépendances
- Les couches internes ne dépendent jamais des couches externes
- Utilisation d'interfaces pour découpler les composants
- Injection de dépendances pour la testabilité

### 3. Entités et Objets Valeur
- **Entités** : Objets avec identité (User, Interview, Question)
- **Objets Valeur** : Objets sans identité (Email, QuestionCode)
- Validation et logique métier encapsulées

### 4. Use Cases
- Un use case par action métier
- Validation des entrées
- Orchestration de la logique métier
- Gestion des erreurs centralisée

## 🛠️ Technologies Utilisées

### Core
- **React 18.2.0** - Bibliothèque UI
- **Vite** - Build tool moderne et rapide
- **JavaScript ES6+** - Langage de programmation

### UI/UX
- **Material-UI (MUI)** - Composants UI
- **React Router** - Navigation
- **Material Icons** - Icônes

### État et Data
- **Zustand** - Gestion d'état simple et performante
- **Axios** - Client HTTP
- **React Hook Form** - Gestion des formulaires

### Tests
- **Vitest** - Framework de test
- **Testing Library** - Tests des composants React
- **jsdom** - Environnement DOM pour les tests

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation
```bash
# Installation des dépendances
npm install

# Démarrage en mode développement
npm run dev

# Build de production
npm run build

# Prévisualisation du build
npm run preview

# Lancement des tests
npm run test

# Tests en mode watch
npm run test:watch

# Coverage des tests
npm run test:coverage
```

### Configuration
Créer un fichier `.env` :
```env
VITE_API_URL=http://localhost:3001/api
```

## 📋 Fonctionnalités

### Authentification
- Connexion/Déconnexion
- Gestion des tokens JWT
- Refresh automatique des tokens
- Protection des routes

### Gestion des Entretiens
- Liste des entretiens
- Création d'entretiens
- Détails d'entretien
- Statuts et progression

### Gestion des Utilisateurs
- Profil utilisateur
- Liste des utilisateurs (admin/manager)
- Rôles et permissions

### Interface Utilisateur
- Design responsive
- Thème cohérent (vert agricole)
- Navigation intuitive
- Feedback utilisateur (snackbars, loading)

## 🧪 Tests

### Structure des Tests
```
src/tests/
├── unit/                       # Tests unitaires
│   ├── domain/                 # Tests des entités
│   ├── application/            # Tests des use cases
│   └── infrastructure/         # Tests des repositories
├── integration/                # Tests d'intégration
└── e2e/                       # Tests end-to-end
```

### Stratégie de Test
- **Tests unitaires** : Entités, use cases, utilitaires
- **Tests d'intégration** : Repositories, stores
- **Tests de composants** : Composants React isolés
- **Tests E2E** : Parcours utilisateur complets

## 🔧 Outils de Développement

### Linting et Formatage
```bash
# ESLint
npm run lint

# Prettier
npm run format
```

### Analyse de Bundle
```bash
npm run analyze
```

## 📝 Conventions de Code

### Nommage
- **Composants** : PascalCase (UserProfile.jsx)
- **Fichiers** : camelCase (userService.js)
- **Constantes** : UPPER_SNAKE_CASE (API_BASE_URL)
- **Variables/Fonctions** : camelCase (getUserData)

### Structure des Fichiers
- Un composant par fichier
- Export par défaut pour les composants principaux
- Exports nommés pour les utilitaires
- Imports groupés et ordonnés

### Gestion des Erreurs
- Try-catch dans les use cases
- Messages d'erreur localisés
- Logging des erreurs pour le debug
- Affichage utilisateur via snackbars

## 🚦 États de l'Application

### États de Chargement
- Loading spinners
- Skeleton loaders
- Progress indicators

### États d'Erreur
- Messages d'erreur contextuels
- Pages d'erreur dédiées
- Retry mechanisms

### États Vides
- Empty states informatifs
- Actions suggérées
- Illustrations cohérentes

## 🔒 Sécurité

### Authentification
- Tokens JWT sécurisés
- Refresh tokens automatiques
- Déconnexion automatique

### Validation
- Validation côté client et serveur
- Sanitisation des entrées
- Protection XSS

### Routes
- Protection par rôles
- Redirections sécurisées
- Guards de navigation

## 📊 Performance

### Optimisations
- Code splitting par routes
- Lazy loading des composants
- Memoization des calculs coûteux
- Optimisation des re-renders

### Métriques
- Bundle size analysis
- Performance profiling
- Memory usage monitoring

## 🌟 Bonnes Pratiques

### Clean Code
- Fonctions courtes et focalisées
- Noms explicites et parlants
- Éviter la duplication de code
- Commentaires pertinents uniquement

### React
- Hooks personnalisés pour la logique réutilisable
- Composants fonctionnels avec hooks
- Props drilling évité avec contexte/store
- Refs utilisées avec parcimonie

### Architecture
- Dépendances unidirectionnelles
- Couplage faible, cohésion forte
- Testabilité privilégiée
- Évolutivité et maintenabilité

## 🤝 Contribution

1. Fork du projet
2. Création d'une branche feature
3. Commits atomiques avec messages clairs
4. Tests pour les nouvelles fonctionnalités
5. Pull request avec description détaillée

## 📄 License

Ce projet est sous licence MIT.