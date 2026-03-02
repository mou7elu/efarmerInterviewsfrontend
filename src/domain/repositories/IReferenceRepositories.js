const IBaseRepository = require('./IBaseRepository');

/**
 * Interface du repository pour les entités de référence (Nationalite, NiveauScolaire, Piece)
 */
class IReferenceRepository extends IBaseRepository {
  /**
   * Recherche par libellé
   * @param {string} libelle - Libellé de l'entité
   * @returns {Promise<Entity|null>}
   */
  async findByLibelle(libelle) {
    throw new Error('Method must be implemented');
  }

  /**
   * Recherche par nom partiel
   * @param {string} searchTerm - Terme de recherche
   * @returns {Promise<Entity[]>}
   */
  async searchByName(searchTerm) {
    throw new Error('Method must be implemented');
  }

  /**
   * Obtient toutes les entités triées par libellé
   * @returns {Promise<Entity[]>}
   */
  async findAllSorted() {
    throw new Error('Method must be implemented');
  }

  /**
   * Vérifie si un libellé existe déjà
   * @param {string} libelle - Libellé à vérifier
   * @param {string} excludeId - ID à exclure de la vérification (pour les mises à jour)
   * @returns {Promise<boolean>}
   */
  async existsByLibelle(libelle, excludeId = null) {
    throw new Error('Method must be implemented');
  }
}

/**
 * Interface du repository pour les entités Nationalite
 */
class INationaliteRepository extends IReferenceRepository {
  /**
   * Recherche des nationalités par préfixe
   * @param {string} prefix - Préfixe de recherche
   * @returns {Promise<NationaliteEntity[]>}
   */
  async findByPrefix(prefix) {
    throw new Error('Method must be implemented');
  }
}

/**
 * Interface du repository pour les entités NiveauScolaire
 */
class INiveauScolaireRepository extends IReferenceRepository {
  /**
   * Obtient les niveaux scolaires triés par ordre
   * @returns {Promise<NiveauScolaireEntity[]>}
   */
  async findAllByOrder() {
    throw new Error('Method must be implemented');
  }

  /**
   * Recherche des niveaux par type (supérieur, professionnel, etc.)
   * @param {string} type - Type de niveau
   * @returns {Promise<NiveauScolaireEntity[]>}
   */
  async findByType(type) {
    throw new Error('Method must be implemented');
  }

  /**
   * Met à jour l'ordre des niveaux
   * @param {Array<{id: string, ordre: number}>} updates - Mises à jour d'ordre
   * @returns {Promise<void>}
   */
  async updateOrders(updates) {
    throw new Error('Method must be implemented');
  }
}

/**
 * Interface du repository pour les entités Piece
 */
class IPieceRepository extends IReferenceRepository {
  /**
   * Recherche des pièces obligatoires
   * @returns {Promise<PieceEntity[]>}
   */
  async findObligatoires() {
    throw new Error('Method must be implemented');
  }

  /**
   * Recherche des pièces par durée de validité
   * @param {number} duree - Durée en années
   * @returns {Promise<PieceEntity[]>}
   */
  async findByValiditeDuree(duree) {
    throw new Error('Method must be implemented');
  }

  /**
   * Recherche des pièces d'identité officielles
   * @returns {Promise<PieceEntity[]>}
   */
  async findIdentitesOfficielles() {
    throw new Error('Method must be implemented');
  }
}

module.exports = { 
  IReferenceRepository,
  INationaliteRepository, 
  INiveauScolaireRepository, 
  IPieceRepository 
};