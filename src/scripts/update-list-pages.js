// Script pour automatiser l'application des corrections aux pages List
// Ce script sera utilisé comme référence pour les corrections manuelles

const pagesToUpdate = [
  'Geographic/PaysListPage.jsx',
  'Geographic/RegionsListPage.jsx', 
  'Geographic/DepartementsListPage.jsx',
  'Geographic/SousprefsListPage.jsx',
  'Reference/NationalitesListPage.jsx',
  'Reference/NiveauxScolairesListPage.jsx',
  'Questionnaires/QuestionnairesListPage.jsx'
];

// Modifications à appliquer:

// 1. Ajouter l'import des utilitaires:
const importToAdd = `
import { getValue, getSafeId, getLibelle, extractDataFromApiResponse } from '../../../shared/utils/entityHelpers.js';
`;

// 2. Remplacer les fonctions de récupération de données:
// Ancien:
const oldDataExtraction = `
if (response.success && response.data) {
  const items = response.data.items || response.data || [];
  // ...
}
`;

// Nouveau:
const newDataExtraction = `
const items = extractDataFromApiResponse(response);
`;

// 3. Protéger l'affichage des libellés:
// Ancien: entity.libelle ou entity.Libelle
// Nouveau: getValue(entity.libelle || entity.Libelle)

// 4. Protéger les IDs:
// Ancien: entity._id ou entity.id  
// Nouveau: getSafeId(entity)

// 5. Pour les entités avec libellé, utiliser getLibelle(entity)

console.log('Pages à mettre à jour:', pagesToUpdate);
console.log('Import à ajouter:', importToAdd);