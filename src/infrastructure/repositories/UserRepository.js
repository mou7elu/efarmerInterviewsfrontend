const BaseRepository = require('./BaseRepository');
const UserModel = require('../../../models/User');

/**
 * UserRepository
 * Repository for User entity with specific methods
 */
class UserRepository extends BaseRepository {
  constructor() {
    super(UserModel);
  }

  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} Found user or null
   */
  async findByEmail(email) {
    return await this.findOne({ email });
  }

  /**
   * Check if email exists
   * @param {string} email - User email
   * @param {string} excludeId - ID to exclude from check (for updates)
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async emailExists(email, excludeId = null) {
    const filters = { email };
    if (excludeId) {
      filters._id = { $ne: excludeId };
    }
    return await this.exists(filters);
  }

  /**
   * Find all active users
   * @returns {Promise<Array>} Array of active users
   */
  async findActive() {
    return await this.findAll({ Sommeil: false });
  }

  /**
   * Find all inactive users
   * @returns {Promise<Array>} Array of inactive users
   */
  async findInactive() {
    return await this.findAll({ Sommeil: true });
  }

  /**
   * Find all God mode users
   * @returns {Promise<Array>} Array of God mode users
   */
  async findGodModeUsers() {
    return await this.findAll({ isGodMode: true });
  }

  /**
   * Find users by profile ID
   * @param {string} profileId - Profile ID
   * @returns {Promise<Array>} Array of users with the profile
   */
  async findByProfileId(profileId) {
    return await this.findAll({ profileId }, { populate: 'profileId' });
  }

  /**
   * Find users by responsable ID
   * @param {string} responsableId - Responsable ID
   * @returns {Promise<Array>} Array of users under this responsable
   */
  async findByResponsableId(responsableId) {
    return await this.findAll({ ResponsableId: responsableId });
  }

  /**
   * Get all users with populated profile
   * @returns {Promise<Array>} Array of users with populated profile
   */
  async getAllWithProfile() {
    return await this.findAll({}, { populate: 'profileId' });
  }
}

module.exports = UserRepository;
