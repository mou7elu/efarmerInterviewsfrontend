const { ValidationError } = require('../../shared/errors/ValidationError');

/**
 * Value Object pour représenter des coordonnées géographiques
 */
class Coordonnee {
  constructor(value) {
    this._value = value;
    this._validate();
    Object.freeze(this);
  }

  _validate() {
    if (this._value !== null && this._value !== undefined) {
      if (typeof this._value !== 'string') {
        throw new ValidationError('Les coordonnées doivent être une chaîne de caractères');
      }

      // Validation basique pour du GeoJSON ou des coordonnées simples
      if (this._value.trim().length === 0) {
        throw new ValidationError('Les coordonnées ne peuvent pas être vides');
      }

      // Validation optionnelle pour format lat,lng
      if (this._isLatLngFormat(this._value)) {
        this._validateLatLng();
      }
    }
  }

  _isLatLngFormat(value) {
    // Format: "latitude,longitude" (ex: "5.345, -4.024")
    const pattern = /^-?\d+\.?\d*\s*,\s*-?\d+\.?\d*$/;
    return pattern.test(value.trim());
  }

  _validateLatLng() {
    const parts = this._value.split(',').map(p => parseFloat(p.trim()));
    const [lat, lng] = parts;

    if (lat < -90 || lat > 90) {
      throw new ValidationError('La latitude doit être comprise entre -90 et 90 degrés');
    }

    if (lng < -180 || lng > 180) {
      throw new ValidationError('La longitude doit être comprise entre -180 et 180 degrés');
    }
  }

  get value() {
    return this._value;
  }

  /**
   * Vérifie si les coordonnées sont définies
   */
  isSet() {
    return this._value !== null && this._value !== undefined && this._value.trim().length > 0;
  }

  /**
   * Vérifie si c'est au format latitude,longitude
   */
  isLatLngFormat() {
    return this._value && this._isLatLngFormat(this._value);
  }

  /**
   * Obtient la latitude si c'est au format lat,lng
   */
  getLatitude() {
    if (!this.isLatLngFormat()) {
      throw new ValidationError('Les coordonnées ne sont pas au format latitude,longitude');
    }
    return parseFloat(this._value.split(',')[0].trim());
  }

  /**
   * Obtient la longitude si c'est au format lat,lng
   */
  getLongitude() {
    if (!this.isLatLngFormat()) {
      throw new ValidationError('Les coordonnées ne sont pas au format latitude,longitude');
    }
    return parseFloat(this._value.split(',')[1].trim());
  }

  /**
   * Vérifie si c'est potentiellement du GeoJSON
   */
  isGeoJSONFormat() {
    if (!this._value) return false;
    try {
      const parsed = JSON.parse(this._value);
      return parsed.type && (parsed.type === 'Point' || parsed.type === 'Polygon' || parsed.type === 'LineString');
    } catch {
      return false;
    }
  }

  /**
   * Convertit en objet GeoJSON si possible
   */
  toGeoJSON() {
    if (this.isGeoJSONFormat()) {
      return JSON.parse(this._value);
    }
    
    if (this.isLatLngFormat()) {
      return {
        type: 'Point',
        coordinates: [this.getLongitude(), this.getLatitude()]
      };
    }

    throw new ValidationError('Impossible de convertir en GeoJSON');
  }

  toString() {
    return this._value || '';
  }

  equals(other) {
    if (!(other instanceof Coordonnee)) return false;
    return this._value === other._value;
  }
}

module.exports = { Coordonnee };