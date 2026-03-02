const { MongoParcelleRepository } = require('../../infrastructure/repositories/MongoParcelleRepository');
const { ParcelleEntity } = require('../../domain/entities/ParcelleEntity');
const { ValidationError } = require('../../shared/errors/ValidationError');
const { NotFoundError } = require('../../shared/errors/NotFoundError');
const { DuplicateError } = require('../../shared/errors/DuplicateError');
const Producteur = require('../../../models/Producteur');

/**
 * Contrôleur pour la gestion des parcelles
 */
class ParcelleController {
  constructor() {
    this.parcelleRepository = new MongoParcelleRepository();
    
    // Bind des méthodes pour préserver le contexte
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.getByProducteur = this.getByProducteur.bind(this);
    this.search = this.search.bind(this);
    this.getStatistiques = this.getStatistiques.bind(this);
    this.updateGPS = this.updateGPS.bind(this);
    this.getByLocation = this.getByLocation.bind(this);
  }

  /**
   * Récupérer toutes les parcelles avec pagination
   */
  async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const codeProducteur = req.query.producteur;

      const result = await this.parcelleRepository.findPaginated(page, limit, codeProducteur);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Parcelles récupérées avec succès'
      });
    } catch (error) {
      console.error('Erreur getAll parcelles:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des parcelles',
        error: error.message
      });
    }
  }

  /**
   * Récupérer une parcelle par ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID de la parcelle requis'
        });
      }

      const parcelle = await this.parcelleRepository.findById(id);
      
      if (!parcelle) {
        return res.status(404).json({
          success: false,
          message: 'Parcelle non trouvée'
        });
      }

      res.status(200).json({
        success: true,
        data: parcelle,
        message: 'Parcelle récupérée avec succès'
      });
    } catch (error) {
      console.error('Erreur getById parcelle:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de la parcelle',
        error: error.message
      });
    }
  }

  /**
   * Créer une nouvelle parcelle
   */
  async create(req, res) {
    try {
      const { 
        code,
        numParcelle, 
        producteurId,
        codeProducteur, 
        superficie,
        surface, 
        coordonnee
      } = req.body;

      // Support both old and new field names
      const parcelleCode = code || numParcelle;
      const parcelleSurface = superficie !== undefined ? superficie : surface;

      // Validation des champs requis
      if (!parcelleCode || parcelleSurface === undefined || parcelleSurface === null) {
        return res.status(400).json({
          success: false,
          message: 'Code de parcelle et superficie sont requis'
        });
      }

      // Chercher le producteur par son code pour obtenir l'ObjectId
      let producteurObjectId = producteurId || null;
      if (!producteurObjectId && codeProducteur) {
        const producteur = await Producteur.findOne({ Code: codeProducteur });
        console.log('Recherche producteur avec code:', codeProducteur, 'Trouvé:', producteur ? producteur._id : 'NON TROUVÉ');
        if (!producteur) {
          return res.status(400).json({
            success: false,
            message: `Producteur avec le code ${codeProducteur} non trouvé`
          });
        }
        producteurObjectId = producteur._id.toString();
      }

      console.log('ProducteurObjectId final:', producteurObjectId);

      // Parse coordinates from coordonnee if provided (JSON string or object)
      let coordonneeStr = null;
      if (coordonnee) {
        coordonneeStr = typeof coordonnee === 'string' ? coordonnee : JSON.stringify(coordonnee);
      } else if (gpsLatitude && gpsLongitude) {
        coordonneeStr = JSON.stringify({ latitude: parseFloat(gpsLatitude), longitude: parseFloat(gpsLongitude) });
      }

      // Créer l'entité parcelle
      const parcelle = new ParcelleEntity({
        code: parcelleCode,
        producteurId: producteurObjectId,
        superficie: parseFloat(parcelleSurface),
        coordonnee: coordonneeStr
      });

      const savedParcelle = await this.parcelleRepository.create(parcelle);

      res.status(201).json({
        success: true,
        data: savedParcelle,
        message: 'Parcelle créée avec succès'
      });
    } catch (error) {
      console.error('Erreur create parcelle:', error);
      
      if (error instanceof ValidationError) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      
      if (error instanceof DuplicateError) {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création de la parcelle',
        error: error.message
      });
    }
  }

  /**
   * Mettre à jour une parcelle
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      
      // Accepter les clés en minuscules (mobile/API) OU en format frontend
      const superficie = req.body.superficie ?? req.body.surface;
      const parcelleCode = req.body.code ?? req.body.numParcelle;
      const producteurId = req.body.producteurId ?? req.body.codeProducteur;
      const coordonnee = req.body.coordonnee;
      const cleProdMobi = req.body.cleProdMobi;
      const clePlantMobi = req.body.clePlantMobi;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID de la parcelle requis'
        });
      }

      // Validation de l'ObjectId
      const mongoose = require('mongoose');
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: `ID invalide: ${id}. Un ObjectId MongoDB valide est requis.`
        });
      }

      // Récupérer la parcelle existante
      const existingParcelle = await this.parcelleRepository.findById(id);
      if (!existingParcelle) {
        return res.status(404).json({
          success: false,
          message: 'Parcelle non trouvée'
        });
      }

      // Créer une nouvelle entité avec les données mises à jour
      const updatedData = {
        id: existingParcelle.id,
        superficie: superficie !== undefined ? parseFloat(superficie) : existingParcelle.superficie,
        coordonnee: coordonnee !== undefined ? coordonnee : existingParcelle.coordonnee?.value,
        producteurId: producteurId !== undefined ? producteurId : existingParcelle.producteurId,
        code: parcelleCode !== undefined ? parcelleCode : existingParcelle.code,
        cleProdMobi: cleProdMobi !== undefined ? cleProdMobi : existingParcelle.cleProdMobi,
        clePlantMobi: clePlantMobi !== undefined ? clePlantMobi : existingParcelle.clePlantMobi,
        createdAt: existingParcelle.createdAt,
        updatedAt: new Date()
      };

      const updatedParcelle = new (require('../../domain/entities/ParcelleEntity').ParcelleEntity)(updatedData);
      const savedParcelle = await this.parcelleRepository.update(id, updatedParcelle);

      res.status(200).json({
        success: true,
        data: savedParcelle,
        message: 'Parcelle mise à jour avec succès'
      });
    } catch (error) {
      console.error('Erreur update parcelle:', error);
      
      if (error instanceof ValidationError) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      
      if (error instanceof NotFoundError) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour de la parcelle',
        error: error.message
      });
    }
  }

  /**
   * Supprimer une parcelle
   */
  async delete(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID de la parcelle requis'
        });
      }

      await this.parcelleRepository.delete(id);

      res.status(200).json({
        success: true,
        message: 'Parcelle supprimée avec succès'
      });
    } catch (error) {
      console.error('Erreur delete parcelle:', error);
      
      if (error instanceof NotFoundError) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression de la parcelle',
        error: error.message
      });
    }
  }

  /**
   * Récupérer les parcelles d'un producteur
   */
  async getByProducteur(req, res) {
    try {
      const { codeProducteur } = req.params;

      if (!codeProducteur) {
        return res.status(400).json({
          success: false,
          message: 'Code producteur requis'
        });
      }

      const parcelles = await this.parcelleRepository.findByProducteur(codeProducteur);

      res.status(200).json({
        success: true,
        data: parcelles,
        message: 'Parcelles du producteur récupérées avec succès'
      });
    } catch (error) {
      console.error('Erreur getByProducteur parcelles:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des parcelles du producteur',
        error: error.message
      });
    }
  }

  /**
   * Rechercher des parcelles
   */
  async search(req, res) {
    try {
      const { 
        codeProducteur, 
        surfaceMin, 
        surfaceMax, 
        numParcelle 
      } = req.query;

      const criteria = {};
      if (codeProducteur) criteria.codeProducteur = codeProducteur;
      if (surfaceMin) criteria.surfaceMin = parseFloat(surfaceMin);
      if (surfaceMax) criteria.surfaceMax = parseFloat(surfaceMax);
      if (numParcelle) criteria.numParcelle = numParcelle;

      const parcelles = await this.parcelleRepository.searchParcelles(criteria);

      res.status(200).json({
        success: true,
        data: parcelles,
        message: 'Recherche effectuée avec succès'
      });
    } catch (error) {
      console.error('Erreur search parcelles:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la recherche des parcelles',
        error: error.message
      });
    }
  }

  /**
   * Obtenir les statistiques des parcelles
   */
  async getStatistiques(req, res) {
    try {
      const stats = await this.parcelleRepository.getStatistiques();

      res.status(200).json({
        success: true,
        data: stats,
        message: 'Statistiques récupérées avec succès'
      });
    } catch (error) {
      console.error('Erreur getStatistiques parcelles:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des statistiques',
        error: error.message
      });
    }
  }

  /**
   * Mettre à jour les coordonnées GPS d'une parcelle
   */
  async updateGPS(req, res) {
    try {
      const { id } = req.params;
      const { latitude, longitude } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID de la parcelle requis'
        });
      }

      if (latitude === undefined || longitude === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Latitude et longitude requises'
        });
      }

      const parcelle = await this.parcelleRepository.updateGPS(
        id, 
        parseFloat(latitude), 
        parseFloat(longitude)
      );

      res.status(200).json({
        success: true,
        data: parcelle,
        message: 'Coordonnées GPS mises à jour avec succès'
      });
    } catch (error) {
      console.error('Erreur updateGPS parcelle:', error);
      
      if (error instanceof NotFoundError) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour des coordonnées GPS',
        error: error.message
      });
    }
  }

  /**
   * Rechercher des parcelles par localisation
   */
  async getByLocation(req, res) {
    try {
      const { latitude, longitude, radius } = req.query;

      if (!latitude || !longitude) {
        return res.status(400).json({
          success: false,
          message: 'Latitude et longitude requises'
        });
      }

      const radiusKm = radius ? parseFloat(radius) : 10; // 10km par défaut

      const parcelles = await this.parcelleRepository.findByLocation(
        parseFloat(latitude),
        parseFloat(longitude),
        radiusKm
      );

      res.status(200).json({
        success: true,
        data: parcelles,
        message: 'Parcelles dans la zone récupérées avec succès'
      });
    } catch (error) {
      console.error('Erreur getByLocation parcelles:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la recherche par localisation',
        error: error.message
      });
    }
  }
}

module.exports = { ParcelleController };