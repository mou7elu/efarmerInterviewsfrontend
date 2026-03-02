/**
 * BaseRepository
 * Abstract base repository with common CRUD operations
 */
class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  /**
   * Create a new entity
   * @param {Object} data - Entity data
   * @returns {Promise<Object>} Created entity
   */
  async create(data) {
    const entity = new this.model(data);
    return await entity.save();
  }

  /**
   * Find entity by ID
   * @param {string} id - Entity ID
   * @returns {Promise<Object|null>} Found entity or null
   */
  async findById(id) {
    return await this.model.findById(id);
  }

  /**
   * Find all entities with optional filters
   * @param {Object} filters - Query filters
   * @param {Object} options - Query options (sort, limit, skip, populate)
   * @returns {Promise<Array>} Array of entities
   */
  async findAll(filters = {}, options = {}) {
    let query = this.model.find(filters);

    if (options.populate) {
      if (Array.isArray(options.populate)) {
        options.populate.forEach(pop => {
          query = query.populate(pop);
        });
      } else {
        query = query.populate(options.populate);
      }
    }

    if (options.sort) {
      query = query.sort(options.sort);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.skip) {
      query = query.skip(options.skip);
    }

    return await query.exec();
  }

  /**
   * Find one entity by filters
   * @param {Object} filters - Query filters
   * @returns {Promise<Object|null>} Found entity or null
   */
  async findOne(filters) {
    return await this.model.findOne(filters);
  }

  /**
   * Update entity by ID
   * @param {string} id - Entity ID
   * @param {Object} data - Update data
   * @returns {Promise<Object|null>} Updated entity or null
   */
  async update(id, data) {
    return await this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  /**
   * Delete entity by ID
   * @param {string} id - Entity ID
   * @returns {Promise<Object|null>} Deleted entity or null
   */
  async delete(id) {
    return await this.model.findByIdAndDelete(id);
  }

  /**
   * Count entities matching filters
   * @param {Object} filters - Query filters
   * @returns {Promise<number>} Count of entities
   */
  async count(filters = {}) {
    return await this.model.countDocuments(filters);
  }

  /**
   * Check if entity exists
   * @param {Object} filters - Query filters
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async exists(filters) {
    const count = await this.model.countDocuments(filters);
    return count > 0;
  }

  /**
   * Delete many entities matching filters
   * @param {Object} filters - Query filters
   * @returns {Promise<Object>} Deletion result
   */
  async deleteMany(filters) {
    return await this.model.deleteMany(filters);
  }

  /**
   * Update many entities matching filters
   * @param {Object} filters - Query filters
   * @param {Object} data - Update data
   * @returns {Promise<Object>} Update result
   */
  async updateMany(filters, data) {
    return await this.model.updateMany(filters, data);
  }
}

module.exports = BaseRepository;
