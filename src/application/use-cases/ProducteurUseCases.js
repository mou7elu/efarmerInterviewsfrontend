/**
 * Producteur Use Cases
 * Cas d'utilisation pour la gestion des producteurs agricoles
 */

import { ValidationError, NotFoundError, ConflictError } from '@shared/errors/DomainErrors.js';
import { ProducteurEntity } from '@domain/entities/ProducteurEntity.js';

export class ProducteurUseCases {
  constructor(producteurRepository, fileUploadService, notificationService) {
    this.producteurRepository = producteurRepository;
    this.fileUploadService = fileUploadService;
    this.notificationService = notificationService;
  }

  /**
   * Obtenir tous les producteurs avec pagination et filtres
   */
  async getAllProducteurs(params) {
    try {
      const result = await this.producteurRepository.findAll(params);
      
      return {
        success: true,
        data: {
          producteurs: result.producteurs.map(p => p.toPlainObject()),
          pagination: {
            total: result.total,
            page: result.page,
            totalPages: result.totalPages,
            limit: params.limit || 10
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtenir un producteur par son ID
   */
  async getProducteurById(id) {
    try {
      if (!id) {
        throw new ValidationError('L\'ID du producteur est requis');
      }

      const producteur = await this.producteurRepository.findById(id);
      
      if (!producteur) {
        throw new NotFoundError('Producteur non trouvé');
      }

      return {
        success: true,
        data: producteur.toPlainObject()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Créer un nouveau producteur
   */
  async createProducteur(producteurData, createdBy) {
    try {
      // Vérifier si le numéro de téléphone existe déjà
      if (producteurData.numeroTelephone) {
        const existing = await this.producteurRepository.findByPhone(producteurData.numeroTelephone);
        if (existing) {
          throw new ConflictError('Un producteur avec ce numéro de téléphone existe déjà');
        }
      }

      const producteur = new ProducteurEntity({
        ...producteurData,
        createdBy
      });

      const savedProducteur = await this.producteurRepository.create(producteur);

      // Envoyer une notification de création
      await this.notificationService.send({
        type: 'producteur_created',
        recipient: createdBy,
        data: { producteurId: savedProducteur.getId() }
      });

      return {
        success: true,
        data: savedProducteur.toPlainObject()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Mettre à jour un producteur
   */
  async updateProducteur(id, updateData, updatedBy) {
    try {
      const existingProducteur = await this.producteurRepository.findById(id);
      
      if (!existingProducteur) {
        throw new NotFoundError('Producteur non trouvé');
      }

      // Vérifier les permissions
      if (existingProducteur.createdBy !== updatedBy && !this.isAdmin(updatedBy)) {
        throw new ValidationError('Permissions insuffisantes pour modifier ce producteur');
      }

      // Vérifier le numéro de téléphone si modifié
      if (updateData.numeroTelephone && updateData.numeroTelephone !== existingProducteur.numeroTelephone) {
        const existing = await this.producteurRepository.findByPhone(updateData.numeroTelephone);
        if (existing && existing.getId() !== id) {
          throw new ConflictError('Un autre producteur avec ce numéro de téléphone existe déjà');
        }
      }

      const updatedProducteur = new ProducteurEntity({
        ...existingProducteur.toPlainObject(),
        ...updateData,
        id,
        updatedAt: new Date()
      });

      const savedProducteur = await this.producteurRepository.update(id, updatedProducteur);

      return {
        success: true,
        data: savedProducteur.toPlainObject()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Télécharger une photo de profil
   */
  async uploadPhoto(producteurId, photoFile, uploadedBy) {
    try {
      const producteur = await this.producteurRepository.findById(producteurId);
      
      if (!producteur) {
        throw new NotFoundError('Producteur non trouvé');
      }

      // Valider le fichier
      if (!this.fileUploadService.isValidImageFile(photoFile)) {
        throw new ValidationError('Format de fichier non valide pour la photo');
      }

      // Télécharger le fichier
      const uploadResult = await this.fileUploadService.uploadImage(photoFile, {
        folder: 'producteurs/photos',
        maxSize: 5 * 1024 * 1024, // 5MB
        resize: { width: 400, height: 400 }
      });

      // Mettre à jour le producteur
      const updatedProducteur = await this.producteurRepository.uploadPhoto(producteurId, {
        filename: uploadResult.filename,
        path: uploadResult.path,
        url: uploadResult.url
      });

      return {
        success: true,
        data: updatedProducteur.toPlainObject()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Télécharger une pièce d'identité
   */
  async uploadPiece(producteurId, pieceFile, uploadedBy) {
    try {
      const producteur = await this.producteurRepository.findById(producteurId);
      
      if (!producteur) {
        throw new NotFoundError('Producteur non trouvé');
      }

      // Valider le fichier
      if (!this.fileUploadService.isValidDocumentFile(pieceFile)) {
        throw new ValidationError('Format de fichier non valide pour la pièce d\'identité');
      }

      // Télécharger le fichier
      const uploadResult = await this.fileUploadService.uploadDocument(pieceFile, {
        folder: 'producteurs/pieces',
        maxSize: 10 * 1024 * 1024 // 10MB
      });

      // Mettre à jour le producteur
      const updatedProducteur = await this.producteurRepository.uploadPiece(producteurId, {
        filename: uploadResult.filename,
        path: uploadResult.path,
        url: uploadResult.url,
        type: pieceFile.type
      });

      return {
        success: true,
        data: updatedProducteur.toPlainObject()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Vérifier un producteur
   */
  async verifyProducteur(producteurId, verifiePar) {
    try {
      const producteur = await this.producteurRepository.findById(producteurId);
      
      if (!producteur) {
        throw new NotFoundError('Producteur non trouvé');
      }

      if (producteur.isVerified) {
        throw new ValidationError('Le producteur est déjà vérifié');
      }

      if (!producteur.hasDocuments) {
        throw new ValidationError('Les documents sont requis pour la vérification');
      }

      const verifiedProducteur = await this.producteurRepository.verify(producteurId, verifiePar);

      // Envoyer une notification
      await this.notificationService.send({
        type: 'producteur_verified',
        recipient: producteur.createdBy,
        data: { producteurId, verifiePar }
      });

      return {
        success: true,
        data: verifiedProducteur.toPlainObject()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Rejeter la vérification d'un producteur
   */
  async rejectProducteur(producteurId, reason, rejetePar) {
    try {
      const producteur = await this.producteurRepository.findById(producteurId);
      
      if (!producteur) {
        throw new NotFoundError('Producteur non trouvé');
      }

      if (producteur.isRejected) {
        throw new ValidationError('Le producteur est déjà rejeté');
      }

      const rejectedProducteur = await this.producteurRepository.reject(producteurId, reason, rejetePar);

      // Envoyer une notification
      await this.notificationService.send({
        type: 'producteur_rejected',
        recipient: producteur.createdBy,
        data: { producteurId, reason, rejetePar }
      });

      return {
        success: true,
        data: rejectedProducteur.toPlainObject()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Rechercher des producteurs
   */
  async searchProducteurs(query, filters = {}) {
    try {
      if (!query || query.trim().length < 2) {
        throw new ValidationError('La requête de recherche doit contenir au moins 2 caractères');
      }

      // Recherche par nom
      const producteursByName = await this.producteurRepository.searchByName(query, filters);

      // Recherche par téléphone si la requête ressemble à un numéro
      let producteursByPhone = [];
      if (/^\d+/.test(query)) {
        const producteur = await this.producteurRepository.findByPhone(query);
        if (producteur) {
          producteursByPhone = [producteur];
        }
      }

      // Combiner et déduper les résultats
      const allResults = [...producteursByName, ...producteursByPhone];
      const uniqueResults = allResults.filter((producteur, index, array) => 
        array.findIndex(p => p.getId() === producteur.getId()) === index
      );

      return {
        success: true,
        data: uniqueResults.map(p => p.toPlainObject())
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtenir les statistiques des producteurs
   */
  async getStatistics(filters = {}) {
    try {
      const stats = await this.producteurRepository.getStatistics(filters);
      const geoDistribution = await this.producteurRepository.getGeographicDistribution();
      const cropDistribution = await this.producteurRepository.getCropDistribution();

      return {
        success: true,
        data: {
          global: stats,
          geographic: geoDistribution,
          crops: cropDistribution
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Exporter des producteurs
   */
  async exportProducteurs(format = 'csv', filters = {}) {
    try {
      let exportData;

      switch (format.toLowerCase()) {
        case 'csv':
          exportData = await this.producteurRepository.exportToCSV(filters);
          break;
        default:
          throw new ValidationError('Format d\'export non supporté');
      }

      return {
        success: true,
        data: exportData,
        contentType: this.getContentType(format)
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Importer des producteurs
   */
  async importProducteurs(file, options = {}, importedBy) {
    try {
      if (!this.fileUploadService.isValidCSVFile(file)) {
        throw new ValidationError('Fichier CSV invalide');
      }

      const result = await this.producteurRepository.importFromCSV(file, {
        ...options,
        createdBy: importedBy
      });

      // Envoyer une notification du résultat d'import
      await this.notificationService.send({
        type: 'producteur_import_completed',
        recipient: importedBy,
        data: result
      });

      return {
        success: true,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Supprimer un producteur
   */
  async deleteProducteur(id, deletedBy) {
    try {
      const producteur = await this.producteurRepository.findById(id);
      
      if (!producteur) {
        throw new NotFoundError('Producteur non trouvé');
      }

      // Vérifier les permissions
      if (producteur.createdBy !== deletedBy && !this.isAdmin(deletedBy)) {
        throw new ValidationError('Permissions insuffisantes pour supprimer ce producteur');
      }

      const deleted = await this.producteurRepository.delete(id);

      if (deleted) {
        // Supprimer les fichiers associés
        if (producteur.photoProfil) {
          await this.fileUploadService.deleteFile(producteur.photoProfil.path);
        }
        if (producteur.pieceIdentite) {
          await this.fileUploadService.deleteFile(producteur.pieceIdentite.path);
        }
      }

      return {
        success: deleted,
        message: deleted ? 'Producteur supprimé avec succès' : 'Échec de la suppression'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Méthodes utilitaires privées
  isAdmin(userId) {
    // Implémentation à définir selon la logique métier
    return false;
  }

  getContentType(format) {
    const contentTypes = {
      csv: 'text/csv',
      json: 'application/json',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    };
    return contentTypes[format.toLowerCase()] || 'application/octet-stream';
  }
}