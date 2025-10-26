# Script PowerShell pour ajouter automatiquement les imports aux pages List
# Utilisation: .\add-entity-helpers-imports.ps1

$pages = @(
    "Geographic\PaysListPage.jsx",
    "Geographic\DepartementsListPage.jsx", 
    "Geographic\SousprefsListPage.jsx",
    "Reference\NationalitesListPage.jsx",
    "Reference\NiveauxScolairesListPage.jsx"
)

$importLine = "import { getValue, getSafeId, getLibelle, extractDataFromApiResponse } from '../../../shared/utils/entityHelpers.js';"

foreach ($page in $pages) {
    $filePath = "c:\Appli\MERN\efarmerInterviews\frontend\src\presentation\pages\$page"
    
    if (Test-Path $filePath) {
        Write-Host "Processing: $page"
        
        $content = Get-Content $filePath
        $newContent = @()
        $importAdded = $false
        
        foreach ($line in $content) {
            if ($line -match "import.*api\.js" -and !$importAdded) {
                $newContent += $line
                $newContent += $importLine
                $importAdded = $true
            } else {
                $newContent += $line
            }
        }
        
        $newContent | Set-Content $filePath
        Write-Host "✅ Added import to $page"
    } else {
        Write-Host "❌ File not found: $filePath"
    }
}

Write-Host "✅ Import addition complete!"
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Manually replace entity property access with getValue() calls"
Write-Host "2. Replace data extraction logic with extractDataFromApiResponse()"
Write-Host "3. Replace ID access with getSafeId()"
Write-Host "4. Test each page for [object Object] errors"