/**
 * Section des caractéristiques du logement
 */
import React from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Chip,
  Box,
  OutlinedInput,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, HomeWork as HomeIcon } from '@mui/icons-material';

const MenageCharacteristicsSection = ({ formData, handleFormChange }) => {
  const typeBatimentOptions = [
    { value: 1, label: 'Villa' },
    { value: 2, label: 'Maison simple' },
    { value: 3, label: 'Logement en bande' },
    { value: 4, label: 'Appartement dans un immeuble' },
    { value: 5, label: 'Concession' },
    { value: 6, label: 'Case traditionnelle' },
    { value: 8, label: 'Autre à préciser' },
  ];

  const materiauBatimentOptions = [
    { value: 1, label: 'Bois' },
    { value: 2, label: 'Tôle' },
    { value: 3, label: 'Banco ou terre battue' },
    { value: 4, label: 'Semi-dur' },
    { value: 5, label: 'Géobéton' },
    { value: 6, label: 'Dur' },
    { value: 7, label: 'Plastique (bâche)' },
    { value: 8, label: 'Autre à préciser' },
  ];

  const materiauToitOptions = [
    { value: 1, label: 'Fibre végétale (paille, papot…)' },
    { value: 2, label: 'Tôle' },
    { value: 3, label: 'Béton (ciment, dalle)' },
    { value: 4, label: 'Tuile / Everite' },
    { value: 5, label: 'Toile en plastique' },
    { value: 6, label: 'Autre à préciser' },
  ];

  const sourceEclairageOptions = [
    { value: 1, label: 'Electricité (CIE)' },
    { value: 2, label: 'Groupe électrogène' },
    { value: 3, label: 'Panneau solaire' },
    { value: 4, label: 'Lampe (à pétrole, à gaz, à huile)' },
    { value: 5, label: 'Bois de chauffe' },
    { value: 6, label: 'Torche' },
    { value: 7, label: 'Autre à préciser' },
  ];

  const sourceEauOptions = [
    { value: 1, label: 'Eau de robinet dans le logement' },
    { value: 2, label: 'Eau de robinet dans la cour' },
    { value: 3, label: 'Robinet public / borne fontaine' },
    { value: 4, label: 'Puit à pompe / forage' },
    { value: 5, label: 'Puit creusé protégé' },
    { value: 6, label: 'Puit creusé pas protégé' },
    { value: 7, label: 'Source d\'eau protégée' },
    { value: 8, label: 'Source d\'eau non protégée' },
    { value: 9, label: 'Eau de surface' },
    { value: 10, label: 'Eau conditionnée en bouteille ou en sachet' },
    { value: 11, label: 'Autre à préciser' },
  ];

  const installationSanitaireOptions = [
    { value: 1, label: 'Chasse d\'eau reliée à un système d\'égouts' },
    { value: 2, label: 'Chasse d\'eau reliée à une fosse septique' },
    { value: 3, label: 'Chasse d\'eau reliée à l\'air libre' },
    { value: 4, label: 'Chasse d\'eau reliée à un lieu inconnu' },
    { value: 5, label: 'Latrine à fosse améliorée ventilée' },
    { value: 6, label: 'Latrine à fosse non ventilée' },
    { value: 7, label: 'Toilette à compostage' },
    { value: 8, label: 'Toilettes suspendues / latrines suspendues' },
    { value: 9, label: 'Pas de toilettes / nature / champs' },
    { value: 10, label: 'Autre (préciser)' },
  ];

  const sourceCombustibleOptions = [
    { value: 1, label: 'Bois de chauffe' },
    { value: 2, label: 'Gaz' },
    { value: 3, label: 'Charbon' },
    { value: 4, label: 'Electricité' },
    { value: 5, label: 'Autre à préciser' },
  ];

  const moyenMobiliteOptions = [
    { value: 1, label: 'Vélo/Bicyclette' },
    { value: 2, label: 'Moto/mobylette' },
    { value: 3, label: 'Véhicule' },
    { value: 4, label: 'Pirogue' },
    { value: 5, label: 'Hors-bord' },
    { value: 6, label: 'Charrette' },
  ];

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">
          <HomeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Caractéristiques du logement
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          {/* Type de bâtiment (choix multiple) */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Q.57 Quel(s) type(s) de bâtiment(s) disposez-vous pour votre ménage ?(choix multiple)</InputLabel>
              <Select
                multiple
                value={formData.TypeBatimentResidence || []}
                onChange={(e) => handleFormChange('TypeBatimentResidence', e.target.value)}
                input={<OutlinedInput label="Q.57 Quel(s) type(s) de bâtiment(s) disposez-vous pour votre ménage ?(choix multiple)" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={typeBatimentOptions.find(o => o.value === value)?.label}
                        size="small"
                      />
                    ))}
                  </Box>
                )}
              >
                {typeBatimentOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {formData.TypeBatimentResidence?.includes(8) && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Préciser le type de bâtiment"
                value={formData.PreciserTypeBatiment || ''}
                onChange={(e) => handleFormChange('PreciserTypeBatiment', e.target.value)}
              />
            </Grid>
          )}

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Q.58 Quel est le principal matériau de construction des bâtiments du ménage ?</InputLabel>
              <Select
                value={formData.PrincipalMateriauBatiment || ''}
                onChange={(e) => handleFormChange('PrincipalMateriauBatiment', e.target.value)}
                displayEmpty
              >
                <MenuItem value=""><em>Sélectionner...</em></MenuItem>
                {materiauBatimentOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {formData.PrincipalMateriauBatiment === 8 && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Préciser le matériau du bâtiment"
                value={formData.PreciserMateriauBatiment || ''}
                onChange={(e) => handleFormChange('PreciserMateriauBatiment', e.target.value)}
              />
            </Grid>
          )}

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Q.59 Quel est le principal matériau du toit du ménage ?</InputLabel>
              <Select
                value={formData.PrincipalMateriauToit || ''}
                onChange={(e) => handleFormChange('PrincipalMateriauToit', e.target.value)}
                displayEmpty
              >
                <MenuItem value=""><em>Sélectionner...</em></MenuItem>
                {materiauToitOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {formData.PrincipalMateriauToit === 6 && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Préciser le matériau du toit"
                value={formData.PreciserMateriauToit || ''}
                onChange={(e) => handleFormChange('PreciserMateriauToit', e.target.value)}
              />
            </Grid>
          )}
<Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Q.60 Quel est le principal type de sanitaire utilisé par le ménage ?</InputLabel>
              <Select
                value={formData.PrincipaleInstallationSanitaire || ''}
                onChange={(e) => handleFormChange('PrincipaleInstallationSanitaire', e.target.value)}
                displayEmpty
              >
                <MenuItem value=""><em>Sélectionner...</em></MenuItem>
                {installationSanitaireOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {formData.PrincipaleInstallationSanitaire === 10 && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Préciser l'installation sanitaire"
                value={formData.PreciserInstallationSanitaire || ''}
                onChange={(e) => handleFormChange('PreciserInstallationSanitaire', e.target.value)}
              />
            </Grid>
          )}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Q.61 Quelle est la principale source de combustible utilisée par le ménage ? </InputLabel>
              <Select
                value={formData.PrincipaleSourceCombustible || ''}
                onChange={(e) => handleFormChange('PrincipaleSourceCombustible', e.target.value)}
                displayEmpty
              >
                <MenuItem value=""><em>Sélectionner...</em></MenuItem>
                {sourceCombustibleOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {formData.PrincipaleSourceCombustible === 5 && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Préciser la source de combustible"
                value={formData.PreciserSourceCombustible || ''}
                onChange={(e) => handleFormChange('PreciserSourceCombustible', e.target.value)}
              />
            </Grid>
          )}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Q.62 Quelle est la principale source d'éclairage du ménage ?</InputLabel>
              <Select
                value={formData.PrincipaleSourceEclairage || ''}
                onChange={(e) => handleFormChange('PrincipaleSourceEclairage', e.target.value)}
                displayEmpty
              >
                <MenuItem value=""><em>Sélectionner...</em></MenuItem>
                {sourceEclairageOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {formData.PrincipaleSourceEclairage === 7 && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Préciser la source d'éclairage"
                value={formData.PreciserSourceEclairage || ''}
                onChange={(e) => handleFormChange('PreciserSourceEclairage', e.target.value)}
              />
            </Grid>
          )}

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Q.63 Quel est le principal mode d'approvisionnement en eau du ménage ?</InputLabel>
              <Select
                value={formData.PrincipaleSourceEau || ''}
                onChange={(e) => handleFormChange('PrincipaleSourceEau', e.target.value)}
                displayEmpty
              >
                <MenuItem value=""><em>Sélectionner...</em></MenuItem>
                {sourceEauOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {formData.PrincipaleSourceEau === 11 && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Préciser la source d'eau"
                value={formData.PreciserSourceEau || ''}
                onChange={(e) => handleFormChange('PreciserSourceEau', e.target.value)}
              />
            </Grid>
          )}

          

          

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Q.64 Quel est le principal moyen de mobilité utilisé ? </InputLabel>
              <Select
                value={formData.PrincipalMoyenMobilite || ''}
                onChange={(e) => handleFormChange('PrincipalMoyenMobilite', e.target.value)}
                displayEmpty
              >
                <MenuItem value=""><em>Sélectionner...</em></MenuItem>
                {moyenMobiliteOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default MenageCharacteristicsSection;
