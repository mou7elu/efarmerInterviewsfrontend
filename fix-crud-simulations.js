/**
 * Script pour corriger toutes les simulations restantes dans les actions CRUD
 * Exécuter avec : node fix-crud-simulations.js
 */

const fs = require('fs');
const path = require('path');

// Fonction pour corriger les simulations dans un fichier
function fixSimulationsInFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`❌ Fichier non trouvé: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 1. Corriger les fonctions de suppression (delete)
  const deleteSimulationRegex = /\/\/ Simulation de suppression[\s\S]*?console\.log\('Suppression.*?\);/g;
  if (deleteSimulationRegex.test(content)) {
    const entityName = getEntityNameFromPath(filePath);
    const apiName = getApiNameFromEntity(entityName);
    
    if (apiName) {
      content = content.replace(deleteSimulationRegex, 
        `// Supprimer via l'API\n        await ${apiName}.delete(id);\n        console.log('Suppression réussie:', id);`);
      modified = true;
    }
  }

  // 2. Corriger les fonctions de mise à jour (edit/update)
  const updateSimulationRegex = /\/\/ Simulation de la mise à jour[\s\S]*?console\.log\('Mise à jour.*?\);/g;
  if (updateSimulationRegex.test(content)) {
    const entityName = getEntityNameFromPath(filePath);
    const apiName = getApiNameFromEntity(entityName);
    
    if (apiName && filePath.includes('Edit')) {
      content = content.replace(updateSimulationRegex, 
        `// Mettre à jour via l'API\n      const response = await ${apiName}.update(formData._id || formData.id, formData);\n      console.log('Mise à jour réussie:', response);`);
      modified = true;
    }
  }

  // 3. Corriger les fonctions de chargement qui utilisent encore des simulations
  const loadSimulationRegex = /\/\/ Simulation du chargement[\s\S]*?await new Promise.*?\);/g;
  if (loadSimulationRegex.test(content)) {
    content = content.replace(loadSimulationRegex, '// Chargement via API (déjà implémenté)');
    modified = true;
  }

  // 4. Corriger les suppressions dans les listes qui modifient le state localement
  const localDeleteRegex = /setI?([A-Z][a-z]+)\(prev => prev\.filter\(.*? => .*?\._id !== id\)\);/g;
  if (localDeleteRegex.test(content)) {
    content = content.replace(localDeleteRegex, 
      '// Recharger les données après suppression\n        loadData();');
    modified = true;
  }

  // 5. Ajouter les imports API manquants pour les pages Edit/Detail
  if ((filePath.includes('Edit') || filePath.includes('Detail')) && 
      !content.includes('from \'../../../services/api.js\'')) {
    
    const entityName = getEntityNameFromPath(filePath);
    const apiName = getApiNameFromEntity(entityName);
    
    if (apiName) {
      const loadingSpinnerImport = content.match(/import LoadingSpinner.*?;/);
      if (loadingSpinnerImport) {
        const newImport = `${loadingSpinnerImport[0]}\nimport { ${apiName}, handleApiError } from '../../../services/api.js';`;
        content = content.replace(loadingSpinnerImport[0], newImport);
        modified = true;
      }
    }
  }

  // Sauvegarder si des modifications ont été faites
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Corrigé: ${filePath}`);
    return true;
  } else {
    console.log(`ℹ️  Aucun changement nécessaire: ${filePath}`);
    return false;
  }
}

// Fonction pour extraire le nom de l'entité du chemin de fichier
function getEntityNameFromPath(filePath) {
  const pathParts = filePath.split(/[\/\\]/);
  const pageFolder = pathParts.find(part => 
    ['Producteurs', 'Interviews', 'Users', 'Villages', 'ZonesInterdites', 'Profiles', 'Geographic', 'Questionnaires', 'Parcelles', 'Pieces', 'Districts'].includes(part)
  );
  
  if (pageFolder) {
    switch (pageFolder) {
      case 'Producteurs': return 'producteurs';
      case 'Interviews': return 'interviews';
      case 'Users': return 'users';
      case 'Villages': return 'villages';
      case 'ZonesInterdites': return 'zones-interdites';
      case 'Profiles': return 'profiles';
      case 'Questionnaires': return 'questionnaires';
      case 'Parcelles': return 'parcelles';
      case 'Pieces': return 'pieces';
      case 'Districts': return 'districts';
      default: return 'unknown';
    }
  }
  return 'unknown';
}

// Fonction pour obtenir le nom de l'API à partir du nom de l'entité
function getApiNameFromEntity(entityName) {
  const mapping = {
    'producteurs': 'producteursAPI',
    'interviews': 'interviewsAPI',
    'users': 'usersAPI',
    'villages': 'villagesAPI',
    'zones-interdites': 'zonesInterditesAPI',
    'profiles': 'profilesAPI',
    'questionnaires': 'questionnairesAPI',
    'parcelles': 'parcellesAPI',
    'pieces': 'piecesAPI',
    'districts': 'districtAPI'
  };
  
  return mapping[entityName] || null;
}

// Fonction pour scanner récursivement un dossier
function scanDirectory(dir, files = []) {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const dirent of dirents) {
    const fullPath = path.join(dir, dirent.name);
    
    if (dirent.isDirectory()) {
      scanDirectory(fullPath, files);
    } else if (dirent.isFile() && dirent.name.endsWith('.jsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Script principal
function main() {
  console.log('🚀 Correction des simulations CRUD...\n');
  
  const pagesDir = path.join(__dirname, 'src', 'presentation', 'pages');
  
  if (!fs.existsSync(pagesDir)) {
    console.error('❌ Dossier pages non trouvé:', pagesDir);
    return;
  }
  
  const jsxFiles = scanDirectory(pagesDir);
  
  // Filtrer seulement les fichiers qui contiennent des simulations
  const filesToFix = jsxFiles.filter(file => {
    const content = fs.readFileSync(file, 'utf8');
    return content.includes('Simulation de') || content.includes('simulation de');
  });
  
  console.log(`📂 Trouvé ${filesToFix.length} fichiers avec des simulations:\n`);
  
  let successCount = 0;
  
  filesToFix.forEach(file => {
    const relativePath = path.relative(pagesDir, file);
    console.log(`🔄 Correction de: ${relativePath}`);
    
    try {
      if (fixSimulationsInFile(file)) {
        successCount++;
      }
    } catch (error) {
      console.error(`❌ Erreur lors de la correction de ${relativePath}:`, error.message);
    }
  });
  
  console.log(`\n✨ Correction terminée: ${successCount}/${filesToFix.length} fichiers corrigés avec succès`);
}

// Exécuter le script si appelé directement
if (require.main === module) {
  main();
}

module.exports = {
  fixSimulationsInFile,
  main
};