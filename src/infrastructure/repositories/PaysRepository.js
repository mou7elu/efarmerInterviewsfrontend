const { MongoPaysRepository } = require('./MongoPaysRepository');

/**
 * Repository principal pour Pays
 * Délègue à l'implémentation MongoDB
 */
class PaysRepository extends MongoPaysRepository {
  constructor() {
    super();
  }
}

module.exports = { PaysRepository };