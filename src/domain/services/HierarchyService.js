/**
 * Hierarchy Service
 * Service de gestion de la hiérarchie géographique et administrative
 */
class HierarchyService {
  /**
   * Construit le chemin hiérarchique complet d'une entité géographique
   * @param {Object} entity - Entité avec populate des parents
   * @returns {Object} Chemin hiérarchique
   */
  buildGeographicPath(entity) {
    const path = {
      pays: null,
      district: null,
      region: null,
      departement: null,
      village: null
    };

    if (!entity) {
      return path;
    }

    // Village
    if (entity.departementId) {
      path.village = {
        id: entity._id,
        code: entity.code_village,
        nom: entity.Nom_village
      };

      // Département
      if (entity.departementId.regionId) {
        path.departement = {
          id: entity.departementId._id,
          code: entity.departementId.code_depart,
          nom: entity.departementId.Nom_depart
        };

        // Région
        if (entity.departementId.regionId.districtId) {
          path.region = {
            id: entity.departementId.regionId._id,
            code: entity.departementId.regionId.code_region,
            nom: entity.departementId.regionId.Nom_region
          };

          // District
          if (entity.departementId.regionId.districtId.paysId) {
            path.district = {
              id: entity.departementId.regionId.districtId._id,
              code: entity.departementId.regionId.districtId.code_district,
              nom: entity.departementId.regionId.districtId.Nom_district
            };

            // Pays
            path.pays = {
              id: entity.departementId.regionId.districtId.paysId._id,
              code: entity.departementId.regionId.districtId.paysId.code_pays,
              nom: entity.departementId.regionId.districtId.paysId.Nom_pays
            };
          }
        }
      }
    }

    return path;
  }

  /**
   * Construit le chemin hiérarchique administratif complet
   * @param {Object} entity - Entité avec populate des parents
   * @returns {Object} Chemin hiérarchique administratif
   */
  buildAdministrativePath(entity) {
    const path = {
      pays: null,
      district: null,
      region: null,
      departement: null,
      souspref: null,
      secteur: null,
      zone: null,
      village: null,
      localite: null,
      menage: null
    };

    if (!entity) {
      return path;
    }

    // Gérer les différents types d'entités
    if (entity.localiteId) {
      // C'est un ménage
      path.menage = {
        id: entity._id,
        code: entity.code_menage,
        nom: entity.nom_menage
      };

      if (entity.localiteId) {
        this._addLocaliteToPath(path, entity.localiteId);
      }
    } else if (entity.villageId && entity.code_localite) {
      // C'est une localité
      this._addLocaliteToPath(path, entity);
    } else if (entity.secteurId) {
      // C'est une zone de dénombrement
      path.zone = {
        id: entity._id,
        code: entity.code_zone,
        nom: entity.nom_zone
      };

      if (entity.secteurId) {
        this._addSecteurToPath(path, entity.secteurId);
      }
    } else if (entity.sousprefId) {
      // C'est un secteur administratif
      this._addSecteurToPath(path, entity);
    } else if (entity.departementId && entity.code_souspref) {
      // C'est une sous-préfecture
      this._addSousprefToPath(path, entity);
    }

    return path;
  }

  /**
   * Ajoute une localité au chemin
   * @private
   */
  _addLocaliteToPath(path, localite) {
    path.localite = {
      id: localite._id,
      code: localite.code_localite,
      nom: localite.nom_localite
    };

    if (localite.villageId) {
      this._addVillageToPath(path, localite.villageId);
    }
  }

  /**
   * Ajoute un village au chemin
   * @private
   */
  _addVillageToPath(path, village) {
    path.village = {
      id: village._id,
      code: village.code_village,
      nom: village.Nom_village
    };

    if (village.departementId) {
      this._addDepartementToPath(path, village.departementId);
    }
  }

  /**
   * Ajoute un département au chemin
   * @private
   */
  _addDepartementToPath(path, departement) {
    path.departement = {
      id: departement._id,
      code: departement.code_depart,
      nom: departement.Nom_depart
    };

    if (departement.regionId) {
      this._addRegionToPath(path, departement.regionId);
    }
  }

  /**
   * Ajoute une région au chemin
   * @private
   */
  _addRegionToPath(path, region) {
    path.region = {
      id: region._id,
      code: region.code_region,
      nom: region.Nom_region
    };

    if (region.districtId) {
      this._addDistrictToPath(path, region.districtId);
    }
  }

  /**
   * Ajoute un district au chemin
   * @private
   */
  _addDistrictToPath(path, district) {
    path.district = {
      id: district._id,
      code: district.code_district,
      nom: district.Nom_district
    };

    if (district.paysId) {
      path.pays = {
        id: district.paysId._id,
        code: district.paysId.code_pays,
        nom: district.paysId.Nom_pays
      };
    }
  }

  /**
   * Ajoute un secteur administratif au chemin
   * @private
   */
  _addSecteurToPath(path, secteur) {
    path.secteur = {
      id: secteur._id,
      code: secteur.code_secteur,
      nom: secteur.nom_secteur
    };

    if (secteur.sousprefId) {
      this._addSousprefToPath(path, secteur.sousprefId);
    }
  }

  /**
   * Ajoute une sous-préfecture au chemin
   * @private
   */
  _addSousprefToPath(path, souspref) {
    path.souspref = {
      id: souspref._id,
      code: souspref.code_souspref,
      nom: souspref.nom_souspref
    };

    if (souspref.departementId) {
      this._addDepartementToPath(path, souspref.departementId);
    }
  }

  /**
   * Construit le chemin complet (géographique + administratif) pour un ménage
   * @param {Object} menage - Ménage avec tous les populate
   * @returns {Object} Chemin complet
   */
  buildFullMenagePath(menage) {
    if (!menage) {
      return null;
    }

    const path = {
      menage: {
        id: menage._id,
        code: menage.code_menage,
        nom: menage.nom_menage,
        enqueteur: menage.enqueteur
      },
      localite: null,
      village: null,
      zonedenombre: null,
      secteurAdministratif: null,
      souspref: null,
      departement: null,
      region: null,
      district: null,
      pays: null
    };

    // Localité
    if (menage.localiteId) {
      path.localite = {
        id: menage.localiteId._id,
        code: menage.localiteId.code_localite,
        nom: menage.localiteId.nom_localite
      };

      // Village (depuis localité)
      if (menage.villageId) {
        path.village = {
          id: menage.villageId._id,
          code: menage.villageId.code_village,
          nom: menage.villageId.Nom_village
        };
      }
    }

    // Zone de dénombrement
    if (menage.zonedenombreId) {
      path.zonedenombre = {
        id: menage.zonedenombreId._id,
        code: menage.zonedenombreId.code_zone,
        nom: menage.zonedenombreId.nom_zone
      };
    }

    // Secteur administratif
    if (menage.secteurAdministratifId) {
      path.secteurAdministratif = {
        id: menage.secteurAdministratifId._id,
        code: menage.secteurAdministratifId.code_secteur,
        nom: menage.secteurAdministratifId.nom_secteur
      };
    }

    // Sous-préfecture
    if (menage.sousprefId) {
      path.souspref = {
        id: menage.sousprefId._id,
        code: menage.sousprefId.code_souspref,
        nom: menage.sousprefId.nom_souspref
      };
    }

    // Département
    if (menage.departementId) {
      path.departement = {
        id: menage.departementId._id,
        code: menage.departementId.code_depart,
        nom: menage.departementId.Nom_depart
      };
    }

    // Région
    if (menage.regionId) {
      path.region = {
        id: menage.regionId._id,
        code: menage.regionId.code_region,
        nom: menage.regionId.Nom_region
      };
    }

    // District
    if (menage.districtId) {
      path.district = {
        id: menage.districtId._id,
        code: menage.districtId.code_district,
        nom: menage.districtId.Nom_district
      };
    }

    // Pays
    if (menage.paysId) {
      path.pays = {
        id: menage.paysId._id,
        code: menage.paysId.code_pays,
        nom: menage.paysId.Nom_pays
      };
    }

    return path;
  }

  /**
   * Valide la cohérence de la hiérarchie géographique
   * @param {Object} data - Données avec les IDs de la hiérarchie
   * @returns {{valid: boolean, errors: string[]}}
   */
  validateGeographicHierarchy(data) {
    const errors = [];

    // Vérifier que les niveaux supérieurs sont présents
    if (data.villageId && !data.departementId) {
      errors.push('Un village doit avoir un département parent');
    }

    if (data.departementId && !data.regionId) {
      errors.push('Un département doit avoir une région parente');
    }

    if (data.regionId && !data.districtId) {
      errors.push('Une région doit avoir un district parent');
    }

    if (data.districtId && !data.paysId) {
      errors.push('Un district doit avoir un pays parent');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Valide la cohérence de la hiérarchie administrative
   * @param {Object} data - Données avec les IDs de la hiérarchie
   * @returns {{valid: boolean, errors: string[]}}
   */
  validateAdministrativeHierarchy(data) {
    const errors = [];

    // Vérifier que les niveaux supérieurs sont présents
    if (data.menageId && !data.localiteId) {
      errors.push('Un ménage doit avoir une localité parente');
    }

    if (data.localiteId && !data.villageId) {
      errors.push('Une localité doit avoir un village parent');
    }

    if (data.zonedenombreId && !data.secteurAdministratifId) {
      errors.push('Une zone de dénombrement doit avoir un secteur administratif parent');
    }

    if (data.secteurAdministratifId && !data.sousprefId) {
      errors.push('Un secteur administratif doit avoir une sous-préfecture parente');
    }

    if (data.sousprefId && !data.departementId) {
      errors.push('Une sous-préfecture doit avoir un département parent');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Extrait les niveaux hiérarchiques d'un code
   * @param {string} code - Code complet
   * @param {string} type - Type d'entité
   * @returns {Object} Niveaux extraits
   */
  extractLevelsFromCode(code, type) {
    if (!code || !type) {
      return {};
    }

    const levels = {};

    switch (type.toLowerCase()) {
      case 'village':
        // VIL-CI01A01-001
        const villageParts = code.split('-');
        if (villageParts.length >= 2) {
          levels.departement = villageParts[1];
          levels.region = villageParts[1].substring(0, 5);
          levels.district = villageParts[1].substring(0, 4);
          levels.pays = villageParts[1].substring(0, 2);
        }
        break;

      case 'souspref':
        // SP-CI01A01-01
        const spParts = code.split('-');
        if (spParts.length >= 2) {
          levels.departement = spParts[1];
          levels.region = spParts[1].substring(0, 5);
          levels.district = spParts[1].substring(0, 4);
          levels.pays = spParts[1].substring(0, 2);
        }
        break;

      case 'departement':
        // CI01A01
        levels.region = code.substring(0, 5);
        levels.district = code.substring(0, 4);
        levels.pays = code.substring(0, 2);
        break;

      case 'region':
        // CI01A
        levels.district = code.substring(0, 4);
        levels.pays = code.substring(0, 2);
        break;

      case 'district':
        // CI01
        levels.pays = code.substring(0, 2);
        break;

      default:
        break;
    }

    return levels;
  }

  /**
   * Construit un breadcrumb de navigation
   * @param {Object} path - Chemin hiérarchique
   * @returns {Array} Tableau de breadcrumbs
   */
  buildBreadcrumb(path) {
    const breadcrumb = [];

    if (path.pays) {
      breadcrumb.push({
        level: 'pays',
        label: path.pays.nom,
        code: path.pays.code,
        id: path.pays.id
      });
    }

    if (path.district) {
      breadcrumb.push({
        level: 'district',
        label: path.district.nom,
        code: path.district.code,
        id: path.district.id
      });
    }

    if (path.region) {
      breadcrumb.push({
        level: 'region',
        label: path.region.nom,
        code: path.region.code,
        id: path.region.id
      });
    }

    if (path.departement) {
      breadcrumb.push({
        level: 'departement',
        label: path.departement.nom,
        code: path.departement.code,
        id: path.departement.id
      });
    }

    if (path.souspref) {
      breadcrumb.push({
        level: 'souspref',
        label: path.souspref.nom,
        code: path.souspref.code,
        id: path.souspref.id
      });
    }

    if (path.secteur) {
      breadcrumb.push({
        level: 'secteur',
        label: path.secteur.nom,
        code: path.secteur.code,
        id: path.secteur.id
      });
    }

    if (path.zone) {
      breadcrumb.push({
        level: 'zone',
        label: path.zone.nom,
        code: path.zone.code,
        id: path.zone.id
      });
    }

    if (path.village) {
      breadcrumb.push({
        level: 'village',
        label: path.village.nom,
        code: path.village.code,
        id: path.village.id
      });
    }

    if (path.localite) {
      breadcrumb.push({
        level: 'localite',
        label: path.localite.nom,
        code: path.localite.code,
        id: path.localite.id
      });
    }

    if (path.menage) {
      breadcrumb.push({
        level: 'menage',
        label: path.menage.nom,
        code: path.menage.code,
        id: path.menage.id
      });
    }

    return breadcrumb;
  }

  /**
   * Détermine le niveau hiérarchique d'une entité
   * @param {string} type - Type d'entité
   * @returns {number} Niveau (0 = plus haut, plus grand = plus bas)
   */
  getHierarchyLevel(type) {
    const levels = {
      pays: 0,
      district: 1,
      region: 2,
      departement: 3,
      souspref: 4,
      secteur: 5,
      zone: 6,
      village: 7,
      localite: 8,
      menage: 9
    };

    return levels[type.toLowerCase()] ?? -1;
  }

  /**
   * Vérifie si un type est parent d'un autre
   * @param {string} parentType - Type parent potentiel
   * @param {string} childType - Type enfant potentiel
   * @returns {boolean} True si parentType est parent de childType
   */
  isParentOf(parentType, childType) {
    const parentLevel = this.getHierarchyLevel(parentType);
    const childLevel = this.getHierarchyLevel(childType);

    return parentLevel >= 0 && childLevel >= 0 && parentLevel < childLevel;
  }
}

module.exports = new HierarchyService();
