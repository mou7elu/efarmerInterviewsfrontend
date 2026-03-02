/**
 * Code Generation Service
 * Génère des codes uniques pour les entités géographiques et administratives
 */
class CodeGenerationService {
  /**
   * Génère un code pour un pays
   * Format: 2 lettres majuscules (ex: CI, FR, US)
   * @param {string} nomPays - Nom du pays
   * @returns {string} Code généré
   */
  generatePaysCode(nomPays) {
    if (!nomPays || nomPays.trim().length === 0) {
      throw new Error('Le nom du pays est requis pour générer un code');
    }

    const mots = nomPays.trim().split(/\s+/);
    let code = '';

    if (mots.length === 1) {
      // Un seul mot: prendre les 2 premières lettres
      code = nomPays.substring(0, 2).toUpperCase();
    } else if (mots.length === 2) {
      // Deux mots: première lettre de chaque mot
      code = (mots[0].charAt(0) + mots[1].charAt(0)).toUpperCase();
    } else {
      // Trois mots ou plus: première lettre des 2 premiers mots
      code = (mots[0].charAt(0) + mots[1].charAt(0)).toUpperCase();
    }

    return code;
  }

  /**
   * Génère un code pour un district
   * Format: Code pays + 2 chiffres (ex: CI01, FR05)
   * @param {string} codePays - Code du pays
   * @param {number} sequence - Numéro de séquence
   * @returns {string} Code généré
   */
  generateDistrictCode(codePays, sequence) {
    if (!codePays) {
      throw new Error('Le code du pays est requis');
    }
    if (typeof sequence !== 'number' || sequence < 0) {
      throw new Error('La séquence doit être un nombre positif');
    }

    const sequenceStr = String(sequence).padStart(2, '0');
    return `${codePays}${sequenceStr}`;
  }

  /**
   * Génère un code pour une région
   * Format: Code district + lettre (ex: CI01A, FR05B)
   * @param {string} codeDistrict - Code du district
   * @param {number} sequence - Numéro de séquence (0-25 pour A-Z)
   * @returns {string} Code généré
   */
  generateRegionCode(codeDistrict, sequence) {
    if (!codeDistrict) {
      throw new Error('Le code du district est requis');
    }
    if (typeof sequence !== 'number' || sequence < 0 || sequence > 25) {
      throw new Error('La séquence doit être entre 0 et 25');
    }

    const lettre = String.fromCharCode(65 + sequence); // 65 = 'A'
    return `${codeDistrict}${lettre}`;
  }

  /**
   * Génère un code pour un département
   * Format: Code région + 2 chiffres (ex: CI01A01, FR05B03)
   * @param {string} codeRegion - Code de la région
   * @param {number} sequence - Numéro de séquence
   * @returns {string} Code généré
   */
  generateDepartementCode(codeRegion, sequence) {
    if (!codeRegion) {
      throw new Error('Le code de la région est requis');
    }
    if (typeof sequence !== 'number' || sequence < 0) {
      throw new Error('La séquence doit être un nombre positif');
    }

    const sequenceStr = String(sequence).padStart(2, '0');
    return `${codeRegion}${sequenceStr}`;
  }

  /**
   * Génère un code pour un village
   * Format: VIL-{departement}-{sequence} (ex: VIL-CI01A01-001)
   * @param {string} codeDepartement - Code du département
   * @param {number} sequence - Numéro de séquence
   * @returns {string} Code généré
   */
  generateVillageCode(codeDepartement, sequence) {
    if (!codeDepartement) {
      throw new Error('Le code du département est requis');
    }
    if (typeof sequence !== 'number' || sequence < 0) {
      throw new Error('La séquence doit être un nombre positif');
    }

    const sequenceStr = String(sequence).padStart(3, '0');
    return `VIL-${codeDepartement}-${sequenceStr}`;
  }

  /**
   * Génère un code pour une sous-préfecture
   * Format: SP-{departement}-{sequence} (ex: SP-CI01A01-01)
   * @param {string} codeDepartement - Code du département
   * @param {number} sequence - Numéro de séquence
   * @returns {string} Code généré
   */
  generateSousprefCode(codeDepartement, sequence) {
    if (!codeDepartement) {
      throw new Error('Le code du département est requis');
    }
    if (typeof sequence !== 'number' || sequence < 0) {
      throw new Error('La séquence doit être un nombre positif');
    }

    const sequenceStr = String(sequence).padStart(2, '0');
    return `SP-${codeDepartement}-${sequenceStr}`;
  }

  /**
   * Génère un code pour un secteur administratif
   * Format: SA-{souspref}-{sequence} (ex: SA-SP-CI01A01-01-001)
   * @param {string} codeSouspref - Code de la sous-préfecture
   * @param {number} sequence - Numéro de séquence
   * @returns {string} Code généré
   */
  generateSecteurCode(codeSouspref, sequence) {
    if (!codeSouspref) {
      throw new Error('Le code de la sous-préfecture est requis');
    }
    if (typeof sequence !== 'number' || sequence < 0) {
      throw new Error('La séquence doit être un nombre positif');
    }

    const sequenceStr = String(sequence).padStart(3, '0');
    return `SA-${codeSouspref}-${sequenceStr}`;
  }

  /**
   * Génère un code pour une zone de dénombrement
   * Format: ZD-{secteur}-{sequence} (ex: ZD-SA-SP-CI01A01-01-001-01)
   * @param {string} codeSecteur - Code du secteur
   * @param {number} sequence - Numéro de séquence
   * @returns {string} Code généré
   */
  generateZonedenombreCode(codeSecteur, sequence) {
    if (!codeSecteur) {
      throw new Error('Le code du secteur est requis');
    }
    if (typeof sequence !== 'number' || sequence < 0) {
      throw new Error('La séquence doit être un nombre positif');
    }

    const sequenceStr = String(sequence).padStart(2, '0');
    return `ZD-${codeSecteur}-${sequenceStr}`;
  }

  /**
   * Génère un code pour une localité
   * Format: LOC-{village}-{sequence} (ex: LOC-VIL-CI01A01-001-01)
   * @param {string} codeVillage - Code du village
   * @param {number} sequence - Numéro de séquence
   * @returns {string} Code généré
   */
  generateLocaliteCode(codeVillage, sequence) {
    if (!codeVillage) {
      throw new Error('Le code du village est requis');
    }
    if (typeof sequence !== 'number' || sequence < 0) {
      throw new Error('La séquence doit être un nombre positif');
    }

    const sequenceStr = String(sequence).padStart(2, '0');
    return `LOC-${codeVillage}-${sequenceStr}`;
  }

  /**
   * Génère un code pour un ménage
   * Format: MEN-{localite}-{sequence} (ex: MEN-LOC-VIL-CI01A01-001-01-001)
   * @param {string} codeLocalite - Code de la localité
   * @param {number} sequence - Numéro de séquence
   * @returns {string} Code généré
   */
  generateMenageCode(codeLocalite, sequence) {
    if (!codeLocalite) {
      throw new Error('Le code de la localité est requis');
    }
    if (typeof sequence !== 'number' || sequence < 0) {
      throw new Error('La séquence doit être un nombre positif');
    }

    const sequenceStr = String(sequence).padStart(3, '0');
    return `${codeLocalite}-${sequenceStr}`;
  }

  /**
   * Génère un code pour un producteur
   * Format: PROD-{année}-{séquence} (ex: PROD-2024-00001)
   * @param {number} annee - Année d'enregistrement
   * @param {number} sequence - Numéro de séquence
   * @returns {string} Code généré
   */
  generateProducteurCode(annee, sequence) {
    if (!annee || typeof annee !== 'number') {
      annee = new Date().getFullYear();
    }
    if (typeof sequence !== 'number' || sequence < 0) {
      throw new Error('La séquence doit être un nombre positif');
    }

    const sequenceStr = String(sequence).padStart(5, '0');
    return `PROD-${annee}-${sequenceStr}`;
  }

  /**
   * Génère un code pour une parcelle
   * Format: PARC-{codeProducteur}-{sequence} (ex: PARC-PROD-2024-00001-01)
   * @param {string} codeProducteur - Code du producteur
   * @param {number} sequence - Numéro de séquence
   * @returns {string} Code généré
   */
  generateParcelleCode(codeProducteur, sequence) {
    if (!codeProducteur) {
      throw new Error('Le code du producteur est requis');
    }
    if (typeof sequence !== 'number' || sequence < 0) {
      throw new Error('La séquence doit être un nombre positif');
    }

    const sequenceStr = String(sequence).padStart(2, '0');
    return `${codeProducteur}-${sequenceStr}`;
  }

  /**
   * Valide le format d'un code
   * @param {string} code - Code à valider
   * @param {string} type - Type d'entité (pays, district, region, etc.)
   * @returns {boolean} True si valide
   */
  validateCodeFormat(code, type) {
    if (!code || typeof code !== 'string') {
      return false;
    }

    const patterns = {
      pays: /^[A-Z]{2}$/,
      district: /^[A-Z]{2}\d{2}$/,
      region: /^[A-Z]{2}\d{2}[A-Z]$/,
      departement: /^[A-Z]{2}\d{2}[A-Z]\d{2}$/,
      village: /^VIL-[A-Z]{2}\d{2}[A-Z]\d{2}-\d{3}$/,
      souspref: /^SP-[A-Z]{2}\d{2}[A-Z]\d{2}-\d{2}$/,
      secteur: /^SA-SP-[A-Z]{2}\d{2}[A-Z]\d{2}-\d{2}-\d{3}$/,
      zonedenombre: /^ZD-SA-SP-[A-Z]{2}\d{2}[A-Z]\d{2}-\d{2}-\d{3}-\d{2}$/,
      localite: /^LOC-VIL-[A-Z]{2}\d{2}[A-Z]\d{2}-\d{3}-\d{2}$/,
      menage: /^MEN-LOC-VIL-[A-Z]{2}\d{2}[A-Z]\d{2}-\d{3}-\d{2}-\d{3}$/,
      producteur: /^PROD-\d{4}-\d{5}$/,
      parcelle: /^PARC-PROD-\d{4}-\d{5}-\d{2}$/
    };

    const pattern = patterns[type.toLowerCase()];
    return pattern ? pattern.test(code) : false;
  }

  /**
   * Extrait le code parent d'un code hiérarchique
   * @param {string} code - Code complet
   * @param {string} type - Type d'entité
   * @returns {string|null} Code parent ou null
   */
  extractParentCode(code, type) {
    if (!code || !type) {
      return null;
    }

    switch (type.toLowerCase()) {
      case 'district':
        return code.substring(0, 2); // Retourne le code pays
      case 'region':
        return code.substring(0, 4); // Retourne le code district
      case 'departement':
        return code.substring(0, 5); // Retourne le code région
      case 'village':
        // VIL-CI01A01-001 -> CI01A01
        const villageParts = code.split('-');
        return villageParts.length >= 2 ? villageParts[1] : null;
      case 'souspref':
        // SP-CI01A01-01 -> CI01A01
        const spParts = code.split('-');
        return spParts.length >= 2 ? spParts[1] : null;
      case 'parcelle':
        // PARC-PROD-2024-00001-01 -> PROD-2024-00001
        return code.replace(/^PARC-/, '').replace(/-\d{2}$/, '');
      default:
        return null;
    }
  }
}

module.exports = new CodeGenerationService();
