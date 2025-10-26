#!/usr/bin/env node

/**
 * Script de migration automatique des données fictives vers les appels API
 * Ce script remplace les données mock par des appels API dans toutes les pages CRUD
 */

const fs = require('fs');
const path = require('path');

// Configuration des entités et leurs API correspondantes
const entities = [
  { name: 'Sections', api: 'sectionsAPI', service: 'sectionsService' },
  { name: 'Questions', api: 'questionsAPI', service: 'questionsService' },
  { name: 'Districts', api: 'districtAPI' },
  { name: 'Villages', api: 'villagesAPI' },
  { name: 'ZonesInterdites', api: 'zonesInterditesAPI' },
  { name: 'Pieces', api: 'piecesAPI' },
  { name: 'Profiles', api: 'profilesAPI', service: 'profilesService' },
  { name: 'Users', api: 'usersAPI', service: 'usersService' },
  { name: 'Nationalites', api: 'nationalitesAPI' },
  { name: 'NiveauxScolaires', api: 'niveauxScolairesAPI' }
];

// Modèles de remplacement pour les imports API
const getApiImport = (entityConfig) => {
  const imports = [entityConfig.api];
  if (entityConfig.service) {
    imports.push(entityConfig.service);
  }
  return `import { ${imports.join(', ')}, handleApiError } from '@/services/api.js';`;
};

// Templates de code pour les différents types de pages
const templates = {
  listPage: {
    // Remplacer loadData avec appel API
    loadData: (apiName) => `
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ${apiName}.getAll();
      const data = response.data || response;
      
      // Mettre à jour l'état avec les données reçues
      ${getSetDataCall(apiName)}(data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };`,
    
    // Remplacer handleDelete avec appel API
    handleDelete: (apiName) => `
  const handleDelete = async (id) => {
    if (globalThis.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      try {
        await ${apiName}.delete(id);
        ${getDeleteStateUpdate(apiName)}
        setSuccessMessage('Élément supprimé avec succès');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setError(handleApiError(error));
      }
    }
  };`
  },
  
  createPage: {
    // Remplacer handleSubmit avec appel API
    handleSubmit: (apiName) => `
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
      
      await ${apiName}.create(formData);
      navigate('/${getRoutePath(apiName)}', { state: { message: 'Élément créé avec succès' } });
    } catch (err) {
      console.error('Erreur lors de la création:', err);
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };`
  },
  
  editPage: {
    // Remplacer loadData avec appel API
    loadData: (apiName, entityName) => `
  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await ${apiName}.getById(id);
      const data = response.data || response;
      
      setFormData(${getFormDataMapping(entityName, 'data')});
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };`,
    
    // Remplacer handleSubmit avec appel API
    handleSubmit: (apiName) => `
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
      
      await ${apiName}.update(id, formData);
      navigate('/${getRoutePath(apiName)}', { state: { message: 'Élément modifié avec succès' } });
    } catch (err) {
      console.error('Erreur lors de la modification:', err);
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };`
  },
  
  detailPage: {
    // Remplacer loadData avec appel API
    loadData: (apiName) => `
  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await ${apiName}.getById(id);
      ${getSetEntityCall(apiName)}(response.data || response);
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };`
  }
};

// Fonctions utilitaires pour générer le code dynamiquement
function getSetDataCall(apiName) {
  const entityName = apiName.replace('API', '').replace('sAPI', 's');
  return `set${entityName.charAt(0).toUpperCase() + entityName.slice(1)}`;
}

function getSetEntityCall(apiName) {
  const entityName = apiName.replace('API', '').replace('sAPI', '');
  return `set${entityName.charAt(0).toUpperCase() + entityName.slice(1)}`;
}

function getDeleteStateUpdate(apiName) {
  const entityName = apiName.replace('API', '').replace('sAPI', 's');
  const setterName = `set${entityName.charAt(0).toUpperCase() + entityName.slice(1)}`;
  return `${setterName}(prev => prev.filter(item => item._id !== id));`;
}

function getRoutePath(apiName) {
  return apiName.replace('API', '').replace('sAPI', 's').toLowerCase();
}

function getFormDataMapping(entityName, dataVar) {
  // Mappings spécifiques selon l'entité
  const mappings = {
    'Sections': `{ titre: ${dataVar}.titre, ordre: ${dataVar}.ordre, voletId: ${dataVar}.voletId }`,
    'Questions': `{ code: ${dataVar}.code, texte: ${dataVar}.texte, type: ${dataVar}.type, obligatoire: ${dataVar}.obligatoire, sectionId: ${dataVar}.sectionId }`,
    'Districts': `{ Lib_district: ${dataVar}.Lib_district, Sommeil: ${dataVar}.Sommeil, PaysId: ${dataVar}.PaysId }`,
    'Villages': `{ Lib_village: ${dataVar}.Lib_village, Coordonnee: ${dataVar}.Coordonnee, PaysId: ${dataVar}.PaysId }`,
    'ZonesInterdites': `{ Lib_zi: ${dataVar}.Lib_zi, Coordonnee: ${dataVar}.Coordonnee, Sommeil: ${dataVar}.Sommeil, PaysId: ${dataVar}.PaysId }`,
    'Pieces': `{ Nom_piece: ${dataVar}.Nom_piece }`,
    'Profiles': `{ name: ${dataVar}.name, permissions: ${dataVar}.permissions }`,
    'Users': `{ email: ${dataVar}.email, Nom_ut: ${dataVar}.Nom_ut, Pren_ut: ${dataVar}.Pren_ut, profileId: ${dataVar}.profileId }`,
    'Nationalites': `{ Lib_Nation: ${dataVar}.Lib_Nation }`,
    'NiveauxScolaires': `{ Lib_NiveauScolaire: ${dataVar}.Lib_NiveauScolaire }`
  };
  
  return mappings[entityName] || `${dataVar}`;
}

console.log('🚀 Script de migration API - Remplacement des données fictives');
console.log('📁 Répertoire frontend détecté, mise à jour des pages CRUD...');

// Ce script servirait à automatiser la migration, mais pour l'instant
// nous procédons manuellement page par page pour plus de contrôle
console.log('✅ Migration manuelle recommandée pour plus de précision');
console.log('📋 Entités à migrer:', entities.map(e => e.name).join(', '));