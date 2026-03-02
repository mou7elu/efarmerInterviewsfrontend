# Installation et Configuration - eFarmer Interviews Backend

## 🚀 Installation

### Prérequis
- Node.js >= 16.0.0
- npm >= 8.0.0
- MongoDB >= 5.0.0

### Installation des dépendances
```bash
cd backend
npm install
```

### Variables d'environnement
Créer un fichier `.env` à la racine du projet backend :

```env
# Database
MONGODB_URI=mongodb://localhost:27017/efarmer_interviews
DB_NAME=efarmer_interviews

# Server
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Logging
LOG_LEVEL=debug

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Email (optionnel)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 🏗️ Structure de démarrage

### 1. Point d'entrée principal
```javascript
// server.js
const app = require('./src/app');
const { connectDatabase } = require('./src/infrastructure/database/connection');

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await connectDatabase();
    console.log('✅ Database connected successfully');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📖 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
```

### 2. Configuration de l'application
```javascript
// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { errorHandler } = require('./infrastructure/web/middlewares/errorHandler');
const { rateLimiter } = require('./infrastructure/web/middlewares/rateLimiter');
const routes = require('./infrastructure/web/routes');

const app = express();

// Security middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
  credentials: true
}));

// Request parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('combined'));

// Rate limiting
app.use(rateLimiter);

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

module.exports = app;
```

## 🔧 Configuration des dépendances

### Package.json
```json
{
  "name": "efarmer-interviews-backend",
  "version": "1.0.0",
  "description": "Backend API for eFarmer Interviews application",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "db:seed": "node scripts/seed.js",
    "db:migrate": "node scripts/migrate.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "morgan": "^1.10.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "joi": "^17.9.2",
    "express-rate-limit": "^6.10.0",
    "multer": "^1.4.5-lts.1",
    "compression": "^1.7.4",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.6.2",
    "supertest": "^6.3.3",
    "eslint": "^8.47.0",
    "eslint-config-airbnb-base": "^15.0.0",
    "eslint-plugin-import": "^2.28.1",
    "@types/jest": "^29.5.4"
  },
  "keywords": ["nodejs", "express", "mongodb", "clean-architecture", "solid"],
  "author": "eFarmer Team",
  "license": "MIT"
}
```

## 🗄️ Configuration MongoDB

### Connexion à la base de données
```javascript
// src/infrastructure/database/connection.js
const mongoose = require('mongoose');

class DatabaseConnection {
  static instance = null;

  static getInstance() {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  async connect() {
    try {
      const connectionString = process.env.MONGODB_URI;
      
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        heartbeatFrequencyMS: 2000,
        retryWrites: true,
        w: 'majority'
      };

      await mongoose.connect(connectionString, options);
      
      mongoose.connection.on('error', (error) => {
        console.error('MongoDB connection error:', error);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected');
      });

      mongoose.connection.on('reconnected', () => {
        console.log('MongoDB reconnected');
      });

      return mongoose.connection;
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  async disconnect() {
    await mongoose.disconnect();
  }
}

module.exports = {
  connectDatabase: () => DatabaseConnection.getInstance().connect(),
  disconnectDatabase: () => DatabaseConnection.getInstance().disconnect()
};
```

## 🛡️ Middlewares

### Gestionnaire d'erreurs
```javascript
// src/infrastructure/web/middlewares/errorHandler.js
const { DomainError } = require('../../../shared/errors/DomainError');

const errorHandler = (error, req, res, next) => {
  console.error('Error details:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  if (error instanceof DomainError) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        type: error.constructor.name,
        message: error.message,
        code: error.code,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      }
    });
  }

  // Erreurs Mongoose
  if (error.name === 'ValidationError') {
    const validationErrors = Object.values(error.errors).map(err => ({
      field: err.path,
      message: err.message
    }));
    
    return res.status(400).json({
      success: false,
      error: {
        type: 'ValidationError',
        message: 'Données invalides',
        details: validationErrors
      }
    });
  }

  // Erreur par défaut
  res.status(500).json({
    success: false,
    error: {
      type: 'InternalServerError',
      message: process.env.NODE_ENV === 'production' 
        ? 'Erreur interne du serveur' 
        : error.message
    }
  });
};

module.exports = { errorHandler };
```

### Rate Limiting
```javascript
// src/infrastructure/web/middlewares/rateLimiter.js
const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    error: {
      type: 'RateLimitError',
      message: 'Trop de requêtes, veuillez réessayer plus tard'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = { rateLimiter };
```

## 🔐 Authentification JWT

### Middleware d'authentification
```javascript
// src/infrastructure/web/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('../../../shared/errors/AuthenticationError');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Token manquant');
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AuthenticationError('Token invalide'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AuthenticationError('Token expiré'));
    }
    next(error);
  }
};

const optionalAuth = (req, res, next) => {
  try {
    authMiddleware(req, res, next);
  } catch (error) {
    req.user = null;
    next();
  }
};

module.exports = { authMiddleware, optionalAuth };
```

## 📝 Scripts utiles

### Script de seed
```javascript
// scripts/seed.js
const { connectDatabase } = require('../src/infrastructure/database/connection');
const { MongoUserRepository } = require('../src/infrastructure/repositories/MongoUserRepository');
const { CreateUserUseCase } = require('../src/application/use-cases/user/CreateUserUseCase');

async function seedDatabase() {
  try {
    await connectDatabase();
    console.log('🌱 Starting database seeding...');

    const userRepository = new MongoUserRepository();
    const createUserUseCase = new CreateUserUseCase(userRepository);

    // Créer un utilisateur admin
    await createUserUseCase.execute({
      email: 'admin@efarmer.com',
      password: 'Admin123!',
      nom: 'Administrateur',
      prenom: 'Système',
      role: 'admin'
    });

    console.log('✅ Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
```

### Script de démarrage avec nodemon
```javascript
// nodemon.json
{
  "watch": ["src"],
  "ext": "js,json",
  "ignore": ["src/**/*.test.js", "node_modules"],
  "env": {
    "NODE_ENV": "development"
  },
  "delay": "1000"
}
```

## 🧪 Configuration des tests

### Jest configuration
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/infrastructure/database/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
};
```

### Setup des tests
```javascript
// tests/setup.js
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
```

## 🚀 Démarrage

### Mode développement
```bash
npm run dev
```

### Mode production
```bash
npm start
```

### Tests
```bash
# Tests unitaires
npm test

# Tests en mode watch
npm run test:watch

# Coverage
npm run test:coverage
```

## 📊 Monitoring

### Health Check endpoint
L'endpoint `/health` fournit des informations sur l'état du serveur :

```json
{
  "status": "OK",
  "timestamp": "2023-10-01T12:00:00.000Z",
  "database": "connected",
  "uptime": 3600
}
```

## 🔧 Troubleshooting

### Problèmes courants

1. **Connexion MongoDB échoue**
   - Vérifier que MongoDB est démarré
   - Vérifier la variable `MONGODB_URI`
   - Vérifier les permissions réseau

2. **Erreurs JWT**
   - Vérifier la variable `JWT_SECRET`
   - Vérifier l'expiration du token

3. **Erreurs CORS**
   - Vérifier `ALLOWED_ORIGINS`
   - Vérifier les headers de la requête

Cette configuration fournit une base solide pour démarrer le backend avec l'architecture Clean Code SOLID implémentée.