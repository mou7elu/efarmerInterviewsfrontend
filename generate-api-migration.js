/**
 * Utilitaire de migration automatique pour remplacer les données fictives par des appels API
 * Génère le code de remplacement pour toutes les pages CRUD
 */

// Configuration des entités avec leurs patterns spécifiques
const entityConfigs = {
  // Pages de référence simple (un seul champ)
  Nationalites: {
    api: 'nationalitesAPI',
    mainField: 'Lib_Nation',
    route: 'nationalites'
  },
  NiveauxScolaires: {
    api: 'niveauxScolairesAPI', 
    mainField: 'Lib_NiveauScolaire',
    route: 'niveaux-scolaires'
  },
  Pieces: {
    api: 'piecesAPI',
    mainField: 'Nom_piece', 
    route: 'pieces'
  },
  
  // Pages avec relations
  Volets: {
    api: 'voletsAPI',
    fields: ['titre', 'ordre', 'questionnaireId'],
    relations: ['questionnaires'],
    route: 'volets'
  },
  Sections: {
    api: 'sectionsAPI',
    service: 'sectionsService', 
    fields: ['titre', 'ordre', 'voletId'],
    relations: ['volets'],
    route: 'sections'
  },
  Questions: {
    api: 'questionsAPI',
    service: 'questionsService',
    fields: ['code', 'texte', 'type', 'obligatoire', 'sectionId'],
    relations: ['sections', 'volets'],
    route: 'questions'
  },
  
  // Pages géographiques
  Districts: {
    api: 'districtAPI',
    fields: ['Lib_district', 'Sommeil', 'PaysId'],
    relations: ['pays'],
    route: 'districts'
  },
  Villages: {
    api: 'villagesAPI',
    fields: ['Lib_village', 'Coordonnee', 'PaysId'],
    relations: ['pays'],
    route: 'villages'
  },
  ZonesInterdites: {
    api: 'zonesInterditesAPI',
    fields: ['Lib_zi', 'Coordonnee', 'Sommeil', 'PaysId'],
    relations: ['pays'], 
    route: 'zones-interdites'
  },
  
  // Pages complexes
  Profiles: {
    api: 'profilesAPI',
    service: 'profilesService',
    fields: ['name', 'permissions'],
    relations: ['menus'],
    route: 'profiles'
  },
  Users: {
    api: 'usersAPI',
    service: 'usersService', 
    fields: ['email', 'Nom_ut', 'Pren_ut', 'profileId', 'ResponsableId'],
    relations: ['profiles'],
    route: 'users'
  }
};

// Templates de code pour chaque type de page
const generateListPageCode = (entity, config) => {
  const imports = [config.api];
  if (config.service) imports.push(config.service);
  
  return {
    import: `import { ${imports.join(', ')}, handleApiError } from '@/services/api.js';`,
    
    loadData: `
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ${config.api}.getAll({
        search: searchTerm,
        page: page + 1,
        limit: rowsPerPage
      });
      
      const data = response.data || response;
      set${entity}(Array.isArray(data) ? data : data.items || []);
      setTotalCount(data.total || data.length || 0);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError(handleApiError(error));
      set${entity}([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };`,
    
    handleDelete: `
  const handleDelete = async (id) => {
    if (globalThis.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      try {
        await ${config.api}.delete(id);
        set${entity}(prev => prev.filter(item => item._id !== id));
        setSuccessMessage('Élément supprimé avec succès');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setError(handleApiError(error));
      }
    }
  };`
  };
};

const generateCreatePageCode = (entity, config) => {
  const imports = [config.api];
  if (config.service) imports.push(config.service);
  
  return {
    import: `import { ${imports.join(', ')}, handleApiError } from '@/services/api.js';`,
    
    handleSubmit: `
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      await ${config.api}.create(formData);
      navigate('/${config.route}', { 
        state: { successMessage: 'Élément créé avec succès' } 
      });
    } catch (err) {
      console.error('Erreur lors de la création:', err);
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };`
  };
};

const generateEditPageCode = (entity, config) => {
  const imports = [config.api];
  if (config.service) imports.push(config.service);
  
  return {
    import: `import { ${imports.join(', ')}, handleApiError } from '@/services/api.js';`,
    
    loadData: `
  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await ${config.api}.getById(id);
      const data = response.data || response;
      
      setFormData(${generateFormDataMapping(entity, config, 'data')});
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };`,
    
    handleSubmit: `
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      await ${config.api}.update(id, formData);
      navigate('/${config.route}', { 
        state: { successMessage: 'Élément modifié avec succès' } 
      });
    } catch (err) {
      console.error('Erreur lors de la modification:', err);
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };`
  };
};

const generateDetailPageCode = (entity, config) => {
  const imports = [config.api];
  if (config.service) imports.push(config.service);
  
  return {
    import: `import { ${imports.join(', ')}, handleApiError } from '@/services/api.js';`,
    
    loadData: `
  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await ${config.api}.getById(id);
      set${entity.slice(0, -1)}(response.data || response);
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };`
  };
};

// Générer le mapping des données de formulaire
const generateFormDataMapping = (entity, config, dataVar) => {
  if (config.mainField) {
    return `{ ${config.mainField}: ${dataVar}.${config.mainField} }`;
  }
  
  if (config.fields) {
    const mappings = config.fields.map(field => `${field}: ${dataVar}.${field}`);
    return `{ ${mappings.join(', ')} }`;
  }
  
  return dataVar;
};

// Génération du code complet pour toutes les entités
console.log('🚀 GÉNÉRATION DU CODE DE MIGRATION API');
console.log('=====================================\n');

Object.entries(entityConfigs).forEach(([entity, config]) => {
  console.log(`📋 ENTITÉ: ${entity}`);
  console.log('='.repeat(entity.length + 10));
  
  // Page Liste
  console.log('\n🔹 LIST PAGE:');
  const listCode = generateListPageCode(entity, config);
  console.log('Import:', listCode.import);
  console.log('LoadData:', listCode.loadData);
  console.log('HandleDelete:', listCode.handleDelete);
  
  // Page Création
  console.log('\n🔹 CREATE PAGE:');
  const createCode = generateCreatePageCode(entity, config);
  console.log('Import:', createCode.import);
  console.log('HandleSubmit:', createCode.handleSubmit);
  
  // Page Édition
  console.log('\n🔹 EDIT PAGE:');
  const editCode = generateEditPageCode(entity, config);
  console.log('Import:', editCode.import);
  console.log('LoadData:', editCode.loadData);
  console.log('HandleSubmit:', editCode.handleSubmit);
  
  // Page Détail
  console.log('\n🔹 DETAIL PAGE:');
  const detailCode = generateDetailPageCode(entity, config);
  console.log('Import:', detailCode.import);
  console.log('LoadData:', detailCode.loadData);
  
  console.log('\n' + '='.repeat(50) + '\n');
});

console.log('✅ Code généré! Copiez-collez dans chaque fichier correspondant.');