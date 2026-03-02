const { MongoProducteurRepository } = require('../../infrastructure/repositories/MongoProducteurRepository');
const { ProducteurEntity } = require('../../domain/entities/ProducteurEntity');
const { ValidationError } = require('../../shared/errors/ValidationError');
const { NotFoundError } = require('../../shared/errors/NotFoundError');
const { DuplicateError } = require('../../shared/errors/DuplicateError');

/**
 * Contrôleur pour la gestion des producteurs
 */
class ProducteurController {
  constructor() {
    this.producteurRepository = new MongoProducteurRepository();
    
    // Bind des méthodes pour préserver le contexte
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.getByCode = this.getByCode.bind(this);
    this.search = this.search.bind(this);
    this.getStatistiques = this.getStatistiques.bind(this);
    this.updateStatut = this.updateStatut.bind(this);
  }

  /**
   * Récupérer tous les producteurs avec pagination
   */
  async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const actifSeulement = req.query.actif === 'true';

      const result = await this.producteurRepository.findPaginated(page, limit, actifSeulement);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Producteurs récupérés avec succès'
      });
    } catch (error) {
      console.error('Erreur getAll producteurs:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des producteurs',
        error: error.message
      });
    }
  }

  /**
   * Récupérer un producteur par ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID du producteur requis'
        });
      }

      const producteur = await this.producteurRepository.findById(id);
      
      if (!producteur) {
        return res.status(404).json({
          success: false,
          message: 'Producteur non trouvé'
        });
      }

      res.status(200).json({
        success: true,
        data: producteur,
        message: 'Producteur récupéré avec succès'
      });
    } catch (error) {
      console.error('Erreur getById producteur:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du producteur',
        error: error.message
      });
    }
  }

  /**
   * Créer un nouveau producteur
   */
  async create(req, res) {
    try {
      const { code, nom, prenom, genre, telephone1, telephone2, dateNaissance } = req.body;

      // Validation des champs requis
      if (!code || !nom || !prenom) {
        return res.status(400).json({
          success: false,
          message: 'Code, nom et prénom sont requis'
        });
      }

      // Créer l'entité producteur
      const producteur = ProducteurEntity.create({
        code,
        nom,
        prenom,
        genre: genre || 1,
        telephone1,
        telephone2,
        dateNaissance: dateNaissance ? new Date(dateNaissance) : null,
        sommeil: false
      });

      const savedProducteur = await this.producteurRepository.create(producteur);

      res.status(201).json({
        success: true,
        data: savedProducteur,
        message: 'Producteur créé avec succès'
      });
    } catch (error) {
      console.error('Erreur create producteur:', error);
      
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
        message: 'Erreur lors de la création du producteur',
        error: error.message
      });
    }
  }

  /**
   * Mettre à jour un producteur
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const { code, nom, prenom, genre, telephone1, telephone2, dateNaissance, sommeil } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID du producteur requis'
        });
      }

      // Récupérer le producteur existant
      const existingProducteur = await this.producteurRepository.findById(id);
      if (!existingProducteur) {
        return res.status(404).json({
          success: false,
          message: 'Producteur non trouvé'
        });
      }

      // Créer une nouvelle entité avec les modifications
      // Utiliser les valeurs du body ou garder les anciennes valeurs
      const updatedProducteur = new ProducteurEntity({
        id: existingProducteur.id,
        code: code || existingProducteur.code,
        nom: nom !== undefined ? nom : existingProducteur.nom?.value,
        prenom: prenom !== undefined ? prenom : existingProducteur.prenom?.value,
        telephone1: telephone1 !== undefined ? telephone1 : existingProducteur.telephone1,
        telephone2: telephone2 !== undefined ? telephone2 : existingProducteur.telephone2,
        dateNaissance: dateNaissance !== undefined ? (dateNaissance ? new Date(dateNaissance) : null) : existingProducteur.dateNaissance,
        lieuNaissance: existingProducteur.lieuNaissance?.value,
        genre: genre !== undefined ? genre : existingProducteur.genre,
        photo: existingProducteur.photo,
        signature: existingProducteur.signature,
        dateSigne: existingProducteur.dateSigne,
        cleProdMobi: existingProducteur.cleProdMobi,
        sommeil: sommeil !== undefined ? sommeil : existingProducteur.sommeil,
        createdAt: existingProducteur.createdAt,
        updatedAt: new Date()
      });

      const savedProducteur = await this.producteurRepository.update(id, updatedProducteur);

      res.status(200).json({
        success: true,
        data: savedProducteur,
        message: 'Producteur mis à jour avec succès'
      });
    } catch (error) {
      console.error('Erreur update producteur:', error);
      
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
      
      if (error instanceof DuplicateError) {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du producteur',
        error: error.message
      });
    }
  }

  /**
   * Supprimer un producteur
   */
  async delete(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID du producteur requis'
        });
      }

      await this.producteurRepository.delete(id);

      res.status(200).json({
        success: true,
        message: 'Producteur supprimé avec succès'
      });
    } catch (error) {
      console.error('Erreur delete producteur:', error);
      
      if (error instanceof NotFoundError) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression du producteur',
        error: error.message
      });
    }
  }

  /**
   * Récupérer un producteur par code
   */
  async getByCode(req, res) {
    try {
      const { code } = req.params;

      if (!code) {
        return res.status(400).json({
          success: false,
          message: 'Code du producteur requis'
        });
      }

      const producteur = await this.producteurRepository.findByCode(code);
      
      if (!producteur) {
        return res.status(404).json({
          success: false,
          message: 'Producteur non trouvé'
        });
      }

      res.status(200).json({
        success: true,
        data: producteur,
        message: 'Producteur récupéré avec succès'
      });
    } catch (error) {
      console.error('Erreur getByCode producteur:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du producteur',
        error: error.message
      });
    }
  }

  /**
   * Rechercher des producteurs
   */
  async search(req, res) {
    try {
      const { nom, prenom, genre, telephone, actif } = req.query;

      const criteria = {};
      if (nom) criteria.nom = nom;
      if (prenom) criteria.prenom = prenom;
      if (genre) criteria.genre = parseInt(genre);
      if (telephone) criteria.telephone = telephone;
      if (actif !== undefined) criteria.actifSeulement = actif === 'true';

      const producteurs = await this.producteurRepository.searchProducteurs(criteria);

      res.status(200).json({
        success: true,
        data: producteurs,
        message: 'Recherche effectuée avec succès'
      });
    } catch (error) {
      console.error('Erreur search producteurs:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la recherche des producteurs',
        error: error.message
      });
    }
  }

  /**
   * Obtenir les statistiques des producteurs
   */
  async getStatistiques(req, res) {
    try {
      const stats = await this.producteurRepository.getStatistiques();

      res.status(200).json({
        success: true,
        data: stats,
        message: 'Statistiques récupérées avec succès'
      });
    } catch (error) {
      console.error('Erreur getStatistiques producteurs:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des statistiques',
        error: error.message
      });
    }
  }

  /**
   * Mettre à jour le statut d'un producteur
   */
  async updateStatut(req, res) {
    try {
      const { id } = req.params;
      const { sommeil } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID du producteur requis'
        });
      }

      if (sommeil === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Statut sommeil requis'
        });
      }

      const producteur = await this.producteurRepository.updateStatut(id, sommeil);

      res.status(200).json({
        success: true,
        data: producteur,
        message: 'Statut mis à jour avec succès'
      });
    } catch (error) {
      console.error('Erreur updateStatut producteur:', error);
      
      if (error instanceof NotFoundError) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du statut',
        error: error.message
      });
    }
  }
}

module.exports = { ProducteurController };