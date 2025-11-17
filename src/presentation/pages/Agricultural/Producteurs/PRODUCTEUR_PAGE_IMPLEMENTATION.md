# Implémentation de la Page Producteur

## Vue d'ensemble du schéma Producteur

Le modèle Producteur contient plus de 100 champs répartis en 9 sections principales:

### 1. **Informations de base**
- MenageId (référence)
- EnqueteurId (référence)
- Code (auto-généré)
- IsExploitant (booléen)

### 2. **Informations Représentant** (si IsExploitant = false)
- NomRepresentant, PrenomRepresentant
- DateNaissRepresentant, PaysNaissRepresentant, LieuNaissRepresentant
- GenreRepresentant, NiveauScolaireRepresentant
- ContactPrincipalRepresentant, ContactSecondaireRepresentant

### 3. **Informations Exploitant** (si IsExploitant = true)
- NomExploitant, PrenomExploitant
- DateNaissExploitant, PaysNaissExploitant, LieuNaissExploitant
- GenreExploitant, NiveauScolaireExploitant
- SituationMatrimonialeExploitant
- PhotoExploitant, PhotoJustificative
- PieceExploitant, NumeroPieceExploitant

### 4. **Composition du ménage**
- NombreMembresMenage
- NombreEnfants, NombreEnfantsScolarisés
- NombrePersonnesChargeHorMenage
- NombreEpouse

### 5. **Caractéristiques du ménage**
- TypeBatimentResidence (choix multiple)
- PrincipalMateriauBatiment
- PrincipalMateriauToit
- PrincipaleSourceEclairage
- PrincipaleSourceEau
- PrincipaleInstallationSanitaire
- PrincipaleSourceCombustible
- PrincipalMoyenMobilite

### 6. **Infrastructure et équipement**
- HasStockageBatimentAgricole, CapaciteStockageKg
- HasMachineAgricole, MachineAgricole
- EquipementSechageAgricole

### 7. **Accès aux services**
- ReseauxMobile (choix multiple)
- HasInternet
- HasInfastructureSante, distanceInfastructureSanteKm
- HasCompteBancaire, StructureBancaire
- HasMobileMoney, StructureMobileMoney
- HasUseMobileMoneyService, TypeServiceMobileMoney
- MontantMensuelMobileMoney, MontantMaximumTransaction

### 8. **Aspects sociaux et culturels**
- HasAppartenanceGroupe, TypeGroupe, SpecialiteGroupe
- HasAppartenanceTontine, TypeTontine, MontantTontine

### 9. **Exploitation agricole**
- SurfaceAgricoleTotaleUseHa
- SurfaceAgricoleTotaleJachèreHa
- NombreParcellesAnacarde
- OutillageExploitationAnacarde (array)
- PetitOutillageExploitationAnacarde (array)
- MaterielTransportExploitationAnacarde (array)
- OtherSpeculations (array)
- CultureVivriers (array)
- TypeElevages (array)

## Approche recommandée

### Option 1: Formulaire multi-étapes (Wizard)
Diviser le formulaire en 5-7 étapes:
1. Informations de base + Exploitant/Représentant
2. Composition et caractéristiques du ménage
3. Infrastructure et équipement
4. Services bancaires et télécommunications
5. Aspects sociaux
6. Exploitation agricole
7. Révision et soumission

### Option 2: Accordéons (Implémentation actuelle simplifiée)
Utiliser des `Accordion` MUI pour organiser les sections:
- Permet de voir toutes les sections
- L'utilisateur peut ouvrir/fermer selon besoin
- Facilite la navigation

### Option 3: Onglets (Tabs)
Utiliser des onglets MUI:
- Navigation horizontale
- Bon pour les formulaires complexes
- Nécessite validation par onglet

## Code simplifié fourni

Le code que je vous ai créé utilise l'approche des **Accordéons** avec les sections principales:
- Section Informations de base
- Section Représentant (conditionnel)
- Section Exploitant (conditionnel)
- Section Composition du ménage
- Section Surfaces agricoles
- Section Services bancaires
- Section Aspects sociaux

## Champs à ajouter

Pour compléter l'implémentation, ajoutez progressivement:

### Caractéristiques du ménage (Section 5)
```jsx
<Accordion>
  <AccordionSummary>
    <Typography>Caractéristiques du ménage</Typography>
  </AccordionSummary>
  <AccordionDetails>
    {/* TypeBatimentResidence, Matériaux, Sources, etc. */}
  </AccordionDetails>
</Accordion>
```

### Infrastructure (Section 6)
```jsx
<Accordion>
  <AccordionSummary>
    <Typography>Infrastructure et équipement</Typography>
  </AccordionSummary>
  <AccordionDetails>
    {/* Stockage, machines, équipement */}
  </AccordionDetails>
</Accordion>
```

### Exploitation (Section 9)
```jsx
<Accordion>
  <AccordionSummary>
    <Typography>Exploitation anacarde et autres cultures</Typography>
  </AccordionSummary>
  <AccordionDetails>
    {/* Outillage, autres spéculations, cultures vivrières, élevages */}
  </AccordionDetails>
</Accordion>
```

## Gestion des sous-schémas

Pour les arrays (OutillageExploitationAnacarde, OtherSpeculations, etc.):

```jsx
const [outillages, setOutillages] = useState([]);

const addOutillage = () => {
  setOutillages([...outillages, {
    Rubrique: '',
    NombreTotalEquipement: 0,
    NombreTotalEquipementPropriete: 0
  }]);
};

const removeOutillage = (index) => {
  setOutillages(outillages.filter((_, i) => i !== index));
};

// Rendu
{outillages.map((outillage, index) => (
  <Grid container spacing={2} key={index}>
    <Grid item xs={12} md={4}>
      <FormControl fullWidth>
        <InputLabel>Type d'outillage</InputLabel>
        <Select
          value={outillage.Rubrique}
          onChange={(e) => {
            const updated = [...outillages];
            updated[index].Rubrique = e.target.value;
            setOutillages(updated);
          }}
        >
          <MenuItem value="Sécateur">Sécateur</MenuItem>
          <MenuItem value="Scie de recépage">Scie de recépage</MenuItem>
          <MenuItem value="Ébancheur,émondoir">Ébancheur,émondoir</MenuItem>
          <MenuItem value="Autres outillage">Autres outillage</MenuItem>
        </Select>
      </FormControl>
    </Grid>
    {/* Autres champs... */}
    <Grid item xs={12} md={2}>
      <IconButton onClick={() => removeOutillage(index)} color="error">
        <DeleteIcon />
      </IconButton>
    </Grid>
  </Grid>
))}
<Button onClick={addOutillage} startIcon={<AddIcon />}>
  Ajouter un outillage
</Button>
```

## Validation

Ajouter une validation avant soumission:

```jsx
const validateForm = () => {
  const errors = [];
  
  if (!formData.MenageId) {
    errors.push('Le ménage est requis');
  }
  
  if (formData.IsExploitant) {
    if (!formData.NomExploitant) errors.push('Nom de l\'exploitant requis');
    if (!formData.PrenomExploitant) errors.push('Prénom de l\'exploitant requis');
  } else {
    if (!formData.LienRepresentExploitant) errors.push('Lien avec l\'exploitant requis');
    if (!formData.NomRepresentant) errors.push('Nom du représentant requis');
  }
  
  if (errors.length > 0) {
    setError(errors.join(', '));
    return false;
  }
  
  return true;
};

const handleSubmitCreate = async () => {
  if (!validateForm()) return;
  
  // Continuer avec la création...
};
```

## Recommandations

1. **Implémenter progressivement**: Commencez par les sections essentielles
2. **Tester fréquemment**: Testez après chaque section ajoutée
3. **Utiliser des composants réutilisables**: Créez des composants pour les arrays
4. **Ajouter des indicateurs de progression**: Montrer à l'utilisateur où il en est
5. **Sauvegarder les brouillons**: Permettre de sauvegarder et reprendre plus tard

## Fichiers à créer

Pour une architecture propre, créez:

1. `ProducteurFormSections/`
   - `BasicInfoSection.jsx`
   - `RepresentantSection.jsx`
   - `ExploitantSection.jsx`
   - `MenageCompositionSection.jsx`
   - `MenageCharacteristicsSection.jsx`
   - `InfrastructureSection.jsx`
   - `ServicesSection.jsx`
   - `SocialSection.jsx`
   - `ExploitationSection.jsx`

2. `ProducteurFormArrays/`
   - `OutillageList.jsx`
   - `SpeculationsList.jsx`
   - `CultureVivrierList.jsx`
   - `ElevageList.jsx`

3. Utiliser dans `ProducteursListPage.jsx`:
```jsx
import BasicInfoSection from './ProducteurFormSections/BasicInfoSection';
import ExploitantSection from './ProducteurFormSections/ExploitantSection';
// etc.
```

Cette approche modulaire rendra le code maintenable et testable.
