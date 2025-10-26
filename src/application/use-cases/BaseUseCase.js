/**
 * Base Use Case
 * Classe abstraite pour tous les cas d'usage
 */

export class BaseUseCase {
  constructor() {
    if (new.target === BaseUseCase) {
      throw new Error('BaseUseCase est une classe abstraite et ne peut pas être instanciée directement');
    }
  }

  /**
   * Méthode principale à implémenter dans chaque cas d'usage
   */
  async execute(input) {
    throw new Error('La méthode execute doit être implémentée');
  }

  /**
   * Validation des inputs (à surcharger si nécessaire)
   */
  validateInput(input, requiredFields = []) {
    if (!input || typeof input !== 'object') {
      throw new Error('Les données d\'entrée sont requises');
    }

    for (const field of requiredFields) {
      if (!input[field] || (typeof input[field] === 'string' && input[field].trim() === '')) {
        throw new Error(`Le champ '${field}' est requis`);
      }
    }

    return true;
  }

  /**
   * Log des opérations (à implémenter selon les besoins)
   */
  log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level.toUpperCase()}] [${this.constructor.name}] ${message}`, data);
  }

  /**
   * Gestion des erreurs standardisée
   */
  handleError(error, context = {}) {
    this.log('error', `Erreur dans ${this.constructor.name}`, {
      error: error.message,
      stack: error.stack,
      context
    });
    throw error;
  }

  /**
   * Validation de permissions (à surcharger si nécessaire)
   */
  checkPermissions(user, resource, action) {
    // Implémentation de base - à personnaliser selon les besoins
    if (!user) {
      throw new Error('Utilisateur requis pour cette opération');
    }
    return true;
  }

  /**
   * Sanitisation des données sensibles pour les logs
   */
  sanitizeForLogging(data) {
    const sensitive = ['password', 'token', 'secret', 'key'];
    const sanitized = { ...data };
    
    Object.keys(sanitized).forEach(key => {
      if (sensitive.some(s => key.toLowerCase().includes(s))) {
        sanitized[key] = '[REDACTED]';
      }
    });
    
    return sanitized;
  }
}