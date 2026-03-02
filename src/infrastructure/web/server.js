const express = require('express');
const helmet = require('helmet');
const cors = require('cors'); // n'oublie pas d'importer cors
const apiRoutes = require('./routes');
const { errorHandler, notFoundHandler, validateJsonContent } = require('./middleware/errorHandler');

class ExpressServer {
  constructor() {
    this.app = express();

    // Définir les origines autorisées
    this.allowedOrigins = [
      'https://efarmerinterviews.netlify.app', // Production
      'http://localhost:3001', // Développement
      'http://localhost:3000' // Développement
    ];

    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupMiddleware() {
    this.app.use(
      helmet()
    );

    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // CORS CORRECTEMENT APPLIQUE
    const allowedOrigins = [
      'https://efarmerinterviews.netlify.app', // Production
      'http://localhost:3001', // Développement
      'http://localhost:3000' // Développement
    ];
    this.app.use(cors({
      origin: function(origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true
    }));
    this.app.options('*', cors({
      origin: function(origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true
    }));

    this.app.use(validateJsonContent);

    if (process.env.NODE_ENV === 'development') {
      this.app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
        if (req.body && Object.keys(req.body).length > 0) {
          console.log('Body:', JSON.stringify(req.body, null, 2));
        }
        next();
      });
    }

    this.app.use((req, res, next) => {
      res.setHeader('X-API-Version', '1.0.0');
      res.setHeader('X-Powered-By', 'eFarmer Clean Architecture');
      next();
    });
  }

  setupRoutes() {
    this.app.get('/health', (req, res) => {
      res.json({
        success: true,
        message: 'Serveur eFarmer opérationnel',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0'
      });
    });

    this.app.use('/api', apiRoutes);

    this.app.get('/', (req, res) => {
      res.json({
        success: true,
        message: 'Bienvenue sur l\'API eFarmer avec Clean Architecture',
        documentation: '/api/endpoints',
        health: '/health',
        version: '1.0.0'
      });
    });
  }

  setupErrorHandling() {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);

    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });
  }

  start(port = process.env.PORT || 3001) {
    return new Promise((resolve, reject) => {
      try {
        const server = this.app.listen(port, () => {
          console.log(`🚀 Serveur eFarmer démarré sur le port ${port}`);
          resolve(server);
        });

        server.on('error', (error) => reject(error));
      } catch (error) {
        reject(error);
      }
    });
  }

  stop(server) {
    return new Promise((resolve) => {
      if (server) server.close(() => resolve());
      else resolve();
    });
  }

  getApp() {
    return this.app;
  }
}

module.exports = { ExpressServer };
