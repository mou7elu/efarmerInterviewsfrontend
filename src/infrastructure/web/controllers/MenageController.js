const {
  CreateMenageUseCase,
  GetMenageUseCase,
  GetAllMenageUseCase,
  GetMenageByLocaliteUseCase,
  GetMenageByEnqueteurUseCase,
  GetMenageWithAnacardeProducteursUseCase,
  GetMenageWithFullHierarchyUseCase,
  UpdateMenageUseCase,
  DeleteMenageUseCase
} = require('../../../application/use-cases/administrative/MenageUseCases');

const pdfGeneratorService = require('../../../services/pdfGenerator');
const { NotFoundError } = require('../../../shared/errors/NotFoundError');

/**
 * Menage Controller
 */
class MenageController {
  /**
   * Create a new ménage
   */
  async create(req, res) {
    try {
      console.log('🏠 MenageController.create - Début');
      console.log('📦 Données reçues:', JSON.stringify(req.body, null, 2));
      const useCase = new CreateMenageUseCase();
      const menage = await useCase.execute(req.body);
      console.log('✅ Ménage créé avec succès:', menage);
      res.status(201).json(menage);
    } catch (error) {
      console.error('❌ Erreur MenageController.create:', error.message);
      console.error('📋 Stack:', error.stack);
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get ménage by ID
   */
  async getById(req, res) {
    try {
      const useCase = new GetMenageUseCase();
      const menage = await useCase.execute(req.params.id);
      res.json(menage);
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get all ménages
   */
  async getAll(req, res) {
    try {
      const useCase = new GetAllMenageUseCase();
      const menages = await useCase.execute(req.query);
      res.json(menages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get ménages by localité
   */
  async getByLocalite(req, res) {
    try {
      const useCase = new GetMenageByLocaliteUseCase();
      const menages = await useCase.execute(req.params.localiteId);
      res.json(menages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get ménages by enquêteur
   */
  async getByEnqueteur(req, res) {
    try {
      const useCase = new GetMenageByEnqueteurUseCase();
      const menages = await useCase.execute(req.params.enqueteurId);
      res.json(menages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get ménages with anacarde producteurs
   */
  async getWithAnacardeProducteurs(req, res) {
    try {
      const useCase = new GetMenageWithAnacardeProducteursUseCase();
      const menages = await useCase.execute();
      res.json(menages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get ménages with full hierarchy
   */
  async getWithFullHierarchy(req, res) {
    try {
      const useCase = new GetMenageWithFullHierarchyUseCase();
      const menages = await useCase.execute();
      res.json(menages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Update ménage
   */
  async update(req, res) {
    try {
      const useCase = new UpdateMenageUseCase();
      const menage = await useCase.execute(req.params.id, req.body);
      res.json(menage);
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.status(404).json({ error: error.message });
      }
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Delete ménage
   */
  async delete(req, res) {
    try {
      const useCase = new DeleteMenageUseCase();
      const result = await useCase.execute(req.params.id);
      res.json(result);
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Generate PDF questionnaire for a ménage
   */
  async generatePDF(req, res) {
    try {
      console.log('=== Début génération PDF pour ménage ID:', req.params.id);
      
      // Récupérer les données du ménage avec toutes les populations nécessaires pour le PDF
      const MenageModel = require('../../../../models/Menage');
      const menageDoc = await MenageModel.findById(req.params.id)
        .populate('PaysId')
        .populate('DistrictId')
        .populate('RegionId')
        .populate('DepartementId')
        .populate('SousprefId')
        .populate('SecteurAdministratifId')
        .populate('ZonedenombreId')
        .populate('VillageId')
        .populate('LocaliteId')
        .populate('EnqueteurId');
      
      if (!menageDoc) {
        throw new NotFoundError('Ménage non trouvé');
      }
      
      // Convertir en objet simple pour le PDF
      const menage = menageDoc.toObject();
      
      console.log('Ménage récupéré:', {
        id: menage._id || menage.id,
        code: menage.Cod_menage,
        hasData: !!menage,
        enqueteur: menage.EnqueteurId ? {
          id: menage.EnqueteurId._id,
          nom: menage.EnqueteurId.nom,
          prenom: menage.EnqueteurId.prenom
        } : null
      });

      // Générer le PDF
      console.log('Génération du PDF en cours...');
      const pdfBuffer = await pdfGeneratorService.generatePDF(menage);
      
      console.log('PDF généré, taille:', pdfBuffer.length, 'bytes');
      console.log('Type de buffer:', Buffer.isBuffer(pdfBuffer));

      // Sécuriser le nom de fichier
      const codeMenage = menage.Cod_menage || menage._id || menage.id || 'sans-code';
      const filename = `Questionnaire_Denombrement_${codeMenage}.pdf`;
      
      console.log('Nom du fichier:', filename);

      // Définir les en-têtes pour le téléchargement
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      // Important: ne pas définir d'autres headers après
      res.status(200);

      // Envoyer le PDF avec res.end() qui est plus adapté pour les Buffers
      res.end(pdfBuffer, 'binary');
      
      console.log('=== PDF envoyé avec succès');
    } catch (error) {
      console.error('=== ERREUR lors de la génération du PDF:', error);
      console.error('Stack trace:', error.stack);
      
      // Ne pas envoyer de réponse si les headers ont déjà été envoyés
      if (res.headersSent) {
        console.error('Headers déjà envoyés, impossible de renvoyer une erreur');
        return;
      }
      
      if (error.name === 'NotFoundError') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Erreur lors de la génération du PDF: ' + error.message });
    }
  }
}

module.exports = new MenageController();
