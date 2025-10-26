/**
 * Script de migration pour remplacer toutes les mock data par des appels API
 * Exécuter avec : node migrate-mock-data.js
 */

const fs = require('fs');
const path = require('path');

// Configuration des entités et leurs APIs correspondantes
const entityMappings = {
  'producteurs': 'producteursAPI',
  'questionnaires': 'questionnairesAPI', 
  'interviews': 'interviewsAPI',
  'users': 'usersAPI',
  'villages': 'villagesAPI',
  'zones-interdites': 'zonesInterditesAPI',
  'profiles': 'profilesAPI',
  'pays': 'paysAPI',
  'regions': 'regionsAPI',
  'departements': 'departementsAPI',
  'sousprefs': 'sousprefsAPI',
  'parcelles': 'parcellesAPI'
};

// Fonction pour scanner et remplacer les mock data dans un fichier
function migrateMockDataInFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`❌ Fichier non trouvé: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 1. Ajouter les imports API si manquants
  if (!content.includes('from \'../../../services/api.js\'')) {
    // Trouver l'import LoadingSpinner et ajouter l'import API après
    const loadingSpinnerImport = content.match(/import LoadingSpinner.*?;/);
    if (loadingSpinnerImport) {
      const importApis = Object.values(entityMappings).join(', ');
      const newImport = `${loadingSpinnerImport[0]}\nimport { ${importApis}, handleApiError } from '../../../services/api.js';`;
      content = content.replace(loadingSpinnerImport[0], newImport);
      modified = true;
    }
  }

  // 2. Supprimer les déclarations de mock data (const mockXXX = [...])
  const mockDataRegex = /const mock\w+\s*=\s*\[[\s\S]*?\];?\s*/g;
  const mockMatches = content.match(mockDataRegex);
  if (mockMatches) {
    mockMatches.forEach(mockDeclaration => {
      content = content.replace(mockDeclaration, '');
      modified = true;
    });
  }

  // 3. Remplacer les useEffect de simulation par des appels API
  const simulationEffectRegex = /useEffect\(\(\) => \{\s*\/\/ Simulation.*?setLoading\(false\);[\s\S]*?\}, \[\]\);/g;
  if (simulationEffectRegex.test(content)) {
    content = content.replace(simulationEffectRegex, `useEffect(() => {
    loadData();
  }, []);`);
    modified = true;
  }

  // 4. Ajouter les états manquants pour les données API
  if (!content.includes('[error, setError]')) {
    const stateRegex = /const \[filterDialogOpen, setFilterDialogOpen\] = useState\(false\);/;
    if (stateRegex.test(content)) {
      content = content.replace(stateRegex, `const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [error, setError] = useState(null);`);
      modified = true;
    }
  }

  // 5. Ajouter la fonction loadData si manquante
  if (!content.includes('const loadData =')) {
    const entityName = getEntityNameFromPath(filePath);
    const apiName = entityMappings[entityName];
    
    if (apiName) {
      const loadDataFunction = `
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ${apiName}.getAll();
      const data = response.data || response;
      
      set${entityName.charAt(0).toUpperCase() + entityName.slice(1)}(data);
      
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };`;

      // Insérer avant le premier useEffect
      const firstUseEffect = content.match(/useEffect\(/);
      if (firstUseEffect) {
        const insertIndex = content.indexOf(firstUseEffect[0]);
        content = content.slice(0, insertIndex) + loadDataFunction + '\n\n  ' + content.slice(insertIndex);
        modified = true;
      }
    }
  }

  // 6. Remplacer les références aux mock data dans le JSX
  Object.keys(entityMappings).forEach(entity => {
    const mockName = `mock${entity.charAt(0).toUpperCase() + entity.slice(1)}`;
    const stateName = entity;
    
    const regex = new RegExp(mockName, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, stateName);
      modified = true;
    }
  });

  // 7. Sauvegarder si des modifications ont été faites
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Migré: ${filePath}`);
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
    ['Producteurs', 'Interviews', 'Users', 'Villages', 'ZonesInterdites', 'Profiles', 'Geographic', 'Questionnaires'].includes(part)
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
      case 'Geographic': 
        if (filePath.includes('Pays')) return 'pays';
        if (filePath.includes('Region')) return 'regions';
        if (filePath.includes('Departement')) return 'departements';
        if (filePath.includes('Sousprefs')) return 'sousprefs';
        return 'geographic';
      default: return 'unknown';
    }
  }
  return 'unknown';
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
  console.log('🚀 Démarrage de la migration des mock data...\n');
  
  const pagesDir = path.join(__dirname, 'src', 'presentation', 'pages');
  
  if (!fs.existsSync(pagesDir)) {
    console.error('❌ Dossier pages non trouvé:', pagesDir);
    return;
  }
  
  const jsxFiles = scanDirectory(pagesDir);
  
  // Filtrer seulement les fichiers qui contiennent des mock data
  const filesToMigrate = jsxFiles.filter(file => {
    const content = fs.readFileSync(file, 'utf8');
    return content.includes('mock') && (
      content.includes('mockProducteurs') || 
      content.includes('mockUsers') ||
      content.includes('mockVillages') ||
      content.includes('mockProfiles') ||
      content.includes('mockQuestionnaires') ||
      content.includes('mockPays') ||
      content.includes('mockRegions') ||
      content.includes('mockDepartements')
    );
  });
  
  console.log(`📂 Trouvé ${filesToMigrate.length} fichiers à migrer:\n`);
  
  let successCount = 0;
  
  filesToMigrate.forEach(file => {
    const relativePath = path.relative(pagesDir, file);
    console.log(`🔄 Migration de: ${relativePath}`);
    
    try {
      if (migrateMockDataInFile(file)) {
        successCount++;
      }
    } catch (error) {
      console.error(`❌ Erreur lors de la migration de ${relativePath}:`, error.message);
    }
  });
  
  console.log(`\n✨ Migration terminée: ${successCount}/${filesToMigrate.length} fichiers migrés avec succès`);
}

// Exécuter le script si appelé directement
if (require.main === module) {
  main();
}

module.exports = {
  migrateMockDataInFile,
  main
};