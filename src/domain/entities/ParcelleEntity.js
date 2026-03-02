const { BaseEntity } = require('./BaseEntity');
const { ValidationError } = require('../../shared/errors/ValidationError');

/**
 * Value Object pour représenter les coordonnées géographiques
 */
class Coordonnee {
  constructor(value) {
    this._validate(value);
    this._value = value;
  }

  _validate(value) {
    if (value && typeof value !== 'string') {
      throw new ValidationError('Les coordonnées doivent être une chaîne de caractères');
    }

    // Validation basique pour GeoJSON polygon
    if (value && value.trim().length > 0) {
      try {
        // Vérification que c'est du JSON valide si ce n'est pas vide
        if (value.startsWith('{') || value.startsWith('[')) {
          JSON.parse(value);
        }
      } catch (error) {
        throw new ValidationError('Les coordonnées doivent être au format JSON valide');
      }
    }
  }

  get value() {
    return this._value;
  }

  equals(other) {
    if (!(other instanceof Coordonnee)) return false;
    return this._value === other._value;
  }

  toString() {
    return this._value || '';
  }
}

/**
 * Entité représentant une parcelle agricole dans le système
 */
class ParcelleEntity extends BaseEntity {
  constructor(data) {
    const {
      id,
      superficie,
      coordonnee = null,
      producteurId,
      code = null,
      cleProdMobi = null,
      clePlantMobi = null,
      createdAt,
      updatedAt
    } = data;

    super(id);
    
    // Validation des champs obligatoires
    if (superficie === undefined || superficie === null) {
      throw new ValidationError('La superficie est requise');
    }

    if (typeof superficie !== 'number' || superficie < 0) {
      throw new ValidationError('La superficie doit être un nombre positif');
    }

    if (!producteurId || typeof producteurId !== 'string' || producteurId.trim().length === 0) {
      throw new ValidationError('L\'ID du producteur est requis');
    }

    // Validation des champs optionnels
    if (code && typeof code !== 'string') {
      throw new ValidationError('Le code doit être une chaîne de caractères');
    }

    if (cleProdMobi && typeof cleProdMobi !== 'string') {
      throw new ValidationError('La clé producteur mobile doit être une chaîne de caractères');
    }

    if (clePlantMobi && typeof clePlantMobi !== 'string') {
      throw new ValidationError('La clé plantation mobile doit être une chaîne de caractères');
    }

    this.superficie = superficie;
    this.coordonnee = coordonnee ? new Coordonnee(coordonnee) : null;
    this.producteurId = producteurId.trim();
    this.code = code?.trim() || null;
    this.cleProdMobi = cleProdMobi?.trim() || null;
    this.clePlantMobi = clePlantMobi?.trim() || null;
    
    if (createdAt) this._createdAt = new Date(createdAt);
    if (updatedAt) this._updatedAt = new Date(updatedAt);
  }

  /**
   * Change la superficie de la parcelle
   */
  changerSuperficie(nouvelleSuperficie) {
    if (typeof nouvelleSuperficie !== 'number' || nouvelleSuperficie < 0) {
      throw new ValidationError('La superficie doit être un nombre positif');
    }

    if (this.superficie === nouvelleSuperficie) {
      return this;
    }

    return new ParcelleEntity({
      id: this.id,
      superficie: nouvelleSuperficie,
      coordonnee: this.coordonnee?.value,
      producteurId: this.producteurId,
      code: this.code,
      cleProdMobi: this.cleProdMobi,
      clePlantMobi: this.clePlantMobi,
      createdAt: this.createdAt,
      updatedAt: new Date()
    });
  }

  /**
   * Met à jour les coordonnées de la parcelle
   */
  changerCoordonnees(nouvellesCoordonnees) {
    const nouvelleCoordonneesObj = nouvellesCoordonnees ? new Coordonnee(nouvellesCoordonnees) : null;
    
    if (this.coordonnee?.equals(nouvelleCoordonneesObj)) {
      return this;
    }

    return new ParcelleEntity({
      id: this.id,
      superficie: this.superficie,
      coordonnee: nouvellesCoordonnees,
      producteurId: this.producteurId,
      code: this.code,
      cleProdMobi: this.cleProdMobi,
      clePlantMobi: this.clePlantMobi,
      createdAt: this.createdAt,
      updatedAt: new Date()
    });
  }

  /**
   * Change le producteur propriétaire de la parcelle
   */
  changerProducteur(nouveauProducteurId) {
    if (!nouveauProducteurId || typeof nouveauProducteurId !== 'string' || nouveauProducteurId.trim().length === 0) {
      throw new ValidationError('L\'ID du nouveau producteur est requis');
    }

    if (this.producteurId === nouveauProducteurId.trim()) {
      return this;
    }

    return new ParcelleEntity({
      id: this.id,
      superficie: this.superficie,
      coordonnee: this.coordonnee?.value,
      producteurId: nouveauProducteurId.trim(),
      code: this.code,
      cleProdMobi: this.cleProdMobi,
      clePlantMobi: this.clePlantMobi,
      createdAt: this.createdAt,
      updatedAt: new Date()
    });
  }

  /**
   * Met à jour le code de la parcelle
   */
  changerCode(nouveauCode) {
    if (nouveauCode && typeof nouveauCode !== 'string') {
      throw new ValidationError('Le code doit être une chaîne de caractères');
    }

    const codeNormalise = nouveauCode?.trim() || null;
    
    if (this.code === codeNormalise) {
      return this;
    }

    return new ParcelleEntity({
      id: this.id,
      superficie: this.superficie,
      coordonnee: this.coordonnee?.value,
      producteurId: this.producteurId,
      code: codeNormalise,
      cleProdMobi: this.cleProdMobi,
      clePlantMobi: this.clePlantMobi,
      createdAt: this.createdAt,
      updatedAt: new Date()
    });
  }

  /**
   * Vérifie si la parcelle appartient au producteur donné
   */
  appartientAuProducteur(producteurId) {
    if (!producteurId || typeof producteurId !== 'string' || producteurId.trim().length === 0) {
      throw new ValidationError('L\'ID du producteur ne peut pas être vide');
    }

    return this.producteurId === producteurId.trim();
  }

  /**
   * Vérifie si la parcelle a des coordonnées GPS
   */
  aDesCoordonnees() {
    return this.coordonnee !== null && this.coordonnee.value && this.coordonnee.value.trim().length > 0;
  }

  /**
   * Obtient la superficie en hectares (conversion si nécessaire)
   */
  getSuperficieEnHectares() {
    // Supposons que la superficie est déjà en hectares
    return this.superficie;
  }

  /**
   * Obtient la superficie formatée avec unité
   */
  getSuperficieFormatee() {
    return `${this.superficie} ha`;
  }

  /**
   * Vérifie si c'est une petite parcelle (< 1 hectare)
   */
  estPetiteParcelle() {
    return this.superficie < 1;
  }

  /**
   * Vérifie si c'est une grande parcelle (> 10 hectares)
   */
  estGrandeParcelle() {
    return this.superficie > 10;
  }

  /**
   * Obtient la catégorie de taille
   */
  getCategorieTaille() {
    if (this.superficie < 1) return 'Petite';
    if (this.superficie <= 10) return 'Moyenne';
    return 'Grande';
  }

  /**
   * Convertit vers un DTO
   */
  toDTO() {
    return {
      id: this.id,
      superficie: this.superficie,
      superficieFormatee: this.getSuperficieFormatee(),
      categorieTaille: this.getCategorieTaille(),
      coordonnee: this.coordonnee?.value || null,
      aDesCoordonnees: this.aDesCoordonnees(),
      producteurId: this.producteurId,
      code: this.code,
      cleProdMobi: this.cleProdMobi,
      clePlantMobi: this.clePlantMobi,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    };
  }

  /**
   * Convertit vers le format de persistance
   */
  toPersistence() {
    return {
      _id: this.id,
      Superficie: this.superficie,
      Coordonnee: this.coordonnee?.value || null,
      ProducteurId: this.producteurId,
      Code: this.code,
      CleProd_mobi: this.cleProdMobi,
      ClePlant_mobi: this.clePlantMobi,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Crée une entité depuis les données de persistance
   */
  static fromPersistence(data) {
    return new ParcelleEntity({
      id: data._id?.toString() || data.id,
      superficie: data.Superficie,
      coordonnee: data.Coordonnee,
      producteurId: data.ProducteurId?.toString() || data.ProducteurId,
      code: data.Code,
      cleProdMobi: data.CleProd_mobi,
      clePlantMobi: data.ClePlant_mobi,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
  }
}

module.exports = { ParcelleEntity, Coordonnee };