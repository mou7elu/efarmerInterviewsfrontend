#!/bin/bash

# Script pour mettre à jour toutes les pages restantes avec les appels API
# Ce script applique les modifications de manière automatisée

echo "🚀 Migration des données fictives vers les appels API"
echo "📁 Traitement des pages CRUD restantes..."

# Configuration des entités restantes
declare -A entities=(
    ["Sections"]="sectionsAPI"
    ["Questions"]="questionsAPI,questionsService"
    ["Districts"]="districtAPI"
    ["Villages"]="villagesAPI"
    ["ZonesInterdites"]="zonesInterditesAPI"
    ["Pieces"]="piecesAPI"
    ["Profiles"]="profilesAPI,profilesService"
    ["Users"]="usersAPI,usersService"
    ["Nationalites"]="nationalitesAPI"
)

# Fonction pour mettre à jour les imports API dans un fichier
update_api_imports() {
    local file=$1
    local api_imports=$2
    
    echo "📝 Mise à jour des imports API dans $file"
    
    # Chercher la ligne d'import LoadingSpinner et ajouter l'import API après
    if grep -q "LoadingSpinner" "$file"; then
        # Ajouter l'import API après LoadingSpinner
        sed -i "/import LoadingSpinner/a import { $api_imports, handleApiError } from '@/services/api.js';" "$file"
    fi
}

# Fonction pour remplacer les données mock par des appels API
replace_mock_data() {
    local file=$1
    local api_name=$2
    
    echo "🔄 Remplacement des données mock dans $file"
    
    # Patterns de remplacement courants
    if [[ "$file" == *"ListPage.jsx" ]] || [[ "$file" == *"Page.jsx" ]]; then
        # Page liste - remplacer loadData
        sed -i 's/await new Promise.*/const response = await '"$api_name"'.getAll();/' "$file"
        sed -i 's/setMockData/const data = response.data || response;/' "$file"
        
        # Remplacer handleDelete
        sed -i 's/console.log.*Suppression/await '"$api_name"'.delete(id);/' "$file"
        
    elif [[ "$file" == *"Create"*".jsx" ]]; then
        # Page création - remplacer handleSubmit
        sed -i 's/await new Promise.*/await '"$api_name"'.create(formData);/' "$file"
        
    elif [[ "$file" == *"Edit"*".jsx" ]]; then
        # Page édition - remplacer loadData et handleSubmit
        sed -i 's/await new Promise.*/const response = await '"$api_name"'.getById(id);/' "$file"
        sed -i 's/const mockData.*/const data = response.data || response;/' "$file"
        
    elif [[ "$file" == *"Detail"*".jsx" ]]; then
        # Page détail - remplacer loadData
        sed -i 's/await new Promise.*/const response = await '"$api_name"'.getById(id);/' "$file"
        sed -i 's/const mockData.*/setEntity(response.data || response);/' "$file"
    fi
}

# Traiter chaque entité
for entity in "${!entities[@]}"; do
    api_config="${entities[$entity]}"
    main_api=$(echo "$api_config" | cut -d',' -f1)
    
    echo "🎯 Traitement de l'entité: $entity (API: $main_api)"
    
    # Chemins des fichiers
    base_path="src/presentation/pages"
    
    if [[ "$entity" == "Nationalites" ]] || [[ "$entity" == "NiveauxScolaires" ]]; then
        entity_path="$base_path/Reference"
    else
        entity_path="$base_path/$entity"
    fi
    
    # Chercher tous les fichiers de l'entité
    if [[ -d "$entity_path" ]]; then
        echo "📂 Dossier trouvé: $entity_path"
        
        # Traiter chaque fichier
        for file in "$entity_path"/*.jsx; do
            if [[ -f "$file" ]]; then
                echo "  📄 Traitement: $(basename "$file")"
                
                # Mettre à jour les imports
                update_api_imports "$file" "$api_config"
                
                # Remplacer les données mock
                replace_mock_data "$file" "$main_api"
            fi
        done
    else
        echo "⚠️  Dossier non trouvé: $entity_path"
    fi
    
    echo ""
done

echo "✅ Migration terminée!"
echo "🔍 Vérifiez manuellement les fichiers pour les ajustements spécifiques"
echo "🧪 Testez chaque page pour valider le fonctionnement"