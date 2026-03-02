/**
 * Question Controller
 * Contrôleur pour la gestion des questions du questionnaire
 */

const BaseController = require('./BaseController');
const { 
  CreateQuestionDTO, 
  UpdateQuestionDTO, 
  QuestionResponseDTO, 
  NavigationRequestDTO, 
  NavigationResponseDTO,
  QuestionSearchDTO 
} = require('../../../application/dtos/QuestionDTOs');

class QuestionController extends BaseController {
  constructor(
    createQuestionUseCase,
    getQuestionUseCase,
    updateQuestionUseCase,
    deleteQuestionUseCase,
    listQuestionsUseCase,
    searchQuestionsUseCase,
    navigateQuestionnaireUseCase,
    validateQuestionnaireUseCase
  ) {
    super();
    this.createQuestionUseCase = createQuestionUseCase;
    this.getQuestionUseCase = getQuestionUseCase;
    this.updateQuestionUseCase = updateQuestionUseCase;
    this.deleteQuestionUseCase = deleteQuestionUseCase;
    this.listQuestionsUseCase = listQuestionsUseCase;
    this.searchQuestionsUseCase = searchQuestionsUseCase;
    this.navigateQuestionnaireUseCase = navigateQuestionnaireUseCase;
    this.validateQuestionnaireUseCase = validateQuestionnaireUseCase;
  }

  /**
   * Créer une nouvelle question
   * POST /api/questions
   */
  create = this.asyncHandler(async (req, res) => {
    // Vérifier les permissions
    this.checkPermission(req, 'CREATE_QUESTION');

    // Validation des champs requis
    this.validateRequiredParams(req, ['code', 'texte', 'type', 'sectionId', 'voletId']);

    const createQuestionDTO = CreateQuestionDTO.fromRequest(req);
    
    const question = await this.createQuestionUseCase.execute(createQuestionDTO);
    const responseDTO = QuestionResponseDTO.fromEntity(question);
    
    return this.handleSuccess(res, responseDTO, 'Question créée avec succès', 201);
  });

  /**
   * Récupérer une question par son code
   * GET /api/questions/:code
   */
  getByCode = this.asyncHandler(async (req, res) => {
    const { code } = req.params;
    
    if (!code) {
      throw new ValidationError('Code de question requis');
    }

    const question = await this.getQuestionUseCase.execute({ code });
    const responseDTO = QuestionResponseDTO.fromEntity(question);
    
    return this.handleSuccess(res, responseDTO, 'Question récupérée avec succès');
  });

  /**
   * Récupérer une question par son ID
   * GET /api/questions/id/:id
   */
  getById = this.asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
      throw new ValidationError('ID de question requis');
    }

    const question = await this.getQuestionByIdUseCase.execute({ id });
    const responseDTO = QuestionResponseDTO.fromEntity(question);
    
    return this.handleSuccess(res, responseDTO, 'Question récupérée avec succès');
  });

  /**
   * Mettre à jour une question
   * PUT /api/questions/:id
   */
  update = this.asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
      throw new ValidationError('ID de question requis');
    }

    // Vérifier les permissions
    this.checkPermission(req, 'UPDATE_QUESTION');

    const updateQuestionDTO = UpdateQuestionDTO.fromRequest(req);
    
    const question = await this.updateQuestionUseCase.execute({ id, ...updateQuestionDTO });
    const responseDTO = QuestionResponseDTO.fromEntity(question);
    
    return this.handleSuccess(res, responseDTO, 'Question mise à jour avec succès');
  });

  /**
   * Supprimer une question
   * DELETE /api/questions/:id
   */
  delete = this.asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
      throw new ValidationError('ID de question requis');
    }

    // Vérifier les permissions
    this.checkPermission(req, 'DELETE_QUESTION');

    await this.deleteQuestionUseCase.execute({ id });
    
    return this.handleSuccess(res, null, 'Question supprimée avec succès', 204);
  });

  /**
   * Lister toutes les questions avec filtres et pagination
   * GET /api/questions
   */
  list = this.asyncHandler(async (req, res) => {
    const { page, limit, offset } = this.getPaginationParams(req);
    const { section, volet, type, obligatoire, referenceTable } = req.query;

    const filters = {};
    if (section) filters.sectionId = section;
    if (volet) filters.voletId = volet;
    if (type) filters.type = type;
    if (obligatoire !== undefined) filters.obligatoire = obligatoire === 'true';
    if (referenceTable) filters.referenceTable = referenceTable;

    const result = await this.listQuestionsUseCase.execute({
      filters,
      pagination: { page, limit, offset }
    });

    const responseData = QuestionResponseDTO.fromEntityArray(result.questions);

    return this.handlePaginatedSuccess(
      res,
      responseData,
      { page, limit, total: result.total },
      'Questions récupérées avec succès'
    );
  });

  /**
   * Rechercher des questions par texte
   * GET /api/questions/search
   */
  search = this.asyncHandler(async (req, res) => {
    const searchDTO = QuestionSearchDTO.fromQuery(req.query);
    
    const result = await this.searchQuestionsUseCase.execute(searchDTO);
    const responseData = QuestionResponseDTO.fromEntityArray(result.questions);

    return this.handlePaginatedSuccess(
      res,
      responseData,
      { 
        page: searchDTO.page, 
        limit: searchDTO.limit, 
        total: result.total 
      },
      'Recherche effectuée avec succès'
    );
  });

  /**
   * Naviguer dans le questionnaire (logique de saut)
   * POST /api/questions/navigate
   */
  navigate = this.asyncHandler(async (req, res) => {
    this.validateRequiredParams(req, ['currentQuestionCode']);

    const navigationDTO = NavigationRequestDTO.fromRequest(req);
    
    const result = await this.navigateQuestionnaireUseCase.execute(navigationDTO);
    const responseDTO = NavigationResponseDTO.fromUseCaseResult(result);
    
    return this.handleSuccess(res, responseDTO, 'Navigation calculée avec succès');
  });

  /**
   * Obtenir les questions par section
   * GET /api/questions/section/:sectionId
   */
  getBySection = this.asyncHandler(async (req, res) => {
    const { sectionId } = req.params;
    
    if (!sectionId) {
      throw new ValidationError('ID de section requis');
    }

    const result = await this.getQuestionsBySectionUseCase.execute({ sectionId });
    const responseData = QuestionResponseDTO.fromEntityArray(result.questions);
    
    return this.handleSuccess(res, responseData, 'Questions de la section récupérées avec succès');
  });

  /**
   * Obtenir les questions par volet
   * GET /api/questions/volet/:voletId
   */
  getByVolet = this.asyncHandler(async (req, res) => {
    const { voletId } = req.params;
    
    if (!voletId) {
      throw new ValidationError('ID de volet requis');
    }

    const result = await this.getQuestionsByVoletUseCase.execute({ voletId });
    const responseData = QuestionResponseDTO.fromEntityArray(result.questions);
    
    return this.handleSuccess(res, responseData, 'Questions du volet récupérées avec succès');
  });

  /**
   * Obtenir les questions avec options (choix multiples)
   * GET /api/questions/with-options
   */
  getWithOptions = this.asyncHandler(async (req, res) => {
    const result = await this.getQuestionsWithOptionsUseCase.execute();
    const responseData = QuestionResponseDTO.fromEntityArray(result.questions);
    
    return this.handleSuccess(res, responseData, 'Questions avec options récupérées avec succès');
  });

  /**
   * Obtenir les questions avec logique de saut
   * GET /api/questions/with-goto
   */
  getWithGotoLogic = this.asyncHandler(async (req, res) => {
    const result = await this.getQuestionsWithGotoUseCase.execute();
    const responseData = QuestionResponseDTO.fromEntityArray(result.questions);
    
    return this.handleSuccess(res, responseData, 'Questions avec logique de saut récupérées avec succès');
  });

  /**
   * Obtenir les questions obligatoires
   * GET /api/questions/required
   */
  getRequired = this.asyncHandler(async (req, res) => {
    const result = await this.getRequiredQuestionsUseCase.execute();
    const responseData = QuestionResponseDTO.fromEntityArray(result.questions);
    
    return this.handleSuccess(res, responseData, 'Questions obligatoires récupérées avec succès');
  });

  /**
   * Valider un questionnaire complet
   * POST /api/questions/validate
   */
  validateQuestionnaire = this.asyncHandler(async (req, res) => {
    this.validateRequiredParams(req, ['responses']);

    const { responses } = req.body;
    
    const result = await this.validateQuestionnaireUseCase.execute({ responses });
    
    return this.handleSuccess(res, result, 'Questionnaire validé avec succès');
  });

  /**
   * Générer un rapport de navigation du questionnaire
   * GET /api/questions/navigation-report
   */
  getNavigationReport = this.asyncHandler(async (req, res) => {
    // Vérifier les permissions
    this.checkPermission(req, 'VIEW_REPORTS');

    const result = await this.getNavigationReportUseCase.execute();
    
    return this.handleSuccess(res, result, 'Rapport de navigation généré avec succès');
  });

  /**
   * Obtenir le prochain code de question disponible
   * GET /api/questions/next-code
   */
  getNextCode = this.asyncHandler(async (req, res) => {
    // Vérifier les permissions
    this.checkPermission(req, 'CREATE_QUESTION');

    const result = await this.getNextQuestionCodeUseCase.execute();
    
    return this.handleSuccess(res, { nextCode: result.code }, 'Prochain code disponible récupéré avec succès');
  });
}

module.exports = QuestionController;