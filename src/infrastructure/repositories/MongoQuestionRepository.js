/**
 * MongoDB Question Repository Implementation
 * Implémente l'interface IQuestionRepository avec MongoDB/Mongoose
 */

const IQuestionRepository = require('../../domain/repositories/IQuestionRepository');
const QuestionEntity = require('../../domain/entities/QuestionEntity');
const { NotFoundError, DuplicateError } = require('../../shared/errors/DomainErrors');

class MongoQuestionRepository extends IQuestionRepository {
  constructor(questionModel) {
    super();
    this.questionModel = questionModel;
  }

  async findById(id) {
    try {
      const questionDoc = await this.questionModel.findById(id)
        .populate('sectionId')
        .populate('voletId');
      return questionDoc ? this._toEntity(questionDoc) : null;
    } catch (error) {
      throw new Error(`Erreur lors de la recherche par ID: ${error.message}`);
    }
  }

  async findByCode(code) {
    try {
      const questionDoc = await this.questionModel.findOne({ code })
        .populate('sectionId')
        .populate('voletId');
      return questionDoc ? this._toEntity(questionDoc) : null;
    } catch (error) {
      throw new Error(`Erreur lors de la recherche par code: ${error.message}`);
    }
  }

  async findBySection(sectionId) {
    try {
      const questionDocs = await this.questionModel.find({ sectionId })
        .sort({ code: 1 })
        .populate('sectionId')
        .populate('voletId');
      return questionDocs.map(doc => this._toEntity(doc));
    } catch (error) {
      throw new Error(`Erreur lors de la recherche par section: ${error.message}`);
    }
  }

  async findByVolet(voletId) {
    try {
      const questionDocs = await this.questionModel.find({ voletId })
        .sort({ code: 1 })
        .populate('sectionId')
        .populate('voletId');
      return questionDocs.map(doc => this._toEntity(doc));
    } catch (error) {
      throw new Error(`Erreur lors de la recherche par volet: ${error.message}`);
    }
  }

  async findByType(type) {
    try {
      const questionDocs = await this.questionModel.find({ type })
        .sort({ code: 1 })
        .populate('sectionId')
        .populate('voletId');
      return questionDocs.map(doc => this._toEntity(doc));
    } catch (error) {
      throw new Error(`Erreur lors de la recherche par type: ${error.message}`);
    }
  }

  async findObligatoires() {
    try {
      const questionDocs = await this.questionModel.find({ obligatoire: true })
        .sort({ code: 1 })
        .populate('sectionId')
        .populate('voletId');
      return questionDocs.map(doc => this._toEntity(doc));
    } catch (error) {
      throw new Error(`Erreur lors de la recherche des questions obligatoires: ${error.message}`);
    }
  }

  async findWithOptions() {
    try {
      const questionDocs = await this.questionModel.find({
        'options.0': { $exists: true }
      })
        .sort({ code: 1 })
        .populate('sectionId')
        .populate('voletId');
      return questionDocs.map(doc => this._toEntity(doc));
    } catch (error) {
      throw new Error(`Erreur lors de la recherche des questions avec options: ${error.message}`);
    }
  }

  async findWithGotoLogic() {
    try {
      const questionDocs = await this.questionModel.find({
        'options.goto': { $exists: true, $ne: null }
      })
        .sort({ code: 1 })
        .populate('sectionId')
        .populate('voletId');
      return questionDocs.map(doc => this._toEntity(doc));
    } catch (error) {
      throw new Error(`Erreur lors de la recherche des questions avec logique de saut: ${error.message}`);
    }
  }

  async findByReferenceTable(referenceTable) {
    try {
      const questionDocs = await this.questionModel.find({ referenceTable })
        .sort({ code: 1 })
        .populate('sectionId')
        .populate('voletId');
      return questionDocs.map(doc => this._toEntity(doc));
    } catch (error) {
      throw new Error(`Erreur lors de la recherche par table de référence: ${error.message}`);
    }
  }

  async findAutomatiques() {
    try {
      const questionDocs = await this.questionModel.find({ automatique: true })
        .sort({ code: 1 })
        .populate('sectionId')
        .populate('voletId');
      return questionDocs.map(doc => this._toEntity(doc));
    } catch (error) {
      throw new Error(`Erreur lors de la recherche des questions automatiques: ${error.message}`);
    }
  }

  async getNextCode() {
    try {
      const lastQuestion = await this.questionModel.findOne({})
        .sort({ code: -1 })
        .select('code');
      
      if (!lastQuestion) {
        return 'Q001';
      }

      const lastNumber = parseInt(lastQuestion.code.substring(1));
      const nextNumber = lastNumber + 1;
      return `Q${nextNumber.toString().padStart(3, '0')}`;
    } catch (error) {
      throw new Error(`Erreur lors de la génération du prochain code: ${error.message}`);
    }
  }

  async searchByText(searchTerm) {
    try {
      const questionDocs = await this.questionModel.find({
        $text: { $search: searchTerm }
      })
        .sort({ score: { $meta: 'textScore' } })
        .populate('sectionId')
        .populate('voletId');
      return questionDocs.map(doc => this._toEntity(doc));
    } catch (error) {
      // Fallback si pas d'index texte
      const questionDocs = await this.questionModel.find({
        texte: { $regex: searchTerm, $options: 'i' }
      })
        .sort({ code: 1 })
        .populate('sectionId')
        .populate('voletId');
      return questionDocs.map(doc => this._toEntity(doc));
    }
  }

  async findInCodeRange(startCode, endCode) {
    try {
      const questionDocs = await this.questionModel.find({
        code: { $gte: startCode, $lte: endCode }
      })
        .sort({ code: 1 })
        .populate('sectionId')
        .populate('voletId');
      return questionDocs.map(doc => this._toEntity(doc));
    } catch (error) {
      throw new Error(`Erreur lors de la recherche par plage de codes: ${error.message}`);
    }
  }

  async findAll(criteria = {}) {
    try {
      const questionDocs = await this.questionModel.find(criteria)
        .sort({ code: 1 })
        .populate('sectionId')
        .populate('voletId');
      return questionDocs.map(doc => this._toEntity(doc));
    } catch (error) {
      throw new Error(`Erreur lors de la recherche de toutes les questions: ${error.message}`);
    }
  }

  async create(questionEntity) {
    try {
      // Vérifier l'unicité du code
      const existingQuestion = await this.findByCode(questionEntity.code);
      if (existingQuestion) {
        throw new DuplicateError('Question', 'code', questionEntity.code);
      }

      const questionDoc = new this.questionModel({
        code: questionEntity.code,
        texte: questionEntity.texte,
        type: questionEntity.type,
        obligatoire: questionEntity.obligatoire,
        unite: questionEntity.unite,
        automatique: questionEntity.automatique,
        options: questionEntity.options,
        sectionId: questionEntity.sectionId,
        voletId: questionEntity.voletId,
        referenceTable: questionEntity.referenceTable,
        referenceField: questionEntity.referenceField
      });

      const savedDoc = await questionDoc.save();
      return this._toEntity(savedDoc);
    } catch (error) {
      if (error.code === 11000) { // Duplicate key error
        throw new DuplicateError('Question', 'code', questionEntity.code);
      }
      throw new Error(`Erreur lors de la création: ${error.message}`);
    }
  }

  async update(id, questionEntity) {
    try {
      const updateData = {
        texte: questionEntity.texte,
        type: questionEntity.type,
        obligatoire: questionEntity.obligatoire,
        unite: questionEntity.unite,
        automatique: questionEntity.automatique,
        options: questionEntity.options,
        sectionId: questionEntity.sectionId,
        voletId: questionEntity.voletId,
        referenceTable: questionEntity.referenceTable,
        referenceField: questionEntity.referenceField
      };

      const updatedDoc = await this.questionModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      )
        .populate('sectionId')
        .populate('voletId');

      if (!updatedDoc) {
        throw new NotFoundError('Question', id);
      }

      return this._toEntity(updatedDoc);
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const deletedDoc = await this.questionModel.findByIdAndDelete(id);
      if (!deletedDoc) {
        throw new NotFoundError('Question', id);
      }
      return true;
    } catch (error) {
      throw new Error(`Erreur lors de la suppression: ${error.message}`);
    }
  }

  async exists(id) {
    try {
      const doc = await this.questionModel.findById(id).select('_id');
      return !!doc;
    } catch (error) {
      return false;
    }
  }

  async count(criteria = {}) {
    try {
      return await this.questionModel.countDocuments(criteria);
    } catch (error) {
      throw new Error(`Erreur lors du comptage: ${error.message}`);
    }
  }

  /**
   * Convertit un document Mongoose en entité question
   */
  _toEntity(questionDoc) {
    return new QuestionEntity({
      id: questionDoc._id.toString(),
      code: questionDoc.code,
      texte: questionDoc.texte,
      type: questionDoc.type,
      obligatoire: questionDoc.obligatoire,
      unite: questionDoc.unite,
      automatique: questionDoc.automatique,
      options: questionDoc.options || [],
      sectionId: questionDoc.sectionId,
      voletId: questionDoc.voletId,
      referenceTable: questionDoc.referenceTable,
      referenceField: questionDoc.referenceField,
      createdAt: questionDoc.createdAt,
      updatedAt: questionDoc.updatedAt
    });
  }
}

module.exports = MongoQuestionRepository;