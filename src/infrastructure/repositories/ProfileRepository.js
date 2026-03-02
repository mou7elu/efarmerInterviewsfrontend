const BaseRepository = require('./BaseRepository');
const ProfileModel = require('../../../models/Profile');

/**
 * ProfileRepository
 * Repository for Profile entity with specific methods
 */
class ProfileRepository extends BaseRepository {
  constructor() {
    super(ProfileModel);
  }

  /**
   * Find profile by name
   * @param {string} name - Profile name
   * @returns {Promise<Object|null>} Found profile or null
   */
  async findByName(name) {
    return await this.findOne({ name });
  }

  /**
   * Check if profile name exists
   * @param {string} name - Profile name
   * @param {string} excludeId - ID to exclude from check (for updates)
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async nameExists(name, excludeId = null) {
    const filters = { name };
    if (excludeId) {
      filters._id = { $ne: excludeId };
    }
    return await this.exists(filters);
  }

  /**
   * Get all profiles sorted by name
   * @returns {Promise<Array>} Array of profiles sorted alphabetically
   */
  async getAllSorted() {
    return await this.findAll({}, { sort: { name: 1 } });
  }
}

module.exports = ProfileRepository;
